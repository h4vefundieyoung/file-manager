import { EOL } from "os";

import { director } from "./src/modules/director.js";

const USERNAME = process.argv[2] || "Jesus of Nazareth";
const { stdin, stdout } = process;

const inputHandler = (userInput) => {
  const [cmd, ...args] = userInput.toString().trim().split(" ");

  if(cmd === ".exit") {
    process.exit(1);
  }

  director.emit(cmd, args);
}

const exitHandler = () => {
  stdout.write(`Thank you for using File Manager, ${USERNAME}, goodbye!${EOL}`);
}

stdin.on("data", inputHandler);

process.on("SIGINT", () => process.exit(1));
process.on("exit", exitHandler);

stdout.write(`Welcome to the File Manager,${USERNAME}!${EOL}`);
