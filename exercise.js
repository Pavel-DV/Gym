'use strict';

import * as module from './module.js';
import { i18n } from './i18n.js';

export function render(urlParams) {
    const exerciseName = urlParams.get('exercise');
    const exercise = module.findExercise(exerciseName);
    const oneDay = 24 * 60 * 60 * 1000;
    const history = exercise.history || [];
    const curHistoryItem = history.sort((a, b) => b.timestamp - a.timestamp).find(item => item.timestamp > Date.now() - oneDay)
    const pastHistory = history.filter(item => item.timestamp !== curHistoryItem?.timestamp)
    const historyHtml = pastHistory.map(item => `<div class="list-group-item">
        ${new Date(item.timestamp).toLocaleString()},
        ${~~((Date.now() - item.timestamp) / oneDay)} ${i18n.daysAgo}
        <br>
        ${item.notes.split('\n').join('<br>')}
        </div>`).join('')
    const notes = curHistoryItem?.notes ?? '';
    const container = module.htmlToElement(`
        <div>
            <a href="." id="link" class="nav-link">${i18n.Home}</a>
            <input class="form-control mb-2" placeholder="${i18n.ExerciseName}" value="${exercise.name}" id="name">
            <p><textarea id="notes" class="form-control form-control-lg" rows="10">${notes}</textarea></p>
            <div class="row g-1 mb-2">
                <div class="col-5 lead">
                    ${i18n.Period}:
                </div>
                <div class="col-2">
                    <input type="number" pattern="[0-9]*" inputmode="numeric" class="form-control"
                           placeholder="${i18n.Period}" value="${exercise.period}" id="period">
                </div>
        
                <button class="btn btn-danger col-2 offset-3" id="delete">🗑</a>
            </div>
            <!--div class="row g-0">
                <button class="btn btn-primary col-6" id="new">${i18n.Add}</button>
            </div-->
            <div class="list-group list-group-flush">${historyHtml}</div>
        </div>
    `);
    container.querySelector('#notes').oninput = (e) => {
        const newExercise = {
            ...exercise,
            history: [
                ...pastHistory,
                {
                    notes: e.target.value,
                    timestamp: Date.now(),
                },
            ],
        };
        const newExercises = [ ...module.getExercises().filter(item => item.name !== exercise.name), newExercise ];
        localStorage.setItem('exercises', JSON.stringify(newExercises, null, 2));
    }

    container.querySelector('input#name').oninput = e => updateName(exercise, e.target.value);
    container.querySelector('button#delete').onclick = () => deleteExercise(exercise);
    container.querySelector('input#period').oninput = e => updatePeriod(exercise, e.target.value);
    // container.querySelector('button#new').onclick = () => addNew(exercise);

    return container;
}

function updateName(exercise, name) {
    module.updateExercise(exercise.name, { name });
    exercise.name = name;
}

function updatePeriod(exercise, period) {
    module.updateExercise(exercise.name, { period });
}

function deleteExercise(exercise) {
    const isDelete = confirm(`${i18n.Delete} ${exercise.name}?`);
    if (isDelete) {
        const newExercises = [ ...module.getExercises().filter(item => item.name !== exercise.name) ];
        localStorage.setItem('exercises', JSON.stringify(newExercises, null, 2));
    }
    window.history.pushState({}, `${i18n.Gym}`, '.');
}

// function addNew(parentExercise) {
//     const name = '';
//     window.history.pushState({}, `${i18n.Gym}`, `?exercise=${name}`);
// }
