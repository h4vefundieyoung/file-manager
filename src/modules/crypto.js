import { createReadStream } from "fs";
import { createHash } from "crypto"
import { pipeline } from "stream";
import { stdout } from "process";
import { resolve } from "path";
import { EOL } from "os";

import { Module } from "../abstractions/module.js";
import { ArgsError } from "../errors/ArgsError.js";

class Crypto extends Module {
  hash([path]) {
    return new Promise((res, rej) => {
      if (!path) rej(new ArgsError());

      try {
        const hash = createHash('sha256');
        const rStream = createReadStream(resolve(path));

        pipeline(rStream, hash, (e) => {
          if (e) rej(e);

          stdout.write(`Hash for the given file is: ${hash.digest("hex")}` + EOL);
          res();
        });
      } catch (e) {
        rej(e);
      }
    })
  }
}

export const crypto = new Crypto(); 