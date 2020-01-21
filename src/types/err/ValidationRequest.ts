import { IValidationError } from "./IValidationError";

import { BadRequest } from "http-errors";
import { ValidationError } from "class-validator";

export class ValidationRequest extends BadRequest {
   constructor(errors: ValidationError[]) {
      super();
      this.validationArray = errors.map(error => {
         return { property: error.property, constraints: error.constraints };
      });
   }
   validationArray: Array<IValidationError>;
}
