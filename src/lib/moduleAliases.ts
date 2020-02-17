import { addAlias } from "module-alias";

export const aliases = (root: string, folders: string[]) => {
   folders.map(path => addAlias(path, `${root}/${path}`));
};
