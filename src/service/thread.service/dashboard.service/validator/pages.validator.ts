import { validate, ValidationError } from "class-validator";

import { ValidationRequest } from "types/err";

import { PageBody } from "./page.body";

const validatePages = async (pages: PageBody[]) => {
   const validatePromises = Promise.all(
      pages.map(async page => {
         const toValidate = new PageBody();
         toValidate.page = page.page;
         toValidate.type = page.type;
         toValidate.socialId = page.socialId;

         const errors: ValidationError[] = await validate(toValidate);
         if (errors.length > 0) {
            const badRequest = new ValidationRequest(errors);
            throw badRequest;
         }
      }),
   );
   await validatePromises;
};

export { validatePages };
