import { validate, IsNotEmpty, IsArray, ValidationError, ArrayNotEmpty } from "class-validator";
import { IDashboardBody } from "../../../types/body";
import { ValidationRequest } from "../../../types/err";

import { Post } from "../../../models";
import { PageBody } from "./pageBody.validator";

class DashboardBody {
   @IsNotEmpty()
   post: Post;

   @IsNotEmpty()
   @IsArray()
   @ArrayNotEmpty()
   pages: PageBody[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function validateDashboardBody(body: any): Promise<IDashboardBody> {
   const dashboardBody = new DashboardBody();
   dashboardBody.pages = body.pages;
   dashboardBody.post = body.post;

   const dashboardErrors: ValidationError[] = await validate(dashboardBody);
   if (dashboardErrors.length > 0) {
      const badRequest = new ValidationRequest(dashboardErrors);
      throw badRequest;
   }
   console.log("dashboard validated");

   await validatePost(dashboardBody.post);

   await validatePages(dashboardBody.pages);

   return body as IDashboardBody;
}

const validatePost = async (toValidate: Post): Promise<void> => {
   const post = new Post();
   post.context = toValidate.context;
   post.expireDate = new Date(toValidate.expireDate);
   const postErrors: ValidationError[] = await validate(post);
   if (postErrors.length > 0) {
      console.log(postErrors);
      const badRequest = new ValidationRequest(postErrors);
      throw badRequest;
   }
   console.log("post validated");
};

const validatePages = async (toValidate: PageBody[]): Promise<void> => {
   await Promise.all(
      toValidate.map(async page => {
         const pageToValidate = new PageBody();
         pageToValidate.page = page.page;
         pageToValidate.socialId = page.socialId;
         pageToValidate.type = page.type;
         const pageErrors: ValidationError[] = await validate(pageToValidate);
         if (pageErrors.length > 0) {
            console.log(pageErrors);
            const badRequest = new ValidationRequest(pageErrors);
            throw badRequest;
         }
      }),
   );
   console.log("pages validated");
};
