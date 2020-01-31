export const endpoints = {
   auth: {
      refresh: "/api/v1/auth/refresh",
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
               post: {
                  access: `/api/v1/user/thread/${id}/post`,
                  id: (post_id: string) => `/api/v1/user/thread/${id}/post/${post_id}`,
               },
               page: {
                  access: `/api/v1/user/thread/${id}/page`,
                  facebook: {
                     access: `/api/v1/user/thread/${id}/page/facebook`,
                     id: (facebook_page_id: string) => `/api/v1/user/thread/${id}/page/facebook/${facebook_page_id}`,
                  },
               },
               legend: {
                  access: `/api/v1/user/thread/${id}/legend`,
                  id: (legend_id: string) => `/api/v1/user/thread/${id}/legend/${legend_id}`,
               },
            };
         },
      },
   },
};
