import { validate, ValidationError } from "class-validator";

import { Post } from "models";
import { ValidationRequest } from "types/err";

const validatePost = async (post: Post): Promise<void> => {
   console.log(post);
   const toValidate = new Post();
   toValidate.context = post.context;
   toValidate.expireDate = new Date(post.expireDate);

   const errors: ValidationError[] = await validate(toValidate);
   if (errors.length > 0) {
      console.log(errors);
      const badRequest = new ValidationRequest(errors);
      throw badRequest;
   }
};

export { validatePost };
