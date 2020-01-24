import { Post } from "../../models";

export interface IExecuter {
   create: (cronable: Post) => Promise<void>;
   update: (cronable: Post) => Promise<void>;
   del: (id: string) => Promise<void>;
}
