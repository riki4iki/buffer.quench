interface IPayload {
  id: string;
  jti: string;
  iss: string;
  sub: string;
  alg: string;
}
interface IJwtPair {
  access_token: string;
  refresh_token: string;
  expiresIn: number;
}

export { IPayload, IJwtPair };
