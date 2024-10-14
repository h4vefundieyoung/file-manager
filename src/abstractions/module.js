import { stdout } from "process";

import { director } from "../modules/director.js";
import { getCwdMsg } from "../helpers/getCwdMsg.js"

export class Module {
  constructor () {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((prop) => {
      if (prop !== "constructor" && typeof this[prop] === "function") {
        const listener = (...args) => {
          this[prop].call(this, ...args);
          stdout.write(getCwdMsg());
        };

        director.on(prop, listener);
      }
    });
  }
}