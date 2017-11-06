import { isArray } from '@ember/array';
import CerebralMixin from '../mixins/cerebral-mixin';
import { View } from 'cerebral'
import { state } from 'cerebral/tags'

function connect(props=[],actions=[],rawComponent=false) {
    
    const component = rawComponent.extend(CerebralMixin);
    const actionsObject = component.actions || {};

    if (!isArray(props)) {
        const propsArray = Object.keys(props).map(key=>{
            return `${key}:${props[key]}`;
        });
        props = propsArray;
    }

    if (isArray(actions)) {
        actions.forEach((action)=>{
            if (typeof action === 'string') {
                const [localName, signalName = localName] = action.split(':');
                actionsObject[localName] = (function(signal) {
                    return function(params) {
                        this.sendSignal.apply(this,[signal].concat(params));
                    };
                })(signalName);
            } else {
                Object.assign(actionsObject,action);
            }
        });
    } else {
        Object.assign(actionsObject, action);
    }

    return component.extend({

        props: props,
        actions: actionsObject,
        willDestroyElement() {
            this._super(...arguments);
            this._cerebralView.unMount();
        },
        didInsertElement() {
            this._super(...arguments);

            const dependencies = {};
            const propKeys = {};

            props.forEach((property)=>{
                const [localKey,stateKey=localKey] = property.split(':');
                dependencies[localKey] = state`${stateKey}`;
                propKeys[localKey] = stateKey;
            });
            
            this._cerebralView = new View({
                props: propKeys,
                dependencies,
                controller: this.get('cerebraljs').get('cerebral'),
                displayName: this.toString() || String(this.get('elementId')),
            });

            this._cerebralView.mount();
        }
    }); 
}

export default connect;