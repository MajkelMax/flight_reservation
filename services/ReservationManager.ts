import { ReservationStatus } from "../models/types";
import { Reservation } from "../models/Reservation";

export class ReservationManager {
    // Mapa przechowująca nasze rezerwacje w pamięci (symulacja bazy danych)
    private reservations: Map<string, Reservation> = new Map();

    /**
     * Zapisuje gotowy obiekt rezerwacji (np. utworzony przez Budowniczego) w bazie.
     */
    public save(reservation: Reservation): void {
        this.reservations.set(reservation.id, reservation);
    }

    /**
     * Aktualizuje status istniejącej rezerwacji.
     */
    public updateStatus(id: string, status: ReservationStatus): void {
        const res = this.reservations.get(id);
        if (res) {
            res.status = status;
        }
    }

    /**
     * Pobiera szczegóły rezerwacji po jej ID.
     */
    public getDetails(id: string): Reservation | undefined {
        return this.reservations.get(id);
    }
}