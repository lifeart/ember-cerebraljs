import EmberObject, { getWithDefault } from '@ember/object';

class StateObject extends EmberObject {
    getState() {
        return getWithDefault(this, 'state', {});
    }
}

export default StateObject;