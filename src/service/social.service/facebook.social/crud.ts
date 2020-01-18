import { Repository, getManager } from "typeorm";
import { FacebookUser as FacebookUserModel, User as SystemUserModel } from "../../../models";
import { omit } from "lodash";
import { BadRequest } from "http-errors";
import { fbService as fb } from "../../../lib";

/**
 * Promise. return all connected facebook socials from database
 * @param sysUser User - system current user decoded from jwt access_token for whom will be finded facebook socials
 */
export async function all(sysUser: SystemUserModel): Promise<Array<FacebookUserModel>> {
   const facebookUserRepository: Repository<FacebookUserModel> = getManager().getRepository(FacebookUserModel);

   const connectedFacebookSocials: Array<FacebookUserModel> = await facebookUserRepository.find({ user: sysUser });

   return connectedFacebookSocials.map(social => <FacebookUserModel>omit(social, "accessToken"));
}
/**
 * Promise. return target facebook socials from database by current user and id
 * @param sysUser User - system user decoded from jwt access_tokem for whom will be finded facebook social
 * @param id String - uuid resource for getting target social from database
 */
export async function get(sysUser: SystemUserModel, id: string): Promise<FacebookUserModel> {
   const facebookUserRepository: Repository<FacebookUserModel> = getManager().getRepository(FacebookUserModel);

   const facebookUser = await facebookUserRepository.findOne({ id: id, user: sysUser });
   if (!facebookUser) {
      const err = new BadRequest("social not found");
      throw err;
   } else {
      return facebookUser;
   }
}
/**
 * Promise. connect new facebook social for current user to database, generate long live access token from facebook api
 * @param sysUser User - system user for whom will be added new facebook user
 * @param token String - user_access_token_2h from facebook authrization
 */
export async function add(sysUser: SystemUserModel, token: string): Promise<FacebookUserModel> {
   const apiFacebookUser = await fb.getUser(token);
   const facebookUserRepository: Repository<FacebookUserModel> = getManager().getRepository(FacebookUserModel);

   const dbFacebookUser = await facebookUserRepository.findOne({ fbId: apiFacebookUser.id, user: sysUser });

   const longToken = await fb.longLiveUserAccessToken(token);
   if (dbFacebookUser) {
      //Facebook user already exists, then update access token for this
      //update long live access token for page from database
      const toUpdate = new FacebookUserModel();
      toUpdate.id = dbFacebookUser.id;
      toUpdate.fbId = dbFacebookUser.fbId;
      toUpdate.accessToken = longToken.access_token;

      const updated = await facebookUserRepository.save(toUpdate);

      return updated;
   } else {
      const newFacebookUser = new FacebookUserModel();
      newFacebookUser.accessToken = longToken.access_token;
      newFacebookUser.fbId = apiFacebookUser.id;
      newFacebookUser.user = sysUser;

      const saved = await facebookUserRepository.save(newFacebookUser);

      return saved;
   }
}
/**
 * EndPoint. Disconnect target facebook user from current user
 * @param sysUser User - system user for whom will be disconnected facebook user
 * @param id String - uuid resource for getting target social from database
 */
export async function del(sysUser: SystemUserModel, id: string): Promise<FacebookUserModel> {
   const facebookUserRepository: Repository<FacebookUserModel> = getManager().getRepository(FacebookUserModel);
   const facebookUser: FacebookUserModel = await facebookUserRepository.findOne({ where: { id: id, user: sysUser }, relations: ["user"] });
   if (!facebookUser) {
      const err = new BadRequest("Social not found");
      throw err;
   } else {
      const removed = await facebookUserRepository.remove(facebookUser);
      return removed;
   }
}
