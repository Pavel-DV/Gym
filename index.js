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
                <a href="${url}" id="exercise-link" class="btn btn-light col-12 mb-2" data-name="${exercise.name}" style="text-align: left;">
                    ${daysPassed > 99 ? '--' : daysPassed}
                    ${exercise.name}
                </a>
            `;
        })
        .join('\n');

    const container = module.htmlToElement(`
        <nav class="navbar">
            <a class="nav-link" aria-current="page" href="." id="link">${i18n.Refresh}</a>
        </nav>
        ${links}
        <div class="row g-0">
            <button class="btn btn-primary col-6" id="new">${i18n.Add}</button>
        </div>
    `);

    Array.from(container)
        .filter(node => node.querySelectorAll)
        .forEach(node => {
            node.querySelectorAll('button#new')
                .forEach(btn => btn.onclick = e => addNew())
        });

    return container;
}

function addNew() {
    const name = '';
    window.history.pushState({}, `${i18n.Gym}`, `?exercise=${name}`);
}
