import { SearchService } from "../services/SearchService";
import { ReservationManager } from "../services/ReservationManager";
import { PaymentProcessor } from "../services/PaymentProcessor";
import { Passenger } from "../models/types";
import { Logger } from "../utils/Logger";
import { ValidationHelper } from "../utils/ValidationHelper";
import { ValidationError, DomainError, InfrastructureError } from "../utils/Exceptions";
import { ReservationBuilder } from "../utils/ReservationBuilder";
import { Reservation } from "../models/Reservation";

export class FlightBookingSystem {
    // Wstrzykiwanie zależności przez konstruktor zapewniające niskie sprzężenie
    constructor(
        private searchService: SearchService,
        private reservationManager: ReservationManager,
        private paymentProcessor: PaymentProcessor,
        private logger: Logger
    ) {}

    /**
     * Główny przypadek użycia: Kompletny proces wyszukiwania lotu,
     * tworzenia złożonej rezerwacji (Builder) oraz autoryzacji płatności.
     */
    public async bookFlight(origin: string, destination: string, passengers: Passenger[]): Promise<string> {
        this.logger.info(`Rozpoczynam proces rezerwacji trasy: ${origin} -> ${destination} dla ${passengers.length} pasażerów.`);

        try {
            // 1. Walidacja wejścia przy użyciu wspólnego modułu pomocniczego (Zasada DRY)
            ValidationHelper.requireNonEmpty(origin, "Miejsce wylotu");
            ValidationHelper.requireNonEmpty(destination, "Miejsce przylotu");
            if (!passengers || passengers.length === 0) {
                throw new ValidationError("Rezerwacja musi zawierać co najmniej jednego pasażera.");
            }

            // 2. Wyszukiwanie dostępnych lotów w warstwie usług
            const flights = this.searchService.searchFlights(origin, destination);
            if (flights.length === 0) {
                throw new DomainError(`Brak dostępnych lotów dla trasy ${origin} - ${destination}.`);
            }

            // 3. Wykorzystanie Wzorca Kreacyjnego Budowniczego (Builder) do elastycznego tworzenia obiektu
            const builder = new ReservationBuilder()
                .setFlight(flights[0].flightId)
                .setSeatClass("ECONOMY"); // Można rozbudować o parametryzację klas miejsc

            for (const passenger of passengers) {
                builder.addPassenger(passenger);
            }

            const reservation = builder.build();

            // Zapis nowej instancji w managerze stanu rezerwacji
            this.reservationManager.save(reservation);
            this.logger.info(`Pomyślnie zablokowano miejsca przy użyciu Budowniczego. Wygenerowano ID: ${reservation.id}. Przetwarzanie płatności...`);

            // 4. Przetwarzanie płatności (Potencjalne źródło błędu zewnętrznej infrastruktury)
            const paymentSuccess = await this.paymentProcessor.processPayment(reservation.id, 500, "PLN", "CARD_123");
            if (!paymentSuccess) {
                throw new InfrastructureError("Transakcja została odrzucona przez zewnętrzną bramkę płatniczą.");
            }

            // 5. Aktualizacja stanu w przypadku sukcesu operacji
            this.reservationManager.updateStatus(reservation.id, "CONFIRMED");
            this.logger.info(`Proces rezerwacji ${reservation.id} zakończony pełnym sukcesem.`);
            return reservation.id;

        } catch (error) {
            // 6. Sklasyfikowana obsługa specyficznych wyjątków wraz z wielopoziomowym logowaniem
            if (error instanceof ValidationError) {
                this.logger.warn(`Błąd walidacji danych wejściowych: ${error.message}`);
            } else if (error instanceof DomainError) {
                this.logger.warn(`Odmowa biznesowa (Domenowa): ${error.message}`);
            } else if (error instanceof InfrastructureError) {
                this.logger.error(`Awaria infrastruktury zewnętrznej: ${error.message}`, error);
            } else {
                this.logger.error("Wystąpił nieznany, nieoczekiwany błąd krytyczny aplikacji.", error);
            }

            // Ponowne rzucenie wyjątku w celu poinformowania warstw wyższych (np. Kontrolera API / UI)
            throw error;
        }
    }

    /**
     * Przypadek użycia: Anulowanie istniejącej rezerwacji
     */
    public cancelBooking(reservationId: string): void {
        this.logger.info(`Żądanie anulowania rezerwacji o ID: ${reservationId}.`);
        try {
            ValidationHelper.requireNonEmpty(reservationId, "ID Rezerwacji");

            const details = this.reservationManager.getDetails(reservationId);
            if (!details) {
                throw new DomainError(`Nie można anulować. Nie znaleziono rezerwacji o ID: ${reservationId}`);
            }

            this.reservationManager.updateStatus(reservationId, "CANCELLED");
            this.logger.info(`Rezerwacja ${reservationId} została pomyślnie anulowana.`);
        } catch (error) {
            if (error instanceof ValidationError || error instanceof DomainError) {
                this.logger.warn(`Nieudana próba anulowania rezerwacji: ${(error as Error).message}`);
            } else {
                this.logger.error(`Błąd krytyczny podczas operacji anulowania: ${(error as Error).message}`);
            }
            throw error;
        }
    }

    /**
     * Przypadek użycia: Pobieranie i wyświetlanie szczegółów wybranej rezerwacji
     */
    public getBookingDetails(reservationId: string): Reservation {
        this.logger.info(`Pobieranie szczegółów rezerwacji o ID: ${reservationId}.`);
        try {
            ValidationHelper.requireNonEmpty(reservationId, "ID Rezerwacji");

            const details = this.reservationManager.getDetails(reservationId);
            if (!details) {
                throw new DomainError(`Nie znaleziono w bazie danych rezerwacji o ID: ${reservationId}`);
            }

            return details;
        } catch (error) {
            if (error instanceof ValidationError || error instanceof DomainError) {
                this.logger.warn(`Problem podczas wyszukiwania szczegółów: ${(error as Error).message}`);
            } else {
                this.logger.error(`Błąd krytyczny systemu podczas pobierania danych: ${(error as Error).message}`);
            }
            throw error;
        }
    }
}