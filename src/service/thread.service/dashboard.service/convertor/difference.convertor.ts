import { validateConvertedType, disconnectConevertedType } from "./convertor.types";

type sorted = Promise<{ toConnect: validateConvertedType[]; toDisconnect: disconnectConevertedType[] }>;

const difference = async (before: disconnectConevertedType[], after: validateConvertedType[]): sorted => {
   const beforeIds = before.map(item => item.converted.social_id);
   const afterIds = after.map(item => item.validated.id);

   const toConnect = after.filter(item => !beforeIds.includes(item.validated.id));
   const toDisconnect = before.filter(item => !afterIds.includes(item.converted.social_id));

   return { toConnect, toDisconnect };
};
export { difference };
