import { BadRequest } from "http-errors";
import { ValidationError } from "class-validator";
import { IFacebookAnswerMessage } from "./facebook";
import { StatusCodeError } from "request-promise/errors";
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
export class FacebookError extends Error {
   constructor(err: StatusCodeError) {
      super();
      const decoded = JSON.parse(err.message);
      console.log(decoded);
   }
   status: number = 400;
   answer: IFacebookAnswerMessage;
}
