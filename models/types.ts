export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
export type SeatClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST_CLASS";
export type Currency = "PLN" | "EUR" | "USD";

export interface Passenger {
    id: string;
    firstName: string;
    lastName: string;
    passportNumber: string;
    dateOfBirth: Date;
}

export interface FlightInfo {
    flightId: string;
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureTime: Date;
    arrivalTime: Date;
}

export interface PriceConfig {
    baseAmount: number;
    taxes: number;
    currency: Currency;
}

export type TicketData = FlightInfo & PriceConfig & {
    ticketId: string;
    passenger: Passenger;
    seatClass: SeatClass;
    seatNumber: string;
};