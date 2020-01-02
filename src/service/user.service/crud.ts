import { getManager, Repository, Not, Equal } from "typeorm";
import { BadRequest } from "http-errors";
import { IUserBody, ValidationRequest } from "../../types";
import { User } from "../../models";
import { validate, ValidationError } from "class-validator";
/**
 * Return all users in databases. Not need now
 */
export async function all() {
   const userRepository: Repository<User> = getManager().getRepository(User);
   const users: Array<User> = await userRepository.find();
   return users;
}
/**
 * Promise. Return target user by id. Used for GET method
 * @param id String - input uuid from url to get target resource
 */
export async function get(id: string) {
   const userRepository: Repository<User> = getManager().getRepository(User);
   const user = await userRepository.findOne({ id: id });
   if (!user) {
      const err = new BadRequest("User doesn't exist with input session");
      throw err;
   } else {
      return user;
   }
}
/**
 * Promise. Create new user by email and password. Return created user. Used for POST method
 * @param body Interface IUserBody - body from ctx.request.body that contain email and password
 */
export async function create(body: IUserBody) {
   const userRepository: Repository<User> = getManager().getRepository(User);
   const newUser = new User();
   newUser.email = body.email;
   newUser.password = body.password;
   const errors: ValidationError[] = await validate(newUser);

   if (errors.length > 0) {
      const err = new ValidationRequest(errors);
      throw err;
   } else if (await userRepository.findOne({ email: body.email })) {
      const err = new BadRequest("email already exist");
      throw err;
   } else {
      const saved = await userRepository.save(newUser);
      return saved;
   }
}
/**
 * Promise - update target user by id with input body, return updated user. Used for PUT method
 * @param id String - input uuid from url to get target resource
 * @param body Interface IUserBody - body from ctx.request.body that contain email and password
 */
export async function update(id: string, body: IUserBody) {
   const userRepository: Repository<User> = getManager().getRepository(User);
   const before = await userRepository.findOne({ id: id });
   if (!before) {
      const err = new BadRequest("user doesn't exist");
      throw err;
   } else {
      const newUser = new User();
      newUser.id = before.id;
      newUser.email = body.email;
      newUser.password = body.password;

      const errors: ValidationError[] = await validate(newUser);
      if (errors.length) {
         const err = new ValidationRequest(errors);
         throw err;
      } else if (await userRepository.findOne({ id: Not(Equal(id)), email: body.email })) {
         const err = new BadRequest("email already exist");
         throw err;
      } else {
         const after = await userRepository.save(newUser);
         return after;
      }
   }
}
/**
 * Promise. delete target user by id, return removed object w/o id. Used for DELETE http methods
 * @param id String - input uuid from url to get target resource
 */
export async function del(id: string) {
   const userRepository: Repository<User> = getManager().getRepository(User);
   const user = await userRepository.findOne({ id: id });
   if (!user) {
      const err = new BadRequest("user doesn't exist");
      throw err;
   } else {
      const removed = await userRepository.remove(user);
      return removed;
   }
}
