

class LoggerProxy {
  constructor(logger, options) {
    this.logger = logger;
    this.options = {
      ...options
    }
  }
  
  _log(level, message, payload, options) {
    return this.logger._log(
      level, message, payload, {...this.options, ...options}
    );
  }
  
  log(message, payload, options) {
    return this._log('log', message, payload, options);
  }
  
  info(message, payload, options) {
    return this._log('info', message, payload, options);
  }
  
  warn(message, payload, options) {
    return this._log('warn', message, payload, options);
  }
  
  error(message, payload, options) {
    return this._log('error', message, payload, options);
  }
  
  start(message, payload, options) {
    return this.logger.start(message, payload, {...this.options, ...options});
  }
}

module.exports = { LoggerProxy };