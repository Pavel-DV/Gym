'use strict';

import * as module from './module.js';
import i18n from './i18n.js';

export default function (storedExercises, namesChain, exercisePath, childExercises) {
    const buttonAdd = module.htmlToElement(`
        <button class="btn btn-primary col-6 mb-2" id="new">${i18n('Add')}</button>
    `);
    buttonAdd[0].onclick = () => addNew(storedExercises, namesChain, exercisePath, childExercises);

    return buttonAdd;
}

function addNew(storedExercises, namesChain, exercisePath, childExercises) {
    module.updateExercise(storedExercises, namesChain, { exercises: [...childExercises, {name: '', period: 7 }] })
    window.history.pushState({}, `${i18n('Gym')}`, `?exercise=${exercisePath}/`);
}
