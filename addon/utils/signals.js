import EmberObject from '@ember/object';
import { isArray } from '@ember/array';
import normalizeSignalName from './signal-normalizer';
import flatten from './flatten';

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
    getSignals(resivedSignals,prefix='') {

        const signals = resivedSignals || this.get('signals');
        const realSignals = {};
        const flatternSignals = [];
        Object.keys(signals).forEach((signalName)=>{
            const signal = signals[signalName];
            realSignals[normalizeSignalName(prefix+''+signalName)] = isArray(signal) ? signal.map((action)=>{
               return this.getAction(action);
            }) :  typeof signal === 'object' ? flatternSignals.push([signalName, flatten(signal,{safe:true})]) : this.getAction(signal);
        });
        flatternSignals.forEach(([prefix, resolvedObject]) => {
            Object.assign(realSignals,this.getSignals(resolvedObject,prefix+'.'));
        });

        return realSignals;
    }
});


export default SignalsObject;