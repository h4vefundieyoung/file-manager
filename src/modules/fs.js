import { stdout, cwd } from "process";
import { readdir, writeFile, access, rename, rm } from "fs/promises";
import { createReadStream, createWriteStream } from "fs"
import { resolve, join } from "path";
import { EOL } from "os";
import { pipeline } from "stream";

import { Module } from "../abstractions/module.js";
import { ArgsError } from "../errors/ArgsError.js";

class FS extends Module {
  ls () {
    return new Promise (async (res, rej) => {
      try {
        const folderData = await readdir(cwd(), { withFileTypes: true });
        const formatted = folderData
        .map((entity) => ({
          name: entity.name,
          type: entity.isDirectory() ? "directory" : entity.isFile() ? "file" : "huita"
        }))
        .sort((a, b) => {
          if(a.type === b.type) {
            return a.name.localeCompare(b.name);
          }
          return a.type.localeCompare(b.type)
        })
  
        console.table(formatted);
        res();
      } catch (e) {
        rej(e);
      }
    })
  }

  cat ([path]) {
    return new Promise((res, rej) => {
      if (!path) rej(new ArgsError());

      try {
        const rStream = createReadStream(resolve(path))
        .on("end", () => res)
        .on("error", rej);
        rStream.pipe(stdout);
      } catch (e) {
        rej(e);
      }
    })
  }

  add ([filename]) {
    return new Promise(async (res, rej) => {
      if (!filename) rej(new ArgsError());

      try {
        const path = join(cwd(), filename);
        try {
          await access(path);
          rej(new ArgsError("The file is already exists"));
        } catch (e) {
          if (e.code === "ENOENT") {
            await writeFile(path, "");
            stdout.write(`The file was successfully created${EOL}`);
            return res()
          }
          rej(e);
        }
      } catch (e) {
        rej(e);
      }
    })
  }

  rn ([sourcePath, destPath]) {
    if(!sourcePath || !destPath) {
      rej(ArgsError());
    }

    return new Promise(async (res, rej) => {
      try {
        await rename(resolve(sourcePath), resolve(destPath));
        stdout.write(`Successfully renamed${EOL}`);
        res();
      } catch (e) {
        rej(e);
      }
    })
  }

  cp ([sourcePath, destPath], thisCall) {
    return new Promise(async (res, rej) => {
      if(!sourcePath || !destPath) {
        rej(ArgsError());
      }

      try {
        const rStream = createReadStream(resolve(sourcePath));
        const wStream = createWriteStream(resolve(destPath));
        pipeline(rStream, wStream, (e) => {
          if (e) rej(e);
          if(!thisCall) stdout.write(`Successfully copied${EOL}`);
          res();
        });
      } catch (e) {
        rej(e);
      }
    })
  }

  rm ([path], thisCall) {
    return new Promise(async (res, rej) => {
      if(!path) rej(new ArgsError())

      try {
        await rm(resolve(path));
        if(!thisCall) stdout.write(`Successfully removed${EOL}`);
        res();
      } catch (e) {
        rej(e);
      }
    })
  }

  mv ([sourcePath, destPath]) {
    return new Promise(async (res, rej) => {
      if(!sourcePath || !destPath) {
        rej(ArgsError());
      }

      try {
        await this.cp([sourcePath, destPath], true);
        await this.rm([sourcePath], true);
        console.log("zzz");
        stdout.write(`Successfully moved${EOL}`);
        res();
      } catch (e) {
        rej(e);
      }
    })
  }
}

export const fs = new FS(); 