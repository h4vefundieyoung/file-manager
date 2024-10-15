import { stdout, cwd } from "process";
import { readdir, writeFile, access, rename, rm } from "fs/promises";
import { createReadStream, createWriteStream } from "fs"
import { resolve, join, parse } from "path";
import { EOL } from "os";
import { pipeline } from "stream";

import { Module } from "../abstractions/module.js";
import { ArgsError, OperationError } from "../errors/index.js";

class FS extends Module {
  ls () {
    return new Promise (async (res, rej) => {
      try {
        const folderData = await readdir(cwd(), { withFileTypes: true });
        const formatted = folderData
        .map((entity) => ({
          name: entity.name,
          type: entity.isDirectory() ? "directory" : entity.isFile() ? "file" : "allien"
        }))
        .sort((a, b) => {
          if (a.type === b.type) {
            return a.name.localeCompare(b.name);
          }
          return a.type.localeCompare(b.type)
        })
  
        console.table(formatted);
        res();
      } catch (e) {
        rej(new OperationError());
      }
    })
  }

  cat ([path]) {
    return new Promise((res, rej) => {
      if (!path) rej(new ArgsError());

      try {
        const rStream = createReadStream(resolve(path))
        .on("end", () => res)
        .on("error", () => rej(new OperationError));
        rStream.pipe(stdout);
      } catch (e) {
        rej(new OperationError());
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
          rej(new OperationError());
        } catch (e) {
          if (e.code === "ENOENT") {
            await writeFile(path, "");
            stdout.write(`The file was successfully created${EOL}`);
            return res()
          }
          rej(new OperationError());
        }
      } catch (e) {
        rej(new OperationError());
      }
    })
  }

  rn ([sourcePath, destPath]) {
    return new Promise(async (res, rej) => {
      if (!sourcePath || !destPath) {
        rej(new ArgsError());
      }
      
      try {
        await rename(resolve(sourcePath), resolve(destPath));
        stdout.write(`Successfully renamed${EOL}`);
        res();
      } catch (e) {
        rej(new OperationError());
      }
    })
  }

  cp ([sourcePath, destPath], thisCall) {
    return new Promise(async (res, rej) => {
      if (!sourcePath || !destPath) {
        rej(new ArgsError());
      }

      try {
        const source = resolve(sourcePath);
        const parsed = parse(source);
        const rStream = createReadStream(source);
        const wStream = createWriteStream(join(resolve(destPath), parsed.base));
        
        pipeline(rStream, wStream, (e) => {
          if (e) rej(new OperationError());
          if (!thisCall) stdout.write(`Successfully copied${EOL}`);
          res();
        });
      } catch (e) {
        rej(new OperationError());
      }
    })
  }

  rm ([path], thisCall) {
    return new Promise(async (res, rej) => {
      if (!path) rej(new ArgsError())

      try {
        await rm(resolve(path));
        if (!thisCall) stdout.write(`Successfully removed${EOL}`);
        res();
      } catch (e) {
        rej(new OperationError());
      }
    })
  }

  mv ([sourcePath, destPath]) {
    return new Promise(async (res, rej) => {
      if (!sourcePath || !destPath) {
        rej(new ArgsError());
      }

      try {
        await this.cp([sourcePath, destPath], true);
        await this.rm([sourcePath], true);
        
        stdout.write(`Successfully moved${EOL}`);
        res();
      } catch (e) {
        rej(new OperationError());
      }
    })
  }
}

export const fs = new FS(); 