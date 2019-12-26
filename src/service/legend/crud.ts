import { Thread, Legend, Post } from "../../models";
import { validate, ValidationError } from "class-validator";
import { Repository, getManager } from "typeorm";
import { BadRequest } from "http-errors";

export async function create(post: Post, result: boolean): Promise<Legend> {
  const legendRepository: Repository<Legend> = getManager().getRepository(
    Legend
  );
  const newLegend = new Legend();
  newLegend.context = post.context;
  newLegend.expireDate = post.expireDate;
  newLegend.thread = post.thread;
  newLegend.status = result;
  const errors: ValidationError[] = await validate(newLegend);
  if (errors.length > 0) {
    //MAYBE LOGGER
    throw errors;
  } else {
    const legend = await legendRepository.save(newLegend);
    return legend;
  }
}
export async function get(thread: Thread, id: string): Promise<Legend> {
  const legendRepository: Repository<Legend> = getManager().getRepository(
    Legend
  );
  const legend = await legendRepository.findOne({ id: id, thread: thread });
  if (!legend) {
    const err = new BadRequest("legend not found");
    throw err;
  } else {
    return legend;
  }
}
export async function all(thread: Thread): Promise<Array<Legend>> {
  const legendRepository: Repository<Legend> = getManager().getRepository(
    Legend
  );
  const legends = await legendRepository.find({ thread: thread });

  return legends;
}
export async function del(thread: Thread, id: string) {}
