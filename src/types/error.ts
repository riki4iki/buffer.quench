import { BadRequest } from "http-errors";

interface IValidationError {
  property: string;
  constraints: Object;
}
export class ValidationRequest extends BadRequest {
  validationArray: Array<IValidationError>;
}
