export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(404, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Solicitud inválida") {
    super(400, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto con el estado actual del recurso") {
    super(409, message);
  }
}
