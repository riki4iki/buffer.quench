import { ValidatorConstraintInterface, ValidatorConstraint } from "class-validator";

import { SocialType } from "types/architecture/SocialTypes";

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
export { IncludeSocialTypes };
