import { Thread, Page, Post } from "../models/";
export default class CronService {
  constructor() {}
  addListener(thread: Thread, id: string, callback: Function) {}
  updateListener(id: string, callback: Function) {}
  removeListener(id: string) {}
  serialize() {}
  deserialize() {}
}
