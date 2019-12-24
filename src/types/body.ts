import { validate, ValidationError, IsDate, IsNotEmpty } from "class-validator";
import { ValidationRequest } from "./error";
interface IBody {
  validate: () => Promise<void>;
}
export class PostBody implements IPostBody {
  constructor(context: string, date: Date) {
    this.context = context;
    this.expireDate = date;
  }
  @IsNotEmpty()
  context: string;

  @IsNotEmpty()
  expireDate: Date;
  public async validate(): Promise<void> {
    const errors = await validate(this);
    if (errors.length > 0) {
      const err = new ValidationRequest();
      err.validationArray = errors.map(error => {
        return { property: error.property, constraints: error.constraints };
      });
      throw err;
    } else {
      return null;
    }
  }
}
export interface IPostBody extends IBody {
  context: string;
  expireDate: Date;
}
