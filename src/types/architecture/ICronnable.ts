export interface ICronnable {
   id: string;
   expireDate: Date;
   cb: () => Promise<void>;
}
