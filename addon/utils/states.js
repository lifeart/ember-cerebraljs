import EmberObject, { getWithDefault } from '@ember/object';

const StateObject = {
    getState() {
        return getWithDefault(this, 'state', {});
    }
}

export default EmberObject.extend(StateObject);