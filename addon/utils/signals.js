import EmberObject from '@ember/object';
import { get } from '@ember/object';
import { isArray } from '@ember/array';
import normalizeSignalName from './signal-normalizer';
import flatten from './flatten';

const SignalsObject = EmberObject.extend({
    getActions(...args) {
        const props = get(this, 'actions').getProperties(args);
        const actionsList = [];
        args.forEach((actionName) => {
            actionsList.push(props[actionName]);
        });
        return actionsList;
    },
    getAction(action) {
        const actions = get(this, 'actions');
        if (typeof action === 'string') {
            const resolvedAction = get(actions, action);
            if (!resolvedAction) {
                console.error(`Unable to get action "${action}" from actions object`, actions);
                return action;
            }
            return resolvedAction.bind(actions);
        } else if (isArray(action)) {
            return action.map((actionName)=>this.getAction(actionName));
        } else if (typeof action === 'object') {
            const paths = Object.keys(action);
            paths.forEach((pathName)=>{
                const acts = action[pathName];
                if (isArray(acts)) {
                    action[pathName] = acts.map((actionName)=>this.getAction(actionName));
                } else {
                    action[pathName] = this.getAction(acts);
                }
            });
            return action;
        } else {
            return action;
        }
    },
    getSignals(resivedSignals,prefix='') {

        const signals = resivedSignals || get(this,'signals');
        const realSignals = {};
        const flatternSignals = [];

        Object.keys(signals)
        .forEach((signalName)=>{
            const signal = signals[signalName];
            const name = normalizeSignalName(`${prefix}${signalName}`);
            const isObject = typeof signal === 'object';
            realSignals[name] = isArray(signal) ? signal.map((action)=>{
               return this.getAction(action);
            }) :  isObject ? flatternSignals.push([signalName, flatten(signal,{safe:true})]) : this.getAction(signal);
        });

        flatternSignals.forEach(([prefix, resolvedObject]) => {
            Object.assign(realSignals,this.getSignals(resolvedObject,prefix+'.'));
        });

        return realSignals;
    }
});


export default SignalsObject;