'use strict';

import * as exercise from './exercise.js';
// import * as index from './index.js';
import * as edit from './edit.js';
import i18n from './i18n.js';

export function getStoredExercises() {
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]')
    return exercises;
    // return [{
    //     'period': 14,
    //     'history': [],
    //     'name': '',
    //     exercises,
    // }];
}

export function findExercise(exercises, namesChain) {
    return namesChain.reduce(findNextExercise, { exercises });
}

function findNextExercise(acc, name) {
    return acc.exercises?.find(exercise => exercise.name === name)
        || { name: '', period: 7 };
}

export function htmlToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return [ ...template.content.childNodes ];
}

export function updateRoute() {
    const oldActiveElement = document.activeElement;
    const mainBlock = document.getElementById('main');
    const urlParams = new URLSearchParams(window.location.search)
    const isExercise = urlParams.has('exercise');
    const isEdit = urlParams.has('edit');
    if (isExercise) {
        mainBlock.replaceChildren(...exercise.render(urlParams));
    } else if (isEdit) {
        mainBlock.replaceChildren(...edit.render(urlParams));
    } else if (urlParams.has('save')) {
        saveDataToFile();
        window.history.back();
    } else if (urlParams.has('load')) {
        loadDataFromFile();
        window.history.back();
    } else {
        window.history.pushState({}, `${i18n('Gym')}`, `?exercise=`);

        // mainBlock.replaceChildren(...index.render());
    }

    const newActiveElement = document.getElementById(oldActiveElement.id);
    if (newActiveElement?.setSelectionRange) {
        newActiveElement.focus();
        newActiveElement.setSelectionRange(oldActiveElement.selectionStart, oldActiveElement.selectionEnd);
    }

    document.querySelectorAll('a#link, a#exercise-link').forEach(link => link.onclick = linkClick);
}

export function linkClick(e) {
    e.preventDefault();
    window.history.pushState({}, `${i18n('Gym')}`, e.target.href);
}

export function updateExercise(storedExercises, namesChain, updatedData) {
    const newExercises = deepChange(storedExercises, namesChain, updatedData);
    localStorage.setItem('exercises', JSON.stringify(newExercises, null, 2));
}

function deepChange(storedExercises, namesChain, updatedData) {
    const [ curName, ...newNamesChain ] = namesChain;
    return storedExercises.map(storedExercise =>
        storedExercise.name !== curName
            ? storedExercise
            : (
                newNamesChain.length === 0
                    ? { ...storedExercise, ...updatedData }
                    : { ...storedExercise, exercises: deepChange(storedExercise.exercises, newNamesChain, updatedData) }
            ),
    ).filter(exercise => exercise.isDelete !== true);
}

export function arraySplitLast(arr) {
    const firsts = arr.slice(0, -1);
    const last = arr.slice(-1)[0];
    return [ firsts, last ];
}

function saveDataToFile() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(localStorage.getItem('exercises')));
    element.setAttribute('download', 'gym backup.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function loadDataFromFile() {
    document.getElementById('files').click();
}

function handleFileSelect(evt) {
    Array.from(evt.target.files).map(file => {
        const reader = new FileReader();
        reader.onload = e => {
            localStorage.setItem('exercises', JSON.stringify(JSON.parse(e.target.result), null, 2));
            window.history.pushState({}, `${i18n('Gym')}`, `?exercise=`);
        };
        reader.readAsText(file);
    });
    evt.target.value = null;
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
