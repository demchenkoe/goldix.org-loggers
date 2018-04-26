
let profilers = {
  default: require('./default').Profiler
};

class Profilers {}


Profilers.getProfiler = (profilerName = 'default') => {
  if(profilerName in profilers) {
    return profilers[profilerName];
  }
  throw new Error(`Unknown profiler ${profilerName}`);
};

Profilers.setProfiler = (profilerName, Profiler) => {
  if(profilerName in profilers) {
    throw new Error(`Profiler ${profilerName} already exists.`);
  }
  profilers[profilerName] = Profiler;
};


module.exports = { Profilers };