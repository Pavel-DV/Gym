'use strict';

import * as module from './module.js';

export default function list(exercises, parentExerciseName) {
    const links = exercises
        .map(exercise => {
            const history = exercise.history || [];
            const lastExecuted = Math.max(...history.map(item => item.timestamp));
            return { ...exercise, lastExecuted: lastExecuted < 0 ? 0 : lastExecuted };
        })
        .sort((a, b) => (Date.now() - b.lastExecuted) / b.period - (Date.now() - a.lastExecuted) / a.period)
        .map(exercise => {
            // const path = [ parentExerciseName, exercise.name ].filter(Boolean).map(name => encodeURI(name)).join('/');
            const path = [ parentExerciseName, exercise.name ].map(name => encodeURI(name)).join('/');
            const url = `?exercise=${path}`;
            const oneDay = 24 * 60 * 60 * 1000;
            const daysPassed = Math.trunc((Date.now() - exercise.lastExecuted) / oneDay);
            return `
                <a href="${url}" id="exercise-link" class="btn btn-light col-12 mb-2" data-name="${exercise.name}" style="text-align: left;">
                    ${daysPassed > 99 ? '--' : daysPassed}
                    ${exercise.name}
                </a>
            `;
        })
        .join('\n');

    return module.htmlToElement(links);
}
