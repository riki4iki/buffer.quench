import { validate, ValidationError } from "class-validator";

import { ValidationRequest } from "types/index";

import { DashboardBody } from "./dashboard.body";

const validateDashboard = async (dashboard: DashboardBody): Promise<void> => {
   const toValidate = new DashboardBody();
   toValidate.pages = dashboard.pages;
   toValidate.post = dashboard.post;

   const errors: ValidationError[] = await validate(toValidate);
   if (errors.length > 0) {
      const badRequest = new ValidationRequest(errors);
      throw badRequest;
   }
};

export { validateDashboard };
