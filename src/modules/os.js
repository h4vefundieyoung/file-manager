import { stdout } from "process";
import { EOL, homedir, cpus, userInfo, arch } from "os";

import { Module } from "../abstractions/module.js";


class OS extends Module {
  username () {
    const { username } = userInfo();
    stdout.write(`Current username is: ${username}` + EOL);
  }

  architecture () {
    stdout.write(`Current cpu arch is: ${arch()}` + EOL);
  }

  homedir () {
    stdout.write(`Current homedir is: ${homedir()}` + EOL);
  }

  cpus () {
    stdout.write(JSON.stringify(cpus()) + EOL);
  }

  eol () {
    stdout.write(`Current end of line is: \\${EOL}` + EOL);
  }
}

export const os = new OS(); 