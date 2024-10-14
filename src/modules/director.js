import EventEmmiter from "events";
import { EOL } from "os";

import { ArgsError } from "../errors/ArgsError.js";

class Director extends EventEmmiter {
  emit (rawEvent, data) {
    const eventNames = this.eventNames();
    const event = rawEvent.toLowerCase() === "os" ? data[0].slice(2).toLowerCase() : rawEvent;

    if (!eventNames.includes(event)) {
      throw new ArgsError(`Unknown command${EOL}`);
    }

    if (event !== rawEvent) {
      return super.emit(event);
    }

    super.emit(event, data);
  }
}

export const director = new Director(); 