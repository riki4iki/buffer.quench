import { validatedPage } from "../connectionService/convertors.type";
import { ISocialPage } from "../../../../types";
export function difference(before: ISocialPage[], after: validatedPage[]): { toConnect: validatedPage[]; toDisconnect: ISocialPage[] } {
   const beforeIds = before.map(item => item.id);
   const afterIds = after.map(item => item.validated.id);

   const toConnect = after.filter(item => !beforeIds.includes(item.validated.id));
   const toDisconnect = before.filter(item => !afterIds.includes(item.id));

   return { toConnect, toDisconnect };
}
