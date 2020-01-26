export const endpoints = {
   auth: {
      local: { sign_up: "/api/v1/auth/localAuth/sign-up", sign_in: "/api/v1/auth/localAuth/sign-in" },
      facebook: { sign_in: "/api/v1/auth/fbAuth/sign-in" },
   },
   user: {
      access: "/api/v1/user",
      social: {
         access: "/api/v1/user/social",
         facebook: {
            access: "/api/v1/user/social/facebook",
            id: {
               access: (id: string) => `/api/v1/user/social/facebook/${id}`,
               page: { access: (id: string) => `/api/v1/user/social/facebook/${id}/page` },
            },
         },
      },
      thread: {
         access: "/api/v1/user/thread",
         id: (id: string) => {
            return {
               access: `/api/v1/user/thread/${id}`,
               post: {},
               page: {},
               legend: {},
            };
         },
      },
   },
};
