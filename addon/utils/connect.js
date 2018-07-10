import { isArray } from '@ember/array';
import CerebralMixin from '../mixins/cerebral-mixin';
import { View } from 'cerebral';
import { state } from 'cerebral/tags';
import logger from './logger';

const BINDED_FLAG = '@';

export function objectToArray(props) {
    return Object.keys(props).map(key=>{
        return `${key}:${props[key]}`;
    });
}

export function castToPrimitive(payload) {
    let p = JSON.parse(JSON.stringify(payload));
    if (isArray(p)) {
        return {
            args: p
        }
    }
    return payload;
}

export function createActionHandler (signal) {
    return function(...params) {
        if (signal.startsWith(BINDED_FLAG)) {
            let resolvedSignal = this.get(signal.replace(BINDED_FLAG,''));
            if (!resolvedSignal) {
                logger('error',`Unable to find signal name binded as ${signal}, "${resolvedSignal}" given.`);
                return;
            }
            this.sendSignal.apply(this, [resolvedSignal].concat(castToPrimitive(params)));
        } else {
            this.sendSignal.apply(this, [signal].concat(castToPrimitive(params)));
        }
    };
}

export function addActionToObject(action, obj) {
    if (typeof action === 'string') {
        let [localName, signal = localName] = action.split(':');
        localName = localName.replace(BINDED_FLAG,'');
        obj[localName] = createActionHandler(signal)
    } else {
        Object.assign(obj, action);
    }
}

export function mapPropsToDepsAndKeys(props) {
    const dependencies = {};
    const propKeys = {};

    props.forEach((property)=>{
        const [localKey, stateKey=localKey] = property.split(':');
        if (stateKey.startsWith(BINDED_FLAG)) {
            let currentKey = this.get(stateKey.replace(BINDED_FLAG,'')) || stateKey;
            dependencies[localKey] = state`${currentKey}`;
            propKeys[localKey] = currentKey;
        } else {
            dependencies[localKey] = state`${stateKey}`;
            propKeys[localKey] = stateKey;
        }
    });

    return {
        dependencies,
        propKeys
    };
}

export function createCerebralView(context) {
    let { dependencies, propKeys } = mapPropsToDepsAndKeys(context.get('props'));
    let view =  new View({
        props: propKeys,
        dependencies,
        controller: context.get('cerebraljs').get('cerebral'),
        displayName: context.toString() || String(context.get('elementId'))
    });
    this._cerebralView = view;
    this._cerebralView.mount();
}

export function destroyCerebralView(context) {
    context._cerebralView.unMount();
}

export function normalizeProps(props) {
    if (!isArray(props)) {
        return objectToArray(props)
    } else {
        return props.slice();
    }
}

export function normalizeActions(actions) {
    let result = {};
    if (isArray(actions)) {
        actions.forEach((action)=>{
            addActionToObject(action, result);
        });
    } else {
        Object.assign(result, actions);
    }
    return result;
}

export function connectEmberComponent(props=[], actions=[], rawComponent={}) {
    const component = rawComponent.extend(CerebralMixin);
    const actionsObject = component.actions || {};
   
    const normalizedProps = normalizeProps(props);
    const normalizedActions = normalizeActions(actions);

    Object.assign(actionsObject, normalizedActions);

    return component.extend({
        props: normalizedProps,
        actions: actionsObject,
        willDestroyElement() {
            destroyCerebralView(this);
            this._super(...arguments);
        },
        didInsertElement() {
            createCerebralView(this);
            this._super(...arguments);
        }
    }); 
}

export function connectGlimmerComponent() {

}

export function connect(props=[], actions=[], rawComponent={}) {
    if (!('extend' in rawComponent)) {
        return connectGlimmerComponent(props, actions, rawComponent);
    } else {
        return connectEmberComponent(props, actions, rawComponent);
    }
}

export default connect;