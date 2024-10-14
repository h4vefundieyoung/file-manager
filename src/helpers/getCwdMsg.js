import { EOL } from "os";

export const getCwdMsg = () => {
  const msg = `You are currently in ${process.cwd()}${EOL}`;
  return msg
}