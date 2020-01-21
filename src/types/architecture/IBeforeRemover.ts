export interface IBeforeRemover {
   _delete?: () => Promise<void>;
}
