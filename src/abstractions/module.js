import { stdout, stderr } from "process";
import { EOL } from "os"; 

import { director } from "../modules/director.js";
import { getCwdMsg } from "../helpers/getCwdMsg.js"

export class Module {
  constructor () {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((prop) => {
      if (prop !== "constructor" && typeof this[prop] === "function") {
        const listener = async (...args) => {
          try{
            await this[prop].call(this, ...args);
          } catch (e) {
            e?.message && stderr.write(e.message.trim() + EOL);
          } finally {
            stdout.write(getCwdMsg());
          }
        };

        director.on(prop, listener);
      }
    });
  }
}