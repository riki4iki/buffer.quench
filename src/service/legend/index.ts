import {
  IContext,
  IParamContext,
  IParamIdState,
  IThreadState
} from "../../types";
import { all, get } from "./crud";

export default class LegendService {
  public static async legendEndPoint(
    ctx: IParamContext<IThreadState, IParamIdState>
  ) {
    try {
      const history = await get(ctx.state.thread, ctx.params.id);
      ctx.status = 200;
      ctx.body = history;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
  public static async legendsEndPoint(ctx: IContext<IThreadState>) {
    try {
      const histories = await all(ctx.state.thread);
      ctx.status = 200;
      ctx.body = histories;
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
}
