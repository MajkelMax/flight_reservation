import { Passenger, ReservationStatus, SeatClass } from "./types";

export class Reservation {
    public readonly id: string;
    public readonly flightId: string;
    public readonly passengers: Passenger[];
    public status: ReservationStatus;
    public readonly seatClass: SeatClass;
    public readonly hasInsurance: boolean;
    public readonly extraBaggage: number;

    constructor(
        id: string,
        flightId: string,
        passengers: Passenger[],
        status: ReservationStatus,
        seatClass: SeatClass,
        hasInsurance: boolean,
        extraBaggage: number
    ) {
        this.id = id;
        this.flightId = flightId;
        this.passengers = passengers;
        this.status = status;
        this.seatClass = seatClass;
        this.hasInsurance = hasInsurance;
        this.extraBaggage = extraBaggage;
    }
}