import { Currency } from "../models/types";

export class PaymentProcessor {
    private apiKey: string;
    private gatewayUrl: string;

    constructor(apiKey: string, gatewayUrl: string) {
        this.apiKey = apiKey;
        this.gatewayUrl = gatewayUrl;
    }
    public async processPayment(reservationId: string, amount: number, currency: Currency, paymentMethodId: string): Promise<boolean> {
        console.log(`Autoryzacja płatności: ${amount} ${currency} dla rezerwacji ${reservationId}...`);

        // Symulacja opóźnienia zapytania do bramki płatniczej (np. BLIK / Karta)
        return new Promise((resolve) => {
            setTimeout(() => {
                // Dla uproszczenia zadania zawsze zwracamy sukces (true)
                resolve(true);
            }, 800);
        });
    }
}