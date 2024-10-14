import { EOL } from "os";

export class OperationError extends Error {
  constructor (msg) {
    super(msg || `Operation Failed${EOL}`)
  }
}