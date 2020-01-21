/**
 * Response from facebook api for picture/icon
 */
export interface IFacebookPicture {
   data: {
      height: number;
      width: number;
      url: string;
      is_silhouette: boolean;
   };
}
