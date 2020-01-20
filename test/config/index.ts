export * from "./const";
export * from "./endpoints";
export * from "./facebook";
export * from "./create-user";

export const nextMinutes = (minutes: number): Date => {
   const now = new Date();
   const next = now.setMinutes(now.getMinutes() + minutes);
   return new Date(next);
};
