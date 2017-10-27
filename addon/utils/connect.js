import { isArray } from '@ember/array';
import CerebralMixin from '../mixins/cerebral-mixin';

function connect(props=[],actions=[],rawComponent) {

    const component = rawComponent.extend(CerebralMixin);
    const actionsObject = component.actions || {};

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
        actions: actionsObject
    }); 
}

export default connect;