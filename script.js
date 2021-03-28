'use strict';

import * as module from './module.js';

module.updateRoute();

history.pushState = (pushState => (data, title, url) => {
    pushState.apply(history, [ data, title, url ]);
    module.updateRoute();
})(history.pushState)

window.onpopstate = function (event) {
    module.updateRoute();
}


// const defaultExercises = [
//     { lastExecuted: 0, period: 7, history: [], name: 'Жим в тренажере' },
//     { lastExecuted: 0, period: 7, history: [], name: 'Бицепс' },
//     { lastExecuted: 0, period: 7, history: [], name: 'Подтягивание' },
//     { lastExecuted: 0, period: 7, history: [], name: 'Трицепс' },
//     { lastExecuted: 0, period: 14, history: [], name: 'Наклоны назад' },
//     { lastExecuted: 0, period: 14, history: [], name: 'Приседания' },
//     { lastExecuted: 0, period: 14, history: [], name: 'Икры' },
// ];
// const savedExercises = JSON.parse(localStorage.getItem('exercises') || '[]');
// const joinedExercises = replaceExercisesByName(defaultExercises, savedExercises);
// localStorage.setItem('exercises', JSON.stringify(joinedExercises));
// function replaceExercisesByName(exercises, changes) {
//     return exercises.map(exercise => ({ ...exercise, ...changes.find(change => change.name === exercise.name) }));
// }
