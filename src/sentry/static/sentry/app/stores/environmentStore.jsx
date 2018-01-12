import Reflux from 'reflux';

const PRODUCTION_ENV_NAMES = new Set([
  'production',
  'prod',
  'release',
  'master',
  'trunk',
]);

const EnvironmentStore = Reflux.createStore({
  init() {
    this.items = [];
  },

  loadInitialData(items) {
    this.items = items;
    this.trigger(this.items, 'initial');
  },

  getByName(name) {
    name = '' + name;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        return this.items[i];
      }
    }
    return null;
  },

  getAll() {
    return this.items;
  },

  // Default environment is either the first based on the set of common names
  // or the first in the environment list if none match
  getDefault() {
    let allEnvs = this.items;
    let prodEnvs = allEnvs.filter(e => PRODUCTION_ENV_NAMES.has(e.name));

    return (prodEnvs.length && prodEnvs[0].name) || (allEnvs.length && allEnvs[0].name);
  },
});

export default EnvironmentStore;
