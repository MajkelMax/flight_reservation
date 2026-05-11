import { Passenger, SeatClass, ReservationStatus } from "../models/types";

export interface Reservation {
    id: string;
    flightId: string;
    passengers: Passenger[];
    status: ReservationStatus;
}

export class ReservationManager {
    private reservations: Map<string, Reservation> = new Map();

    public create(flightId: string, passengers: Passenger[]): string {
        const id = Math.random().toString(36).substr(2, 9).toUpperCase();
        const newReservation: Reservation = { id, flightId, passengers, status: "PENDING" };
        this.reservations.set(id, newReservation);
        return id;
    }

    public updateStatus(id: string, status: ReservationStatus): void {
        const res = this.reservations.get(id);
        if (res) res.status = status;
    }

    public getDetails(id: string): Reservation | undefined {
        return this.reservations.get(id);
    }
}