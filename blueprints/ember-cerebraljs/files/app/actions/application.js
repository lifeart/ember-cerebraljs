import { ActionsObject } from 'ember-cerebraljs';

export default ActionsObject.create({
    increase: function({state}) {
        state.set('current.user.age', state.get('current.user.age') + 1)
    },
    decrease: ({state}) => {
        state.set('current.user.age', state.get('current.user.age') - 1)
    }
});
