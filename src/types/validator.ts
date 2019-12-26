import { IBody } from "./body";
import { IsNotEmpty, validate, ValidationError } from "class-validator";

export interface IValidator<T> {
  validate: (body: T) => Promise<ValidationError[]>;
}
export class Validator<T> implements IValidator<T> {
  async validate(body: T) {
    const errors: ValidationError[] = await validate(body);
    return errors;
  }
}
export class PostValidation {
  @IsNotEmpty()
  context: string;

  @IsNotEmpty()
  expireDate: Date;
}
