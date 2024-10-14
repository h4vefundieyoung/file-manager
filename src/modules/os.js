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
    const data = cpus().map(({model, speed}) => JSON.stringify({ model, speed: speed / 1000 + "GHz" }));
    stdout.write(`There are ${data.length} cpus with such stats:` + EOL);
    data.forEach(core => stdout.write(core + EOL));
  }

  eol () {
    stdout.write(`Current end of line is: \\${EOL}`);
  }
}

export const os = new OS(); 