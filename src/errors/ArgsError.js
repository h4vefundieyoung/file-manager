import { EOL } from "os";

export class ArgsError extends Error {
  constructor (msg) {
    super(msg || `Invalid input${EOL}`)
  }
}