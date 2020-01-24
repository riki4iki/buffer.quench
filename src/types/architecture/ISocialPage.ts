import { Post } from "../../models";

export interface ISocialPage {
   id: string;
   accessToken: string;
   post: (post: Post) => Promise<boolean>;
}
