import { Post } from "models";

export interface ISocialPage {
   id: string;
   accessToken: string;
   social_id: string;
   post: (post: Post) => Promise<boolean>;
}
