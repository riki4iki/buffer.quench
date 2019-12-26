export interface IBody {}

export interface IPostBody extends IBody {
  context: string;
  expireDate: Date;
}
