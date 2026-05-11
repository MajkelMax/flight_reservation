import { ValidationError } from "./Exceptions";

export class ValidationHelper {
    public static requireNonEmpty(value: string, fieldName: string): void {
        if (!value || value.trim() === "") {
            throw new ValidationError(`Pole '${fieldName}' nie może być puste.`);
        }
    }

    public static requirePositiveNumber(value: number, fieldName: string): void {
        if (value === undefined || value <= 0) {
            throw new ValidationError(`Pole '${fieldName}' musi być liczbą dodatnią.`);
        }
    }
}