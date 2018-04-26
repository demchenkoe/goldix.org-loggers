const {Profiler} = require('@goldix.org/profiler');

class LoggerProxy {
  constructor(logger, options) {
    this.logger = logger;
    this.options = {
      ...options
    }
  }
  
  _log(level, message, payload, options) {
    if(!this.logger) {
      return Promise.resolve();
    }
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
  
  getProfiler({options} = {}) {
    return (options && options.Profiler) ||  Profiler;
  }
  
  start(message, payload, options) {
    options = {...this.options, ...options};
    
    if(!this.logger) {
      let Profiler = this.getProfiler(options);
      return new Profiler({
        onProfilerEnd: (duration, profiler, endArguments) => {
          let [message2, payload2, options2] = endArguments || [];
          return this._log(
            'profiler',
            message2 || message,
            {...payload, ...payload2, duration},
            {...options, options2, profiler }
          );
        },
      });
    }
    return this.logger.start(message, payload, options);
  }
}

module.exports = { LoggerProxy };