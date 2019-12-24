import Router from "koa-router";
import { omit } from "lodash";
const pageRouter = new Router();
import {
  IContext,
  IThreadState,
  IParamContext,
  IParamIdState,
  PageType
} from "../../../../../types";
import { Repository, getManager } from "typeorm";
import {
  Page,
  FacebookPage as fbPage,
  FacebookUser as fbUserModel
} from "../.././../../../models";
import { fbService as fb } from "../../../../../lib";

pageRouter.get("/", async (ctx: IContext<IThreadState>) => {
  //return all pages connected with dat thread
  const pageRepository: Repository<Page> = getManager().getRepository(Page);
  const fbPageRepository: Repository<fbPage> = getManager().getRepository(
    fbPage
  );

  const pages = await pageRepository.find({
    thread: ctx.state.thread,
    type: PageType.FacebookPage
  });
  const findFbPages = Promise.all(
    pages.map(async page => {
      const dbPage = await fbPageRepository.findOne(page.pageId);
      return dbPage;
    })
  );
  const fbPages = await findFbPages;
  ctx.body = fbPages.map(page => omit(page, "accessToken"));
});
pageRouter.post("/", async (ctx: IContext<IThreadState>) => {
  //require array with facebook id pages, facebook_access token
  const user_access_token_2h: string = ctx.request.body.token;

  const fbApiUser = await fb.getUser(user_access_token_2h);

  const fbUserRepository: Repository<fbUserModel> = getManager().getRepository(
    fbUserModel
  );

  const fbUser = await fbUserRepository.findOne({
    user: ctx.state.user,
    fbId: fbApiUser.id
  });

  const pagesInputString: string = ctx.request.body.pages;
  const pagesString: string = pagesInputString.replace(/'/g, '"');
  const pagesIdArray: Array<string> = JSON.parse(pagesString);

  const pageRepository: Repository<Page> = getManager().getRepository(Page);
  const fbPageRepository: Repository<fbPage> = getManager().getRepository(
    fbPage
  );

  const savePages = Promise.all(
    pagesIdArray.map(async id => {
      const fbPage = await fbPageRepository.findOne({ id: id, fbUser: fbUser });
      if (!fbPage) {
        throw {
          status: 400,
          message: `page with id: ${id} doesn't connect to facebook user`
        };
      } else {
        const page = await pageRepository.findOne({ pageId: fbPage.id });
        if (!page) {
          const newPage = new Page();
          newPage.thread = ctx.state.thread;
          newPage.type = PageType.FacebookPage;
          newPage.pageId = fbPage.id;
          return await pageRepository.save(newPage);
        } else {
          return page;
        }
      }
    })
  );
  await savePages.catch(err => ctx.app.emit("error", err, ctx));

  ctx.status = 201;
});
pageRouter.del(
  "/:id",
  async (ctx: IParamContext<IThreadState, IParamIdState>) => {
    const id: string = ctx.params.id;
    const pageRepository: Repository<Page> = getManager().getRepository(Page);

    const page: Page = await pageRepository.findOne(id);

    try {
      await pageRepository.remove(page);
      ctx.status = 204;
    } catch (err) {
      ctx.app.emit("err", err, ctx);
    }
  }
);

export { pageRouter };
