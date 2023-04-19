'use strict';

import * as exercise from './exercise.js';
import * as edit from './edit.js';
import i18n from './i18n.js';

const version = 1;

export const defaultItem = {
    exercises: [],
    history: [],
    name: '',
    period: 7,
};

export function getStoredItems() {
    const data = JSON.parse(localStorage.getItem('exercises') || '[]');
    return migrateData(data).items;
}

function migrateData(data) {
    const result = {};

    if (data.version === undefined) {
        result.items = migrateRecursively(data, migrate_1);
        result.version = 1;
    } else {
        result.items = data.items;
        result.version = data.version;
    }

    return result;
}

function migrate_1(item) {
    const newItem = {...defaultItem, ...item};
    newItem.period = Number(newItem.period);

    return newItem;
}

function migrateRecursively(items, migrationFunc) {
    return items.map(item => {
        const newItem = migrationFunc(item);
        newItem.exercises = migrateRecursively(newItem.exercises, migrationFunc);

        return newItem;
    });
}

export function saveItems(items) {
    const data = {
        version,
        items,
    }

    localStorage.setItem('exercises', JSON.stringify(data, null, 2));
}

export function findExercise(exercises, namesChain) {
    return namesChain.reduce(findNextExercise, {exercises});
}

function findNextExercise(acc, name) {
    return acc.exercises?.find(exercise => exercise.name === name) || defaultItem;
}

export function htmlToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return [...template.content.childNodes];
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
        loadDataFromFile().then(data => {
            saveItems(migrateData(JSON.parse(data)).items);
            window.history.pushState({}, `${i18n('Gym')}`, `?exercise=`);
        });
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

export function updateItem(storedItems, namesChain, updatedData) {
    const updatedItems = deepChange(storedItems, namesChain, updatedData);
    saveItems(updatedItems);

    return updatedItems;
}

function deepChange(storedExercises, namesChain, updatedData) {
    const [curName, ...newNamesChain] = namesChain;

    return sortItems(storedExercises).map(storedExercise => {
        if (storedExercise.name !== curName) {
            return storedExercise;
        } else {
            return newNamesChain.length === 0
                    ? {...storedExercise, ...updatedData}
                    : {...storedExercise, exercises: deepChange(storedExercise.exercises, newNamesChain, updatedData)}
        }
    }).filter(exercise => exercise.isDelete !== true);
}

export function arraySplitLast(arr) {
    const firsts = arr.slice(0, -1);
    const last = arr.slice(-1)[0];
    return [firsts, last];
}

function saveDataToFile() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(getStoredItems()));
    element.setAttribute('download', 'gym backup.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const handleFileSelect = resolve => evt => {
    Array.from(evt.target.files).map(file => {
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = e => {
            resolve(e.target.result);
        };
    });

    evt.target.value = null;
}

async function loadDataFromFile() {
    document.getElementById('files').click();

    return new Promise(resolve => {
        document.getElementById('files').onchange = handleFileSelect(resolve);
    })
}

function addLastDate(items) {
    return items.map(item => {
        const lastDate = getLastDateRecursive(item);
        return {...item, lastDate: lastDate < 0 ? 0 : lastDate};
    });
}

function getLastDateRecursive(item) {
    const lastDateFromNested = item.exercises.map(getLastDateRecursive);
    return Math.max(...item.history.map(item => item.timestamp), ...lastDateFromNested);
}

export function sortItems(items) {
    const updatedItems = addLastDate(items);
    return updatedItems.sort((a, b) => (Date.now() - b.lastDate) / b.period - (Date.now() - a.lastDate) / a.period)
}

