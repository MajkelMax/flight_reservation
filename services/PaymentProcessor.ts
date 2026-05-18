import { PaymentStrategy } from "../strategies/PaymentStrategy";

export class PaymentProcessor {
    private strategy: PaymentStrategy | null = null;

    // Metoda pozwalająca na dynamiczną zmianę strategii
    public setStrategy(strategy: PaymentStrategy): void {
        this.strategy = strategy;
    }

    public async executePayment(reservationId: string, amount: number, currency: string): Promise<boolean> {
        if (!this.strategy) {
            throw new Error("Nie wybrano metody płatności (Brak strategii).");
        }

        // Wykonanie algorytmu zadeklarowanego w strategii
        return await this.strategy.pay(amount, currency, reservationId);
    }
}