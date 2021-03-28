'use strict';

import * as module from './module.js';
import { i18n } from './i18n.js';

export function render() {
    const links = module.getExercises()
        .map(exercise => {
            const history = exercise.history || [];
            const lastExecuted = Math.max(...history.map(item => item.timestamp));
            return { ...exercise, lastExecuted: lastExecuted < 0 ? 0 : lastExecuted };
        })
        .sort((a, b) => (Date.now() - b.lastExecuted) / b.period - (Date.now() - a.lastExecuted) / a.period)
        .map(exercise => {
            const url = `?exercise=${exercise.name}`
            const oneDay = 24 * 60 * 60 * 1000;
            const daysPassed = Math.trunc((Date.now() - exercise.lastExecuted) / oneDay);
            return `
            <div class="row mb-2 g-0 flex-nowrap">
                <a href="${url}" id="exercise-link" class="btn col-11" data-name="${exercise.name}" style="text-align: left;">
                    ${daysPassed > 99 ? '--' : daysPassed}
                    / ${exercise.period}
                    ${exercise.name}
                </a>
                <button class="btn btn-primary col-1 p-0" id="edit" data-name="${exercise.name}"></button>
            </div>
        `;
        })
        .join('\n');

    const container = module.htmlToElement(`
        <nav class="navbar">
            <a class="nav-link" aria-current="page" href="." id="link">${i18n.Refresh}</a>
            <a class="nav-link" href="?edit" id="link">${i18n.EditData}</a>
        </nav>
        ${links}
        <div class="row mb-2 g-0 flex-nowrap">
            <button class="btn btn-primary col-6 p-0" id="new">${i18n.Add}</button>
        </div>
    `);

    const nodes = Array.from(container).filter(node => node.querySelectorAll);
    nodes.forEach(node => node.querySelectorAll('button#edit').forEach(btn => btn.onclick = (e) => edit(e, module.findExercise(e.target.dataset.name))));
    nodes.forEach(node => node.querySelectorAll('button#new').forEach(btn => btn.onclick = (e) => edit(e, {name: '', period: ''})));

    return container;
}

function edit(e, exercise) {
    const editContainer = module.htmlToElement(`
        <div class="container">
            <div class="row g-1">
                <div class="col-9">
                    <input class="form-control" placeholder="${i18n.ExerciseName}" value="${exercise.name}" id="name">
                </div>
                <div class="col-2">
                    <input type="number" pattern="[0-9]*" inputmode="numeric" class="form-control"
                           placeholder="${i18n.Period}" value="${exercise.period}" id="period">
                </div>
        
                <button class="btn btn-danger col-1 p-0" id="delete">🗑</a>
            </div>
        </div>
    `);

    editContainer.querySelector('button#delete').onclick = () => deleteExercise(exercise);
    editContainer.querySelector('input#name').oninput = (e) => updateName(exercise, e.target.value);
    editContainer.querySelector('input#period').oninput = (e) => updatePeriod(exercise, e.target.value);

    e.target.parentNode.replaceChildren(editContainer);
}

function updateName(exercise, name) {
    module.updateExercise(exercise, { name });
    exercise.name = name;
}

function updatePeriod(exercise, period) {
    module.updateExercise(exercise, { period });
}

function deleteExercise(exercise) {
    const isDelete = confirm(`${i18n.Delete} ${exercise.name}?`);
    if (isDelete) {
        const newExercises = [ ...module.getExercises().filter(item => item.name !== exercise.name) ];
        localStorage.setItem('exercises', JSON.stringify(newExercises, null, 2));
    }
    module.updateRoute();
}
