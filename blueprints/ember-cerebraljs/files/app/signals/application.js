import { SignalsObject } from 'ember-cerebraljs';

import actions from '../actions/application';

const signals = {
    onIncrease: ['increase'],
    onDecrease: ['decrease']
};

export default SignalsObject.create({ actions , signals });