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
                <button class="btn col-1" id="edit">⚙</button>
            </div>
        `;
    }).join('\n');

    const container = module.htmlToElement(`
        <a href="index.html?edit" id="link" class="nav-link">${i18n.EditData}</a>
        <div>
            ${links}
        </div>
    `);

    container.forEach(node => node.querySelectorAll ? node.querySelectorAll('a#exercise-link').forEach(link => link.oncontextmenu = edit) : null);
    container.forEach(node => node.querySelectorAll ? node.querySelectorAll('button#edit').forEach(btn => btn.onclick = edit) : null);

    return container;
}

function edit(e) {

    const exerciseName = e.target.dataset.name;
    const exercise = findExercise(exerciseName);

    const editContainer = module.htmlToElement(`
        <div class="container">

            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Period</span>
                <input type="range" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
            </div>
            <div class="row g-2">
                <label for="customRange1" class="form-label col-sm-1">Period</label>
                <div class="col-sm-11">
                <input type="range" class="form-range col-sm-11" id="customRange1">
            </div>
            
            <div class="row">
              <div class="col-md-9">
                <div class="form-floating">
                  <input class="form-control mb-2" id="floatingInputGrid" placeholder="Exercise name" value="zzzz">
                  <label for="floatingInputGrid">Exercise name</label>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-floating">
                  <input type="number" class="form-control mb-2" placeholder="Period" value="7" id="Period">
                  <label for="Period">Period</label>
                </div>
              </div>
              <div class="col-md-1">
                  <a href="index.html" class="btn btn-primary">Ok</a>
              </div>
            </div>
        </div>
    `);

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
    // const newName = prompt(`${i18n.ExerciseName}`, exerciseName);
    // if (newName === null) {
    //     return;
    // }
    //
    // const period = prompt(`${i18n.Period}`, exercise.period);
    // if (period === null) {
    //     return;
    // }
}
