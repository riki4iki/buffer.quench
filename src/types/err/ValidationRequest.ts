import { BadRequest } from "http-errors";
import { ValidationError } from "class-validator";

import { IValidationError } from "./IValidationError";

class ValidationRequest extends BadRequest {
   message: string;
   validationArray: IValidationError[];
   constructor(errors: ValidationError[]) {
      super();
      console.log(errors);
      this.validationArray = errors.map(error => {
         const { property, constraints } = error;
         return { property, constraints };
      });
      this.message = JSON.stringify(this.validationArray);
   }
}
export { ValidationRequest };
