'use strict';

import * as module from './module.js';
import { i18n } from './i18n.js';
import { findExercise } from './module.js';

export function render() {
    const links = module.getExercises().sort((a, b) => (Date.now() - b.lastExecuted) / b.period - (Date.now() - a.lastExecuted) / a.period).map(exercise => {
        const url = `index.html?exercise=${exercise.name}`
        const oneDay = 24 * 60 * 60 * 1000;
        return `
            <div class="row mb-2 g-0 flex-nowrap">
                <a href="${url}" id="exercise-link" class="btn col-11" data-name="${exercise.name}" style="text-align: left;">
                    ${new Date(exercise.lastExecuted).toLocaleDateString()}
                    ${~~((Date.now() - exercise.lastExecuted) / oneDay)}
                    ${exercise.name}
                </a>
                <button class="btn btn-primary col-1 p-0" id="edit"></button>
            </div>
        `;
    }).join('\n');

    const container = module.htmlToElement(`
        <a href="index.html?edit" id="link" class="nav-link">${i18n.EditData}</a>
        <a href="index.html" id="link" class="nav-link">${i18n.Home}</a>
        <div>
            ${links}
        </div>
    `);

    container.forEach(node => node.querySelectorAll ? node.querySelectorAll('button#edit').forEach(btn => btn.onclick = edit) : null);

    return container;
}

function edit(e) {

    const exerciseName = e.target.dataset.name;
    const exercise = findExercise(exerciseName);

    const editContainer = module.htmlToElement(`
<div class="container">

    <div class="row g-2">
        <label for="customRange1" class="form-label col-2">Period</label>
        <div class="col-10">
            <input type="range" class="form-range" id="customRange1">
        </div>
    </div>

    <div class="row g-1">
        <div class="col-9">
            <div class="form-floating">
                <input class="form-control mb-2" id="floatingInputGrid" placeholder="${i18n.ExerciseName}" value="zzzz">
                <label for="floatingInputGrid">${i18n.ExerciseName}</label>
            </div>
        </div>

        <div class="col-2">
            <div class="row g-1">
                <div class="col-11">
                    <div class="form-floating">
                        <input type="number" pattern="[0-9]*" inputmode="numeric" class="form-control mb-2"
                               placeholder="${i18n.Period}" value="7" id="Period">
                        <label for="Period">${i18n.Period}</label>
                    </div>
                </div>

                <div class="col-1">
                    <button class="btn btn-danger">X</a>
                </div>
            </div>
        </div>
    </div>
</div>
    `);

    // editContainer.querySelector('a#link').onclick = module.linkClick;

    e.target.parentNode.replaceChildren(editContainer);

    // const isDelete = confirm(`${i18n.Delete}?`);
    // if (isDelete) {
    //     const isDelete = confirm(`${i18n.Delete} ${exerciseName} ?????!!!!!!!`);
    //     if (isDelete) {
    //         alert(1);
    //         return;
    //     }
    // }
    //
    //
}
