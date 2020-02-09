import { Thread } from "../../../../models";
import { ISocialPage } from "../../../../types";

import { DisconnectPromiseFactory } from "./disconnectPromise.factory";

export const disconnectPages = () => {};

const disconnectPage = async (thread: Thread, page: ISocialPage) => {
   const { id } = page;
};
