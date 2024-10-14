import EventEmmiter from "events";
import { EOL } from "os";

import { ArgsError } from "../errors/ArgsError.js";

class Director extends EventEmmiter {
  emit (event, data) {
    const eventNames = this.eventNames();
    
    if (!eventNames.includes(event)) {
      throw new ArgsError(`Unknown command${EOL}`);
    }

    super.emit(event, data);
  }
}

export const director = new Director(); 