import { validate, ValidationError } from "class-validator";
import { Repository, getManager } from "typeorm";
import { BadRequest } from "http-errors";

import { Thread, Legend, Post } from "models";

/**
 * Promise. Create new legend and save in database based on executed post
 * @param post Post - instanse of Post model for what legend will be created
 * @param result Boolean - true or false that means successful execution
 */
export async function create(post: Post, result: boolean): Promise<Legend> {
   const legendRepository: Repository<Legend> = getManager().getRepository(Legend);
   const newLegend = new Legend();
   newLegend.context = post.context;
   newLegend.expireDate = post.expireDate;
   newLegend.thread = post.thread;
   newLegend.status = result;
   const errors: ValidationError[] = await validate(newLegend);
   if (errors.length > 0) {
      //Since legend creating occurs without http request we cant return http errors. So need to log this....
      throw errors;
   } else {
      const legend = await legendRepository.save(newLegend);
      return legend;
   }
}
/**
 * Promise - return target legend from database by input thread and id from url. Used for GET http method
 * @param thread Thread - current thread from earlier route /thread/:id. required for creating relations
 * @param id String - legend id. required for legend identify
 */
export async function get(thread: Thread, id: string): Promise<Legend> {
   const legendRepository: Repository<Legend> = getManager().getRepository(Legend);
   const legend = await legendRepository.findOne({ id: id, thread: thread });
   if (!legend) {
      const err = new BadRequest("legend not found");
      throw err;
   } else {
      return legend;
   }
}
/**
 * Promise - return all legend of input thread in array. Used for GET http method
 * @param thread Thread - current thread from earlier route /thread/:id. required for creating relations
 */
export async function all(thread: Thread): Promise<Array<Legend>> {
   const legendRepository: Repository<Legend> = getManager().getRepository(Legend);
   const legends = await legendRepository.find({ thread: thread });

   return legends;
}
/**
 * Promise - delete target legend by input thread and id, Used for deleting old legend after some days
 * @param thread Thread - current thread from earlier route /thread/:id. required for creating relations
 * @param id String - legend id. required for legend identify
 */
export async function del(thread: Thread, id: string): Promise<Legend> {
   const legendRepository: Repository<Legend> = getManager().getRepository(Legend);
   const legend = await legendRepository.findOne({ id: id, thread: thread });
   if (!legend) {
      const err = new Error("legend not found");
      throw err;
   } else {
      const removed = await legendRepository.remove(legend);
      return removed;
   }
}
