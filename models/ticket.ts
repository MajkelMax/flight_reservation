import { TicketData, Passenger, SeatClass, Currency } from "./types";

export class Ticket {
    public readonly ticketId: string;
    public passenger: Passenger;
    public seatClass: SeatClass;
    public seatNumber: string;

    public flightId: string;
    public departureAirportCode: string;
    public arrivalAirportCode: string;
    public departureTime: Date;
    public arrivalTime: Date;

    public baseAmount: number;
    public taxes: number;
    public currency: Currency;

    constructor(data: TicketData) {

    }
}