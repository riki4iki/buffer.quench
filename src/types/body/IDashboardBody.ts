import { IPostBody } from "./IPostBody";
import { IUknownPageBody } from "./IUknownPageBody";

export interface IDashboardBody {
   post: IPostBody;
   pages: IUknownPageBody[];
}
