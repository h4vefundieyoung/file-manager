import { EOL, homedir } from "os";
import { stdin, stdout, stderr, chdir }  from "process";

import { director } from "./src/modules/director.js";
import { getCwdMsg } from "./src/helpers/index.js";
import "./src/modules/index.js";

const arg = process.argv[2];
const usernameIndx = arg?.split("").findIndex((char) => char.charCodeAt(0) === 61) + 1;
const USERNAME = usernameIndx && arg.slice(usernameIndx) || "Jesus of Nazareth";

const inputHandler = (userInput) => {
  const [cmd, ...args] = userInput.toString().trim().split(" ");

  if (cmd === ".exit") {
    process.exit(1);
  }
  try {
    director.emit(cmd, args);
  } catch (e) {
    e?.message && stderr.write(e.message.trim() + EOL);
  }
}

const exitHandler = () => {
  stdout.write(`Thank you for using File Manager, ${USERNAME}, goodbye!${EOL}`);
}

stdin.on("data", inputHandler);

process.on("SIGINT", () => process.exit(1));
process.on("exit", exitHandler);

chdir(homedir());

stdout.write(`Welcome to the File Manager,${USERNAME}!${EOL}`);
stdout.write(getCwdMsg());
