'use strict';

import * as exercise from './exercise.js';
import * as index from './index.js';
import * as edit from './edit.js';
import { i18n } from './i18n.js';

export function getExercises() {
    return JSON.parse(localStorage.getItem('exercises') || '[]');
}

export function findExercise(name) {
    return getExercises().find(exercise => exercise.name === name);
}

export function htmlToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.childNodes.length > 1 ? template.content.childNodes : template.content.firstChild;
}

export function updateRoute() {
    const mainBlock = document.getElementById('main');
    const urlParams = new URLSearchParams(window.location.search)
    const isExercise = urlParams.has('exercise');
    const isEdit = urlParams.has('edit');
    if (isExercise) {
        mainBlock.replaceChildren(exercise.render(urlParams));
    } else if (isEdit) {
        mainBlock.replaceChildren(edit.render(urlParams));
    } else {
        mainBlock.replaceChildren(...index.render());
    }

    document.querySelectorAll('a#link, a#exercise-link').forEach(link => link.onclick = linkClick);
}

function linkClick(e) {
    e.preventDefault();
    window.history.pushState({}, `${i18n.Gym}`, e.target.href);
}
