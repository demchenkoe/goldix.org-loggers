const {LoggerConsole} = require('@goldix.org/logger-console');
const {LoggerProxy} = require('./utils/LoggerProxy');

let loggerClasses = {
  LoggerConsole
};

class LoggersPool extends  LoggerProxy {
  
  constructor(poolOptions, options) {
    super(null, options);
    this.poolOptions = {
      ...poolOptions
    };
    this._loggers = [];
    this.createLoggers();
  }
  
  createLoggers() {
    Object.keys(this.poolOptions).forEach(className => {
      const loggerOptions = this.poolOptions[className];
      if(loggerOptions) {
        if(loggerOptions.enabled === false) return;
        if(loggerOptions.disabled === true) return;
      }
      if(className in loggerClasses) {
        this._loggers.push(
          new loggerClasses[className](loggerOptions)
        );
      } else {
        throw new Error(`Unknown logger ${className}. Check your config of logger pools or define more loggers by Loggers.define().`);
      }
    });
  }
  
  _log(level, message, payload, options) {
    let promises = [];
    options = Object.freeze({
      ...this.options,
      options,
      poolOptions: this.poolOptions
    });
    this.loggers.forEach(logger => {
      promises.push(
        logger._log(level, message, payload, options)
      );
    });
    return Promise.all(promises);
  }
}

class Loggers {
  
  /**
   *
   * @param {object} options
   * @param {object} options.pools   {<poolName>: { <loggerClassName>: {<logger options>} }}
   */
  
  constructor(options) {
    this.options = {
      pools: {
        default: {
          LoggerConsole: { level: 'info' },
        },
      },
      ...options,
    };
    
    this.instances = {};
  }
  
  createPool(poolName) {
    if(poolName in this.options.pools) {
      return new LoggersPool(this.options.pools[poolName]);
    }
    
    return this.instances['default']
      || (this.instances['default'] = new LoggersPool(this.options.pools['default'], this.options));
  }
  
  get(poolName, options) {
    const logger = this.instances[poolName] || (this.instances[poolName] = this.createPool(poolName));
    return new LoggerProxy(logger, {...options, poolName});
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

module.exports = { Loggers, LoggersPool, LoggerProxy, LoggerConsole };