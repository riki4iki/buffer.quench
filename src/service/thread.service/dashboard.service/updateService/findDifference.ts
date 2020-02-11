import { validatedPage } from "../connectionService/convertors.type";
import { toDeleter } from "./updaters.type";

export async function difference(before: toDeleter[], after: validatedPage[]): Promise<{ toConnect: validatedPage[]; toDisconnect: toDeleter[] }> {
   const beforeIds = before.map(item => item.converted.social_id);
   const afterIds = after.map(item => item.validated.id);

   const toConnect = after.filter(item => !beforeIds.includes(item.validated.id));
   const toDisconnect = before.filter(item => !afterIds.includes(item.converted.social_id));

   return { toConnect, toDisconnect };
}
