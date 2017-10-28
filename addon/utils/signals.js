import EmberObject from '@ember/object';
import { isArray } from '@ember/array';

const SignalsObject = EmberObject.extend({
    getActions(...args) {
        const props = this.get('actions').getProperties(args);
        const actionsList = [];
        args.forEach((actionName) => {
            actionsList.push(props[actionName]);
        });
        return actionsList;
    },
    getAction(action) {
        const actions = this.get('actions');
        if (typeof action === 'string') {
            return actions.get(action).bind(actions);
        } else if (isArray(action)) {
            return action.map((actionName)=>this.getAction(actionName));
        } else {
            return action;
        }
    },
    getSignals() {
        const signals = this.get('signals');
        const realSignals = {};
        Object.keys(signals).forEach((signalName)=>{
            const signal = signals[signalName];
            realSignals[signalName] = isArray(signal) ? signal.map((action)=>{
               return this.getAction(action);
            }) : [];
        });
        return realSignals;
    }
});


export default SignalsObject;