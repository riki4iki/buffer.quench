export interface IValidationError {
   property: string;
   constraints: { [type: string]: string };
}
