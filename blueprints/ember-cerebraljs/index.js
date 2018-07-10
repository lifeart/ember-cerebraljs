/*jshint node:true*/
module.exports = {
  description: 'Initializer to configure and inject Cerebral into your application.',
  afterInstall: function () {
    return this.addPackagesToProject([
      // {
      //   name:"function-tree", target: "^3.2.2"
      // },
      // {
      //   name:"cerebral", target: "^3.2.2"
      // },
      // {
      //   name:"@cerebral/baobab", target: "^3.2.2"
      // },
    ]).then(()=>{
      return this.addAddonsToProject({
        packages: [
          // { name: 'ember-auto-import', target: '*' }
        ]
      });
    })
  },

  normalizeEntityName: function () {
    // this prevents an error when the entityName is not specified
  }
};
