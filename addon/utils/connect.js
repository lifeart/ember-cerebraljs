import { isArray } from '@ember/array';
import CerebralMixin from '../mixins/cerebral-mixin';
import { View } from 'cerebral';
import { state } from 'cerebral/tags';

function connect(props=[],actions=[],rawComponent=false) {
    
    const component = rawComponent.extend(CerebralMixin);
    const actionsObject = component.actions || {};
    const bindedFlag = '@';

    if (!isArray(props)) {
        const propsArray = Object.keys(props).map(key=>{
            return `${key}:${props[key]}`;
        });
        props = propsArray;
    }

    let castToPrimitive = function(payload) {
        let p = JSON.parse(JSON.stringify(payload));
        if (isArray(p)) {
            return {
                args: p
            }
        }
        return payload;
    };

    if (isArray(actions)) {
        actions.forEach((action)=>{
            if (typeof action === 'string') {
                let [localName, signal = localName] = action.split(':');
                localName = localName.replace(bindedFlag,'');
                actionsObject[localName] = function(...params) {
                    if (signal.startsWith(bindedFlag)) {
                        let resolvedSignal = this.get(signal.replace(bindedFlag,''));
                        if (!resolvedSignal) {
                            console.error(`Unable to find signal name binded as ${signal}, "${resolvedSignal}" given.`);
                            return;
                        }
                        this.sendSignal.apply(this,[resolvedSignal].concat(castToPrimitive(params)));
                    } else {
                        this.sendSignal.apply(this,[signal].concat(castToPrimitive(params)));
                    }
                };
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
        _getCerebralViewProps() {
            const dependencies = {};
            const propKeys = {};

            props.forEach((property)=>{
                const [localKey,stateKey=localKey] = property.split(':');
                if (stateKey.startsWith('@')) {
                    let currentKey = this.get(stateKey.replace('@','')) || stateKey;
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
        },
        didInsertElement() {
            this._super(...arguments);

            let {dependencies, propKeys} = this._getCerebralViewProps();

            this._cerebralView = new View({
                props: propKeys,
                dependencies,
                controller: this.get('cerebraljs').get('cerebral'),
                displayName: this.toString() || String(this.get('elementId'))
            });

            
            this._cerebralView.mount();
        }
    }); 
}

export default connect;