import { BadRequest } from "http-errors";

import { SocialType } from "types/architecture/SocialTypes";

const factoryBadRequest = () => {
   const badRequest = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
   throw badRequest;
};

export { factoryBadRequest };
