let loggerClasses = {
  DefaultLogger: require('./loggers/default').Logger
};

const {LoggerProxy} = require('../utils/LoggerProxy');

class Loggers {
  
  constructor(options) {
    this.options = {
      ...options,
      default: {
        loggerClass: 'DefaultLogger',
        ...options.default
      },
      
    };
    
    this.loggerInstances = {};
  }
  
  createLogger(loggerName) {
    let defaultOptions = this.options.default;
    let options = null;
    let loggerClass = null;
    if (loggerName in this.options) {
      options = {
        ...defaultOptions,
        ...this.options[loggerName],
      }
    } else {
      options = {...defaultOptions};
    }
    
    if (typeof options.loggerClass === 'function') {
      loggerClass = options.loggerClass;
    }
    else if (typeof options.loggerClass === 'string' && options.loggerClass in loggerClasses) {
      loggerClass = loggerClasses[options.loggerClass];
    } else {
      loggerClass = loggerClasses[this.options.default.loggerClass];
    }
    
    return new loggerClass(options);
  }
  
  get(loggerName, options) {
    const logger = this.loggerInstances[loggerName] || (this.loggerInstances[loggerName] = this.createLogger(loggerName));
    if (options) {
      return new LoggerProxy(logger, options);
    }
    return logger;
  }
}

Loggers.define = function(loggerClassName, loggerClass) {
  if(loggerClassName in loggerClasses) {
    throw new Error(`Logger class ${loggerClassName} already exists.`);
  }
  if(typeof loggerClass !== 'function') {
    throw new Error(`Invalid logger class ${loggerClassName}.`);
  }
  loggerClasses[loggerClassName] = loggerClass;
};

module.exports = { Loggers };