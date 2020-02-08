import { IsNotEmpty, IsUUID, ValidatorConstraintInterface, ValidatorConstraint, Validate } from "class-validator";

import { SocialType } from "../../../types/architecture/SocialTypes";
import { IPageBody } from "../../../types/body";

@ValidatorConstraint({ name: "isSocialType", async: false })
class IncludeSocialTypes implements ValidatorConstraintInterface {
   validate(type: string) {
      const types = Object.values(SocialType) as string[];
      return types.includes(type);
   }
   defaultMessage() {
      return `invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`;
   }
}

export class PageBody implements IPageBody {
   @IsNotEmpty()
   @IsUUID()
   socialId: string;

   @IsNotEmpty()
   @Validate(IncludeSocialTypes)
   type: string;

   @IsNotEmpty()
   page: string;
}
