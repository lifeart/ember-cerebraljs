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

import {CerebralMixin} from 'ember-cerebraljs';

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


Connect approach for components:
```js
import Component from '@ember/component';
import {connect} from 'ember-cerebraljs';

// list of read-only state binded props
const props = [
    'count',
    'componentPropertyName:stateProperty'
];

// list fo signals to bind to actions
const signals = [
    'onIncrease',
    'actionName:signalName'
];

export default connect(props, signals, Component);

```

Component template
```hbs
{{count}} <button {{action 'onIncrease'}}>onIncrease</button>
```



App state located in:
```js
app/states/application.js
```

App reducers / signals located in:
```js
app/signals/application.js
```


App actions located in:
```js
app/actions/application.js
```


Cerebral config  located in:
```js
app/services/cerebraljs.js
```


New namespaces:
```js

const {
    CerebralService,
    SignalsObject,
    StateObject,
    ActionsObject,
    CerebralMixin,
    connect
} from 'ember-cerebraljs';

/*
CerebralMixin - computed-props based mixin [props]
connect - component connector connect([props],[signals],component);
SignalsObject - signals object, SignalsObject.create({signals});
ActionsObject - actions object, ActionsObject.create({actions});
StateObject - state object, StateObject.create({state});
CerebralService - main service & initializer, CerebralService.extend({state,signals});
*/

@cerebral/baobab
baobab
cerebral
emmett
eventemitter3
function-tree
```


Example:
----------
```js

import Component from '@ember/component';
import { connect } from 'ember-cerebraljs';

export default connect(
  ['count:current.user.age'],
  ['onIncrease'],
  Component.extend({
    layout: hbs`{{count}} <button {{action 'onIncrease'}}>onIncrease</button>`
  })
)

```

Thanks
----------
Thanks to Toran Billups (@toranb) who's [screencast](https://vimeo.com/160234990) on [ember-redux](https://github.com/toranb/ember-redux) inspired this integration.

Thanks to Brian Fitch (@bfitch) for first addon version [ember-cerebral](https://github.com/bfitch/ember-cerebral)

-----------------
For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
