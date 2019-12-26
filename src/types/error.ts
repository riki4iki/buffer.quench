import { BadRequest } from "http-errors";

interface IValidationError {
  property: string;
  constraints: Object;
}
export class ValidationRequest extends BadRequest {
  validationArray: Array<IValidationError>;
}
export class ValidationError extends Error {
  validationArray: Array<IValidationError>;
}
export class NoContent extends Error {
  status = 204;
}
