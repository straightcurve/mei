enum LogLevel {
  Error,
  Info,
  Debug,
}

export const log = {
  level: LogLevel.Info,

  error: function (...params: any[]) {
    if (this.level >= LogLevel.Error) {
      console.error(...params);
    }
  },
  info: function (...params: any[]) {
    if (this.level >= LogLevel.Info) {
      console.log(...params);
    }
  },
  debug: function (...params: any[]) {
    if (this.level >= LogLevel.Debug) {
      console.log(...params);
    }
  },
};
