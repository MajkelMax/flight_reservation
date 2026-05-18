import { PaymentStrategy } from "./PaymentStrategy";
import { Logger } from "../utils/Logger";

export class CreditCardPaymentStrategy implements PaymentStrategy {
    constructor(private cardNumber: string, private cvv: string, private logger: Logger) {}

    public async pay(amount: number, currency: string, transactionId: string): Promise<boolean> {
        this.logger.info(`Przetwarzanie płatności kartą konczącą się na...${this.cardNumber.slice(-4)} na kwotę ${amount} ${currency}`);
        // Symulacja połączenia z API operatora kart
        return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    }
}

export class BlikPaymentStrategy implements PaymentStrategy {
    constructor(private blikCode: string, private logger: Logger) {}

    public async pay(amount: number, currency: string, transactionId: string): Promise<boolean> {
        this.logger.info(`Autoryzacja kodem BLIK: ${this.blikCode} dla transakcji ${transactionId}`);
        // Symulacja API systemu BLIK
        return new Promise((resolve) => setTimeout(() => resolve(true), 300));
    }
}