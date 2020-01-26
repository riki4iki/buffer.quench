export interface IResponsible<T> {
   toResponse: () => Promise<T>;
}
