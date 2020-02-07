import { IPostBody } from "./IPostBody";
import { IPageBody } from "./IPageBody";

export interface IDashboardBody {
   post: IPostBody;
   pages: IPageBody[];
}
