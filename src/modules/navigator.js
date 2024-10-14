import { chdir, cwd } from "process";
import { homedir } from "os";
import { resolve } from "path";

import { ArgsError } from "../errors/ArgsError.js"
import { Module } from "../abstractions/module.js";

class Navigator extends Module {
  up () {
    if (cwd() === homedir()) {
      return
    }

    chdir("..");
  }

  cd ([path]) {
    if (!path) {
      throw new ArgsError();
    }

    const resolved = resolve(path).toLowerCase();
    const homePath = homedir().toLowerCase();

    if (!resolved.startsWith(homePath)) {
      return
    }

    chdir(resolved);
  }
}

export const navigator = new Navigator(); 