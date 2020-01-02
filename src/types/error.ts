import { BadRequest } from "http-errors";
import { ValidationError } from "class-validator";

interface IValidationError {
   property: string;
   constraints: Object;
}
export class ValidationRequest extends BadRequest {
   constructor(errors: ValidationError[]) {
      super();
      this.validationArray = errors.map(error => {
         return { property: error.property, constraints: error.constraints };
      });
   }
   validationArray: Array<IValidationError>;
}
export class NoContent extends Error {
   status = 204;
}
