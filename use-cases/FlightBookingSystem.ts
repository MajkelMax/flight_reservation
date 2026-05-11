import { SearchService } from "../services/SearchService";
import { ReservationManager } from "../services/ReservationManager";
import { PaymentProcessor } from "../services/PaymentProcessor";
import { Passenger } from "../models/types";

export class FlightBookingSystem {
    constructor(
        private searchService: SearchService,
        private reservationManager: ReservationManager,
        private paymentProcessor: PaymentProcessor
    ) {}
    public async bookFlight(origin: string, destination: string, passengers: Passenger[]): Promise<string | null> {
        // 1. Wyszukiwanie
        const flights = this.searchService.searchFlights(origin, destination);
        if (flights.length === 0) return null;

        // 2. Tworzenie rezerwacji
        const reservationId = this.reservationManager.create(flights[0].flightId, passengers);

        // 3. Procesowanie płatności (symulacja)
        const paymentSuccess = await this.paymentProcessor.processPayment(reservationId, 500, "PLN", "CARD_123");

        if (paymentSuccess) {
            this.reservationManager.updateStatus(reservationId, "CONFIRMED");
            return reservationId;
        } else {
            this.reservationManager.updateStatus(reservationId, "CANCELLED");
            return null;
        }
    }

    // Przypadek użycia: Anulowanie rezerwacji
    public cancelBooking(reservationId: string): void {
        this.reservationManager.updateStatus(reservationId, "CANCELLED");
    }
}