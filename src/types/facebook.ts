export interface IFacebookPost {
  id: string;
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
  picture: {
    data: {
      height: number;
      width: number;
      url: string;
      is_silhouette: boolean;
    };
  };
}
export interface ILongLiveUserToken {
  access_token: string;
  token_type: string;
}
