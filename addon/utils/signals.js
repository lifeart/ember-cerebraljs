import EmberObject, { getWithDefault } from '@ember/object';
import { get, getProperties } from '@ember/object';
import { isArray } from '@ember/array';
import normalizeSignalName from './signal-normalizer';
import flatten from './flatten';
import logger from './logger';

const SignalsObject = {
    getActions(...args) {
        const props = getProperties(get(this, 'actions'), args);
        return args.reduce((actionsList, actionName)=>{
            actionsList.push(props[actionName]);
            return actionsList;
        }, []);
    },
    getActionFromNamespace(action, namespace = '') {
        const actions = get(this, 'actions');
        if (action.includes('.')) {
            let actionArr = action.split('.');
            action = actionArr.pop();
            namespace = `${namespace}/${actionArr.join('/')}`;
        }
        let namespaces = namespace.split('/').filter(el=>el);

        for (let i = 0; i < namespaces.length; i++) {
            let path = namespaces.slice(0,i?-i:undefined).join('.');
            
            let result  = get(actions, path);
            if (!result) {
                continue;
            }
            
            if (typeof result === 'function') {
                return result;
            } else if (action in result) {
                return result[action];
            }

        }
        return getWithDefault(actions, action, false);
    },
    _getActionFromString(action, namespace) {
        const actions = get(this, 'actions');
        const resolvedAction = this.getActionFromNamespace(action,namespace) || get(actions, action);
        if (!resolvedAction) {
            logger('error',`Unable to get action "${action}" from actions object`, actions);
            return action;
        }
        return resolvedAction.bind(actions);
    },
    _getActionFromArray(action, namespace) {
        return action.map((actionName) => this.getAction(actionName, namespace));
    },
    _getActionFromObject(action, namespace) {
        const paths = Object.keys(action);
        paths.forEach((pathName) => {
            const acts = action[pathName];
            if (isArray(acts)) {
                action[pathName] = acts.map((actionName) => this.getAction(actionName, namespace));
            } else {
                action[pathName] = this.getAction(acts, namespace);
            }
        });
        return action;
    },
    getAction(action, namespace) {
        if (typeof action === 'string') {
            return this._getActionFromString(action, namespace);
        } else if (isArray(action)) {
            return this._getActionFromArray(action, namespace);
        } else if (typeof action === 'object') {
           return this._getActionFromObject(action, namespace);
        } else {
            return action;
        }
    },
    getSignals(resivedSignals, prefix='') {

        const signals = resivedSignals || get(this,'signals') || {};
        const realSignals = {};
        const flatternSignals = [];

        Object.keys(signals)
        .forEach((signalName) => {
            const signal = signals[signalName];
            const name = normalizeSignalName(`${prefix}${signalName}`);
            const isObject = typeof signal === 'object';
            if (isArray(signal)) {
                realSignals[name] = signal.map((action)=>{
                    return this.getAction(action, name);
                });
            } else if (isObject) {
                flatternSignals.push([signalName, flatten(signal,{safe:true})])
            } else {
                realSignals[name] = this.getAction(signal, name);
            }
        });

        flatternSignals.forEach(([prefix, resolvedObject]) => {
            Object.assign(realSignals, this.getSignals(resolvedObject, prefix + '.'));
        });

        return realSignals;
    }
}

export default EmberObject.extend(SignalsObject);