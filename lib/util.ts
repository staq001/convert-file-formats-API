import * as fs from "node:fs/promises";
import type { Util } from "../src/types";
import { access } from "node:fs";

// Delete a file/folder if it exists, else throw an error.

export const util: Util = {
  deleteFile: async (path: string) => {
    try {
      await fs.unlink(path);
    } catch (err) {
      throw new Error(`${err}`);
    }
  },

  deleteFolder: async (path: string) => {
    try {
      await fs.rm(path, { recursive: true });
    } catch (err) {
      throw new Error(`${err}`);
    }
  },

  checkPath: async (path: string) => {
    return fs
      .access(path, fs.constants.F_OK)
      .then(() => {
        // do nothing
      })
      .catch(async () => {
        await fs.mkdir(path);
      });
  },

  fiveMinutesThenDelete: async (path: string) => {
    // do nothing
  },
};

// question is, why not put it in the service? that way we delete the record from the db and delete the actual storage of the folders and files as well?
