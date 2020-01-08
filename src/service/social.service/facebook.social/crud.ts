import { Repository, getManager } from "typeorm";
import { FacebookUser as FacebookUserModel, User as SystemUserModel } from "../../../models";
import { omit } from "lodash";
import { BadRequest } from "http-errors";
import { fbService as fb } from "../../../lib";

export async function all(sysUser: SystemUserModel): Promise<Array<FacebookUserModel>> {
   const facebookUserRepository: Repository<FacebookUserModel> = getManager().getRepository(FacebookUserModel);

   const connectedFacebookSocials: Array<FacebookUserModel> = await facebookUserRepository.find({ user: sysUser });

   return connectedFacebookSocials.map(social => <FacebookUserModel>omit(social, "accessToken"));
}

export async function get(sysUser: SystemUserModel, id: string): Promise<FacebookUserModel> {
   const facebookUserRepository: Repository<FacebookUserModel> = getManager().getRepository(FacebookUserModel);

   const facebookUser = await facebookUserRepository.findOne({ id: id, user: sysUser });
   if (!facebookUser) {
      const err = new BadRequest("Social not fount by input id");
      throw err;
   } else {
      return facebookUser;
   }
}
export async function add(sysUser: SystemUserModel, token: string): Promise<FacebookUserModel> {
   const apiFacebookUser = await fb.getUser(token);
   const facebookUserRepository: Repository<FacebookUserModel> = getManager().getRepository(FacebookUserModel);

   const dbFacebookUser = await facebookUserRepository.findOne({ fbId: apiFacebookUser.id, user: sysUser });

   const longToken = await fb.longLiveUserAccessToken(token);
   if (dbFacebookUser) {
      //update long live access token for page from database
      const toUpdate = new FacebookUserModel();
      toUpdate.id = dbFacebookUser.id;
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
