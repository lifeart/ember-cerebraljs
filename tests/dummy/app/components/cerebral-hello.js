import Component from '@ember/component';
import layout from '../templates/components/cerebral-hello';
import {connect} from 'ember-cerebraljs';

// list of read-only state binded props
const props = [
    'name:current.user.name',
    'age:current.user.age'
];

// list fo signals to bind to actions
const signals = [
    'onIncrease'
];

export default connect(props, signals, Component.extend({
  layout
}));
