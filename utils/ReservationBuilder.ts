import { Reservation } from "../models/Reservation";
import { Passenger, ReservationStatus, SeatClass } from "../models/types";
import { ValidationHelper } from "./ValidationHelper"; // Użycie z poprzedniego laboratorium

export class ReservationBuilder {
    private id: string = "";
    private flightId: string = "";
    private passengers: Passenger[] = [];
    private status: ReservationStatus = "PENDING";
    private seatClass: SeatClass = "ECONOMY"; // Wartość domyślna
    private hasInsurance: boolean = false;    // Wartość domyślna
    private extraBaggage: number = 0;         // Wartość domyślna

    public setFlight(flightId: string): ReservationBuilder {
        this.flightId = flightId;
        return this;
    }

    public addPassenger(passenger: Passenger): ReservationBuilder {
        this.passengers.push(passenger);
        return this;
    }

    public setSeatClass(seatClass: SeatClass): ReservationBuilder {
        this.seatClass = seatClass;
        return this;
    }

    public withInsurance(): ReservationBuilder {
        this.hasInsurance = true;
        return this;
    }

    public addExtraBaggage(count: number): ReservationBuilder {
        this.extraBaggage = count;
        return this;
    }

    public build(): Reservation {
        // Generowanie ID i walidacja tuż przed stworzeniem obiektu
        this.id = Math.random().toString(36).substr(2, 9).toUpperCase();
        ValidationHelper.requireNonEmpty(this.flightId, "Flight ID");

        if (this.passengers.length === 0) {
            throw new Error("Rezerwacja musi posiadać co najmniej jednego pasażera.");
        }

        return new Reservation(
            this.id,
            this.flightId,
            this.passengers,
            this.status,
            this.seatClass,
            this.hasInsurance,
            this.extraBaggage
        );
    }
}