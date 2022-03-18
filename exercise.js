'use strict';

import * as module from './module.js';
import i18n from './i18n.js';
import navBar from './navBar.js';
import list from './list.js';
import buttonAdd from './buttonAdd.js';

export function render(urlParams) {
    const exercisePath = urlParams.get('exercise');
    const namesChain = exercisePath.split('/');
    const storedExercises = module.getStoredExercises()
    const exercise = module.findExercise(storedExercises, namesChain);
    // const childExercises = exercisePath ? exercise.exercises ?? [] : storedExercises;
    const childExercises = exercise.exercises || [];
    const oneDay = 24 * 60 * 60 * 1000;
    const history = exercise.history || [];
    const curHistoryItem = history.sort((a, b) => b.timestamp - a.timestamp)
        .find(item => item.timestamp > Date.now() - oneDay);
    const pastHistory = history.filter(item => item.timestamp !== curHistoryItem?.timestamp)
    const historyHtml = pastHistory.map(item => `
            <div class="list-group-item">
                ${new Date(item.timestamp).toLocaleString()},
                ${~~((Date.now() - item.timestamp) / oneDay)} ${i18n('daysAgo')}
                <p>
                    ${item.notes.split('\n').join('<br>')}
                </p>
            </div>
        `).join('')
    const notes = curHistoryItem?.notes ?? '';

    const container = module.htmlToElement(`
        <div>
            <input class="form-control mb-2" placeholder="${i18n('ExerciseName')}" value="${exercise.name}"
                id="name">
            <p><textarea id="notes" class="form-control form-control-lg" rows="10">${notes}</textarea></p>
            <div class="row g-1 mb-2">
                <div class="col-5 lead">
                    ${i18n('Period')}:
                </div>
                <div class="col-2">
                    <input type="number" pattern="[0-9]*" inputmode="numeric" class="form-control"
                           placeholder="${i18n('Period')}" value="${exercise.period}" id="period">
                </div>
        
                <button class="btn btn-danger col-2 offset-3" id="delete">🗑</a>
            </div>
            <!--div class="row g-0">
                <button class="btn btn-primary col-6" id="new">${i18n('Add')}</button>
            </div-->
            <div class="list-group list-group-flush">${historyHtml}</div>
        </div>
    `);
    container.forEach(node => {
        node.querySelector('#notes').oninput = (e) =>
            updateText(storedExercises, namesChain, pastHistory, e.target.value);
        node.querySelector('input#name').oninput = e =>
            updateName(storedExercises, namesChain, e.target.value);
        node.querySelector('button#delete').onclick = () => deleteExercise(storedExercises, namesChain, exercise);
        node.querySelector('input#period').oninput = e => updatePeriod(storedExercises, namesChain, e.target.value);
    });

    const listContainer = list(childExercises, exercisePath);

    return [ ...navBar(exercisePath), ...listContainer, ...buttonAdd(storedExercises, namesChain, exercisePath, childExercises), ...container ];
}

function updateName(storedExercises, namesChain, name) {
    module.updateExercise(storedExercises, namesChain, { name });
    // exercise.name = name;
    const [ firstPaths ] = module.arraySplitLast(namesChain);
    window.history.replaceState({}, `${i18n('Gym')}`, `?exercise=${firstPaths.map(name => encodeURI(name)).join('/')}/${encodeURI(name)}`);
}

function updatePeriod(storedExercises, namesChain, period) {
    module.updateExercise(storedExercises, namesChain, { period });
}

function updateText(storedExercises, namesChain, pastHistory, notes) {
    const history = [
        ...pastHistory,
        {
            notes,
            timestamp: Date.now(),
        },
    ];

    module.updateExercise(storedExercises, namesChain, { history });
}

function deleteExercise(storedExercises, namesChain, exercise) {
    const isDelete = confirm(`${i18n('Delete')} ${exercise.name}?`);
    if (isDelete) {
        module.updateExercise(storedExercises, namesChain, { isDelete: true });
        window.history.back();
    }
}
