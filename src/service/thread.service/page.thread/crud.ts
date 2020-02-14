import { Repository, getManager } from "typeorm";
import { Thread, Page } from "models";

/**
 * Return all connected pages by input thread from database
 * @param currentThread Thread - instanse from context state of current thread
 */
export async function all(currentThread: Thread): Promise<Array<Page>> {
   const pageRepository: Repository<Page> = getManager().getRepository(Page);
   const connectedPages: Array<Page> = await pageRepository.find({ where: { thread: currentThread } });
   const response = Promise.all(connectedPages.map(async page => await page.toResponse()));
   return response;
}
