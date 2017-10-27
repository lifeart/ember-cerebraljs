# Ember Cerebral / ember-cerebraljs

Enhanced state management for complex Ember apps using [Cerebral](https://www.cerebraljs.com/).

Why?
-------------

If you've had success with Ember's [data down, actions up pattern](http://www.samselikoff.com/blog/data-down-actions-up/), think of Cerebral as turning that pattern up to [11](https://en.wikipedia.org/wiki/Up_to_eleven). In cerebral, all state lives in one central state store and flows in one direction from the top of your component tree to the bottom. Additionally, state changes do not happen by mutating models or component props via two way bindings. They are externalized to chains of functions, called [signals](http://www.cerebraljs.com/signals), that may also perform asynchronous requests (ajax, etc).

Isolating state, updating it with small, simple functions, and embracing one way dataflow improves your ability to reason about your application as it scales in size and complexity, especially with tools like the Cerebal [debugger](https://www.youtube.com/watch?v=ZMXcSRiq6fU).

In short, Ember Cerebral brings the best of the Flux/React and Ember communities together into one package.

Installation
--------------
- `ember install ember-cerebraljs`

Usage
--------

Check out the example [TodoMVC app](https://github.com/bfitch/ember-cerebral-todomvc).
(TodoMVC app - is old addon version [ember-cerebral](https://github.com/bfitch/ember-cerebral))

Expose Cerebral state to your component using the `CerebralMixin` and define a `props[]` array of component mapping properties to their location in the cerebral store:

```js
// in component x-foo.js

import CerebralMixin from 'ember-cerebraljs/mixins/cerebral-mixin';

export default Ember.Component.extend(CerebralMixin, {
  props: [
      'userName:path.to.cerebral.userName'
  ]
});
```

State is available as props on the component (and routes):

```js
// in component x-foo.js

excitedUserName: computed('userName', function() {
  return `My name is ${this.get('userName')}`;
})
```

Trigger signals to change state:
```js
actions: {
  buttonClicked() {
    this.sendSignal('buttonClicked');
  }
}
```


App state located in:
```js
app/states/application.js
```

App reducers / signals located in:
```js
app/signals/application.js
```

Cerebral config  located in:
```js
app/initializers/cerebral.js
```


New namespaces:
```js
@cerebral/baobab
baobab
cerebral
emmett
eventemitter3
function-tree
```


Thanks
----------
Thanks to Toran Billups (@toranb) who's [screencast](https://vimeo.com/160234990) on [ember-redux](https://github.com/toranb/ember-redux) inspired this integration.

Thanks to Brian Fitch (@bfitch) for first addon version [ember-cerebral](https://github.com/bfitch/ember-cerebral)

-----------------
For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
