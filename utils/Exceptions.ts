export class AppError extends Error {
    constructor(public message: string, public code: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Błędy wejścia (nieprawidłowe dane od użytkownika)
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
    }
}

// Błędy biznesowe (np. brak miejsc w samolocie, zły status)
export class DomainError extends AppError {
    constructor(message: string) {
        super(message, 'DOMAIN_ERROR');
    }
}

// Błędy zewnętrzne (np. awaria bazy danych, problem z bramką płatniczą)
export class InfrastructureError extends AppError {
    constructor(message: string) {
        super(message, 'INFRASTRUCTURE_ERROR');
    }
}