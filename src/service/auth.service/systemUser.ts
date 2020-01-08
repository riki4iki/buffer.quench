import { getManager, Repository } from "typeorm";
import { User, FacebookUser as fbUser } from "../../models";
import { Unauthorized } from "http-errors";

/**
 * Promise. return system user from database by email or throw Unauthorized
 * @param email String - user email for find system user in database
 */
export async function userByEmail(email: string): Promise<User> {
   const userRepository: Repository<User> = getManager().getRepository(User);

   const user = await userRepository.findOne({ where: { email: email }, relations: ["social"] });
   if (!user) {
      //user with email doesn't exist in system, return 401
      const err = new Unauthorized("invalid email, user does not exist");
      throw err;
   } else {
      return user;
   }
}
/**
 * Promise. return facebook user from database by facebook user identifier
 * @param id String - user id of facebook important for getting facebook user from database
 */
export async function facebookUser(id: string): Promise<fbUser> {
   const facebookUserRepository: Repository<fbUser> = getManager().getRepository(fbUser);
   const facebookUser = await facebookUserRepository.find({
      where: { fbId: id },
      relations: ["user"], //find with system user reference will return user object in facebookUser.User
   });
   if (facebookUser.length < 1) {
      const err = new Unauthorized("No accounts in system with that facebook user");
      throw err;
   } else if (facebookUser.length > 1) {
      const err = new Unauthorized("Target facebook account belongs two or more users");
      throw err;
   } else {
      const [target] = facebookUser;
      return target;
   }
}
