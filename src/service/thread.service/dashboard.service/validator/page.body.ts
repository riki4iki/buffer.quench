import { IsNotEmpty, IsUUID, Validate } from "class-validator";

import { IPageBody } from "types/body";

import { IncludeSocialTypes } from "./isSocialType.constrainter";

class PageBody implements IPageBody {
   @IsNotEmpty()
   @IsUUID()
   socialId: string;

   @IsNotEmpty()
   @Validate(IncludeSocialTypes)
   type: string;

   @IsNotEmpty()
   page: string;
}

export { PageBody };
