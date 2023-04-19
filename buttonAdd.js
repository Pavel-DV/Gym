'use strict';

import * as module from './module.js';
import i18n from './i18n.js';

export default function (childExercises) {
    const buttonAdd = module.htmlToElement(`
        <button class="btn btn-primary col-6 mb-2" id="new">${i18n('Add')}</button>
    `);
    buttonAdd[0].onclick = () => addNew(childExercises);

    return buttonAdd;
}

function addNew(childExercises) {
    const exercisePath = window.state.namesChain.map(encodeURI).join('/')

    window.state.storedItems = module.updateItem(window.state.storedItems, window.state.namesChain, { exercises: [...childExercises, module.defaultItem ] })
    window.history.pushState({}, `${i18n('Gym')}`, `?exercise=${exercisePath}/`);
}
