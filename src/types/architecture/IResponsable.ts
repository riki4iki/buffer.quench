export interface IResponsable<T> {
   toResponse: () => Promise<T>;
}
