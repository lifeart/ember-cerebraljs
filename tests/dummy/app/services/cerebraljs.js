import { CerebralService } from 'ember-cerebraljs';

import signals from '../signals/application';
import state from '../states/application';

export default CerebralService.extend({
    state,
    signals
});
