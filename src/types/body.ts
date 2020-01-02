export interface IBody {}

export interface IPostBody extends IBody {
   context: string;
   expireDate: Date;
}
export interface IThreadBody extends IBody {
   name: string;
}
export interface IUserBody extends IBody {
   email: string;
   password: string;
}
