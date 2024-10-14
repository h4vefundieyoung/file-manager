import { createBrotliCompress, createBrotliDecompress } from "zlib"
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";
import { resolve } from "path";
import { stdout } from "process";
import { EOL } from "os";

import { Module } from "../abstractions/module.js";
import { ArgsError, OperationError } from "../errors/index.js";

class Compressor extends Module {
  brCompressor = createBrotliCompress();
  brDecompressor = createBrotliDecompress();

  compress ([source, dest], decompress) {
    return new Promise((res, rej) => {
      if (!source || !dest) rej(new ArgsError());

      try {
        const rStream = createReadStream(resolve(source));
        const wStream = createWriteStream(resolve(dest));
        const tStream = decompress ? this.brDecompressor : this.brCompressor;

        pipeline(rStream, tStream, wStream, (e) => {
          if (e) rej(new OperationError());
          stdout.write(`Given files was successfully ${decompress ? "decompressed" : "compressed"}` + EOL);
          res();
        });
      } catch (e) {
        rej(new OperationError());
      }
    })
  }

  decompress (args) {
    return this.compress(args, true);
  }
}

export const compressor = new Compressor(); 