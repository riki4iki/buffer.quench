import jwt from "jsonwebtoken";
import { jwtConfig } from "../config";
import { Repository, getManager } from "typeorm";
import Session from "../models/refresh";

const generateAccess = async (id: string): Promise<string> => {
  const payload = {
    id: id,
    jti: jwtConfig.jti,
    iss: jwtConfig.issuer,
    sub: jwtConfig.subject,
    alg: jwtConfig.alg
  };
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.accessLife
  });
};
const generateRefresh = async (id: string): Promise<string> => {
  const payload = {
    id: id,
    jti: jwtConfig.jti,
    iss: jwtConfig.issuer,
    sub: jwtConfig.subject,
    alg: jwtConfig.alg
  };
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshLife
  });
};
const expireIn = async (): Promise<number> => {
  return Math.round(new Date().getTime() / 1000);
};
const createSession = async (refresh: string, userId: string) => {
  const sessionRepository: Repository<Session> = getManager().getRepository(
    Session
  );
  const old = await sessionRepository.findOne({ where: { user: userId } });
  const session = new Session();
  session.user = userId;
  session.token = refresh;
  if (!old) {
    await sessionRepository.save(session);
  } else {
    session.id = old.id;
    const next = await sessionRepository.save(session);
  }
  return session;
};
export default class JwtService {
  public static async createPair(id: string) {
    const access = await generateAccess(id); //generate acces token
    const refresh = await generateRefresh(id); //generate refresh token
    const expiresIn = (await expireIn()) + jwtConfig.accessLife; //get expireIn from access token

    const session = await createSession(refresh, id);

    return {
      access_token: access,
      refresh_token: refresh,
      expiresIn: expiresIn
    };
  }
  public static async payload(token: string): Promise<any> {
    try {
      const payLoad = await jwt.verify(token, jwtConfig.secret);
      return payLoad;
    } catch (err) {
      return Promise.reject({ ...err, ...{ status: 401 } });
    }
  }
  public static async verify(token: string) {}
}
