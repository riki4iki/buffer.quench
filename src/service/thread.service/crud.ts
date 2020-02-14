import { getManager, Repository, Not, Equal } from "typeorm";
import { BadRequest } from "http-errors";
import { validate, ValidationError } from "class-validator";
import { omit } from "lodash";

import { User, Thread } from "models";
import { IThreadBody, ValidationRequest } from "types";
/**
 * Promise - Create ne thread by current user and unique input name, return thread instance saved in database
 * @param user - current user taken from access jwt token in headers
 */
export async function create(user: User, body: IThreadBody): Promise<Thread> {
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);

   //create new thread instance
   const newThread = new Thread();
   newThread.user = user;
   newThread.name = body.name;

   const errors: ValidationError[] = await validate(newThread);
   if (errors.length > 0) {
      //throw valdation errors
      const validationErrors = new ValidationRequest(errors);
      throw validationErrors;
   } else if (await threadRepository.findOne({ user: user, name: newThread.name })) {
      //in database already thread with input name alredy exist
      const err = new BadRequest(`thread with name '${newThread.name}' already exist`);
      throw err;
   } else {
      //save in database
      const saved = await threadRepository.save(newThread);
      return omit(saved, "user") as Thread;
   }
}
/**
 * Promise that important for getting target thread models from database by id and currnent user
 * @param user - current user, that taken from jwt toke in headres
 * @param id - inpurt uuid(string - resource from url) for searching in database, taken from url
 */
export async function get(user: User, id: string): Promise<Thread> {
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);
   //find by user,id
   const thread: Thread = await threadRepository.findOne({
      id: id,
      user: user,
   });
   if (!thread) {
      //if thread undefined throw error bad request
      const err = new BadRequest("thread not found");
      throw err;
   } else {
      return thread;
   }
}
/**
 * Promise. important for getting array with all thread of current user
 * @param user - currnet user, that taken from jwt access token from headers
 */
export async function all(user: User): Promise<Array<Thread>> {
   //get repository
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);

   //find all thread by current user
   const threads: Array<Thread> = await threadRepository.find({ user: user });

   return threads; //return array in promise
}
/**
 * Promise. update target thread by id for current user, return updated thread
 * @param user - current user taken from jwt access token in headers
 * @param id - inpurt uuid(string - resource from url) for searching in database, taken from url
 */
export async function update(user: User, id: string, body: IThreadBody): Promise<Thread> {
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);
   //find thread with input id
   const before = await threadRepository.findOne({ user: user, id: id });
   if (!before) {
      //id thread doesn't exist in database throw badrequest
      const err = new BadRequest("thread not found");
      throw err;
   } else {
      //thread finded, create new instance for updating
      const newThread = new Thread();
      newThread.id = before.id;
      newThread.user = before.user;
      newThread.name = body.name;

      //validate
      const errors: ValidationError[] = await validate(newThread);
      if (errors.length > 0) {
         //throw errors with 400 status
         const validationErrors = new ValidationRequest(errors);
         throw validationErrors;
      } else if (await threadRepository.findOne({ id: Not(Equal(before.id)), name: body.name, user: user })) {
         //check for thread with new name in database, name must be unique value
         const err = new BadRequest(`thread with name: '${body.name}' already exist`);
         throw err;
      } else {
         //resave thread and return
         const after = threadRepository.save(newThread);
         return after;
      }
   }
}
/**
 * Promise. Delete target thread by id for current user. Delete other cascades(Page, Post, Legend)
 * @param user - cuurent user taken from jwt access token in headers
 * @param id - inpurt uuid(string - resource from url) for searching in database, taken from url
 */
export async function del(user: User, id: string): Promise<Thread> {
   const threadRepository: Repository<Thread> = getManager().getRepository(Thread);
   const thread = await threadRepository.findOne({ id: id, user: user });
   if (!thread) {
      const err = new BadRequest("thread not found");
      throw err;
   } else {
      const removed = await threadRepository.remove(thread);
      return removed;
   }
}
