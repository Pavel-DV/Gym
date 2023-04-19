'use strict';

import * as module from './module.js';

window.state = {};

window.history.pushState = (oldPushState => (data, title, url) => {
    oldPushState.apply(history, [ data, title, url ]);
    module.updateRoute();
})(window.history.pushState)

window.onpopstate = function (event) {
    module.updateRoute();
}

module.updateRoute();
