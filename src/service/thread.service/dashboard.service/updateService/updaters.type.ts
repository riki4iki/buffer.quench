import { Thread } from "../../../../models";
import { ISocialPage } from "../../../../types";
export type getterDeleter = (thread: Thread, id: string) => Promise<ISocialPage>;

export type updatePromises = {
   getterPromise: (thread: Thread, id: string) => Promise<ISocialPage>;
   deleterPromise: (thread: Thread, id: string) => Promise<ISocialPage>;
};

export type toDeleter = {
   converted: ISocialPage;
   deleterPromise: getterDeleter;
};
