export interface ISocialPage {
   id: string;
   accessToken: string;
   post: (token) => Promise<boolean>;
}
