export interface IPayload {
  id: string;
  jti: string;
  iss: string;
  sub: string;
  alg: string;
}
export interface IJwtPair {
  access_token: string;
  refresh_token: string;
  expiresIn: number;
}

export interface IFacebookPage {
  id: string;
  access_token: string;
  name: string;
  tasks: Array<string>;
  cover: {
    cover_id: string;
    offset_x: number;
    offset_y: number;
    source: string;
    id: string;
  };
  category: string;
}

export interface IFacebookUser {
  id: string;
  name: string;
  email: string;
}
