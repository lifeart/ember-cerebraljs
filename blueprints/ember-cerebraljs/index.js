/*jshint node:true*/
module.exports = {
  description: 'Initializer to configure and inject Cerebral into your application.',
  afterInstall: function () {
    return this.addAddonsToProject({
      packages: [
        {name: 'broccoli-replace', target: '*'},
        {name: 'ember-cerebral-shim', target: '*'},
        {name: 'ember-cerebral-baobab-shim', target: '*'}
      ]
    });
  },

  normalizeEntityName: function () {
    // this prevents an error when the entityName is not specified
  }
};
