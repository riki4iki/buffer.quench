import { Thread } from "models";
import { ISocialPage } from "types";

import { validateConvertedType } from "./convertor.types";

const connectPages = async (thread: Thread, body: validateConvertedType[]): Promise<ISocialPage[]> => {
   const connectedPages = Promise.all(
      body.map(async item => {
         const connected = await connectPage(thread, item);
         return connected;
      }),
   );
   return connectedPages;
};

const connectPage = async (thread: Thread, item: validateConvertedType): Promise<ISocialPage> => {
   const { social, validated, promise } = item;
   const connected = await promise(thread, social, validated);
   return connected;
};

export { connectPages };
