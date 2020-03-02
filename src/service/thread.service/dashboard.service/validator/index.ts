import { validateDashboard } from "./dashboard.validator";
import { validatePages } from "./pages.validator";
import { validatePost } from "./post.validator";

import { DashboardBody } from "./dashboard.body";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateRequestBody = async (body: any): Promise<DashboardBody> => {
   const dashboard = new DashboardBody();
   dashboard.pages = body.pages;
   dashboard.post = body.post;

   await validateDashboard(dashboard);
   await validatePages(dashboard.pages);
   await validatePost(dashboard.post);

   return dashboard;
};

export { validateRequestBody };
