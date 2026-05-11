import { FlightInfo } from "../models/types";

export class SearchService {
    // Symulacja bazy danych lotów
    private availableFlights: FlightInfo[] = [
        { flightId: "LO123", departureAirportCode: "WAW", arrivalAirportCode: "LHR", departureTime: new Date("2024-06-01T10:00:00"), arrivalTime: new Date("2024-06-01T12:30:00") },
        { flightId: "LO456", departureAirportCode: "WAW", arrivalAirportCode: "JFK", departureTime: new Date("2024-06-02T14:00:00"), arrivalTime: new Date("2024-06-02T22:30:00") }
    ];

    public searchFlights(origin: string, destination: string): FlightInfo[] {
        return this.availableFlights.filter(f =>
            f.departureAirportCode === origin && f.arrivalAirportCode === destination
        );
    }
}