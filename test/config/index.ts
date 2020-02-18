export * from "./const";
export * from "./endpoints";
export * from "./facebook";
export * from "./before";
export * from "./db";

export const nextMinutes = (minutes: number): Date => {
   const now = new Date();
   const next = now.setMinutes(now.getMinutes() + minutes);
   return new Date(next);
};

export const nextSecond = (seconds: number): Date => {
   const now = new Date();
   const next = now.setSeconds(now.getSeconds() + seconds);
   return new Date(next);
};
