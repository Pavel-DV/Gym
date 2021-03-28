'use strict';

import * as module from './module.js';
import { i18n } from './i18n.js';
import { findExercise } from './module.js';

export function render(urlParams) {
    const exerciseName = urlParams.get('exercise');
    const exercise = module.findExercise(exerciseName);
    const oneDay = 24 * 60 * 60 * 1000;
    const curHistoryItem = exercise.history.sort((a, b) => b.timestamp - a.timestamp).find(item => item.timestamp > Date.now() - oneDay)
    const pastHistory = exercise.history.filter(item => item.timestamp !== curHistoryItem?.timestamp)
    const historyHtml = pastHistory.map(item => `<div class="list-group-item">
        ${new Date(item.timestamp).toLocaleString()} -
        ${~~((Date.now() - item.timestamp) / oneDay)}
        <br>
        ${item.notes.split('\n').join('<br>')}
        </div>`).join('')
    const notes = curHistoryItem?.notes ?? '';
    const container = module.htmlToElement(`
        <div>
            <a href="index.html" id="link" class="nav-link">${i18n.Home}</a>
            <p class="lead">${exercise.name}</p>
            <p><textarea id="notes" class="form-control form-control-lg" rows="10">${notes}</textarea></p>
            <div class="list-group list-group-flush">${historyHtml}</div>
        </div>
    `);
    container.querySelector('#notes').oninput = (e) => {
        const newExercise = {
            ...exercise,
            lastExecuted: Date.now(),
            history: [
                ...pastHistory,
                {
                    notes: e.target.value,
                    timestamp: Date.now(),
                },
            ],
        }
        const newExercises = [ ...module.getExercises().filter(item => item.name !== exercise.name), newExercise ];
        localStorage.setItem('exercises', JSON.stringify(newExercises, null, 2));
    }

    return container;
}
