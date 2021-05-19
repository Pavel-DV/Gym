'use strict';

import * as module from './module.js';

history.pushState = (pushState => (data, title, url) => {
    pushState.apply(history, [ data, title, url ]);
    module.updateRoute();
})(history.pushState)

window.onpopstate = function (event) {
    module.updateRoute();
}

module.updateRoute();

const def = `
[{"period":7,"name":"Жим штанги лежа"},{"period":7,"name":"Бицепс"},{"period":7,"name":"Подтягивание"},{"period":7,"name":"Трицепс"},{"period":14,"name":"Приседания"},{"period":14,"name":"Икры"}]
`;
