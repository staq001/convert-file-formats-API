import * as fs from "node:fs/promises";
import type { Util } from "../src/types";

// Delete a file/folder if it exists, else throw an error.

export const util: Util = {
  deleteFile: async (path: string) => {
    try {
      await fs.unlink(path);
    } catch (err) {
      // do nothing
    }
  },

  deleteFolder: async (path: string) => {
    try {
      await fs.rm(path, { recursive: true });
    } catch (err) {
      // do nothing
    }
  },
};
