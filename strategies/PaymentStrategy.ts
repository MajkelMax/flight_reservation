export interface PaymentStrategy {
    pay(amount: number, currency: string, transactionId: string): Promise<boolean>;
}