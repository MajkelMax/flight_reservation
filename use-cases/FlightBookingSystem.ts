import { SearchService } from "../services/SearchService";
import { ReservationManager } from "../services/ReservationManager";
import { PaymentProcessor } from "../services/PaymentProcessor";
import { Passenger } from "../models/types";
import { Logger } from "../utils/Logger";
import { ValidationHelper } from "../utils/ValidationHelper";
import { ValidationError, DomainError, InfrastructureError } from "../utils/Exceptions";

export class FlightBookingSystem {
    constructor(
        private searchService: SearchService,
        private reservationManager: ReservationManager,
        private paymentProcessor: PaymentProcessor,
        private logger: Logger
    ) {}

    public async bookFlight(origin: string, destination: string, passengers: Passenger[]): Promise<string> {
        this.logger.info(`Rozpoczynam proces rezerwacji trasy: ${origin} -> ${destination} dla ${passengers.length} pasażerów.`);

        try {
            // 1. Walidacja wejścia (wykorzystanie modułu pomocniczego w celu uniknięcia duplikacji)
            ValidationHelper.requireNonEmpty(origin, "Miejsce wylotu");
            ValidationHelper.requireNonEmpty(destination, "Miejsce przylotu");
            if (passengers.length === 0) {
                throw new ValidationError("Rezerwacja musi zawierać co najmniej jednego pasażera.");
            }

            // 2. Wyszukiwanie
            const flights = this.searchService.searchFlights(origin, destination);
            if (flights.length === 0) {
                throw new DomainError(`Brak dostępnych lotów dla trasy ${origin} - ${destination}.`);
            }

            // 3. Tworzenie rezerwacji
            const reservationId = this.reservationManager.create(flights[0].flightId, passengers);
            this.logger.info(`Pomyślnie zablokowano miejsca. Wygenerowano ID rezerwacji: ${reservationId}. Przetwarzanie płatności...`);

            // 4. Płatność (Potencjalny błąd infrastruktury)
            const paymentSuccess = await this.paymentProcessor.processPayment(reservationId, 500, "PLN", "CARD_123");
            if (!paymentSuccess) {
                throw new InfrastructureError("Transakcja została odrzucona przez zewnętrzną bramkę płatniczą.");
            }

            // 5. Sukces
            this.reservationManager.updateStatus(reservationId, "CONFIRMED");
            this.logger.info(`Proces rezerwacji ${reservationId} zakończony pełnym sukcesem.`);
            return reservationId;

        } catch (error) {
            // 6. Sklasyfikowana obsługa wyjątków
            if (error instanceof ValidationError) {
                this.logger.warn(`Błąd walidacji danych: ${error.message}`);
            } else if (error instanceof DomainError) {
                this.logger.warn(`Odmowa biznesowa: ${error.message}`);
            } else if (error instanceof InfrastructureError) {
                this.logger.error(`Awaria infrastruktury zewnętrznej: ${error.message}`, error);
            } else {
                this.logger.error("Wystąpił nieznany błąd krytyczny aplikacji.", error);
            }

            // Re-throw exception after logging, to inform upper layers (e.g. HTTP Controller)
            throw error;
        }
    }
}