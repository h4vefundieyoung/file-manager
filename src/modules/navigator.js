import { chdir, cwd } from "process";
import { homedir } from "os";
import { resolve, parse } from "path";

import { ArgsError } from "../errors/ArgsError.js"
import { Module } from "../abstractions/module.js";

class Navigator extends Module {
  up () {
    chdir("..");
  }

  cd ([path]) {
    if (!path) {
      throw new ArgsError();
    }

    const resolved = resolve(path).toLowerCase();

    chdir(resolved);
  }
}

export const navigator = new Navigator(); 