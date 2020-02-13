import { IsNotEmpty, IsArray, ArrayNotEmpty } from "class-validator";

import { Post } from "models";

import { PageBody } from "./page.body";

class DashboardBody {
   @IsNotEmpty()
   post: Post;

   @IsNotEmpty()
   @IsArray()
   @ArrayNotEmpty()
   pages: PageBody[];
}

export { DashboardBody };
