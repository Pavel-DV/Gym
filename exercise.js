'use strict'

import * as module from './module.js'
import i18n from './i18n.js'
import navBar from './navBar.js'
import list from './list.js'
import buttonAdd from './buttonAdd.js'

export function render(urlParams) {
    const exercisePath = urlParams.get('exercise')
    window.state.storedItems = module.getStoredItems()
    window.state.namesChain = exercisePath.split('/')
    const exercise = module.findExercise(window.state.storedItems, window.state.namesChain)
    // const childExercises = exercisePath ? exercise.exercises ?? [] : storedExercises;
    const childExercises = exercise.exercises || []
    const oneDay = 24 * 60 * 60 * 1000
    const history = exercise.history || []
    const curHistoryItem = history.sort((a, b) => b.timestamp - a.timestamp)
    .find(item => item.timestamp > Date.now() - oneDay)

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

    const notes = curHistoryItem?.notes ?? ''
    const nameInput = exercisePath === '' ? '' : `<input class="form-control mb-2" placeholder="${i18n('ExerciseName')}" value="${exercise.name}" id="name">`

    const container = module.htmlToElement(`
        <div>
            ${nameInput}
            <p><textarea id="notes" placeholder="${i18n('ExerciseNotes')}" class="form-control form-control-lg" rows="10">${notes}</textarea></p>
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
    `)

    container.forEach(node => {
        node.querySelector('#notes').oninput = (e) => {
            window.state.storedItems = updateHistory(window.state.storedItems, window.state.namesChain, pastHistory, e.target.value)
        }

        const inputName = node.querySelector('input#name')

        if (inputName !== null) {
            inputName.oninput = e => {
                const {
                    updatedItems,
                    updatedNamesChain
                } = updateName(window.state.storedItems, window.state.namesChain, e.target.value)
                window.state.storedItems = updatedItems
                window.state.namesChain = updatedNamesChain
            }
        }


        node.querySelector('button#delete').onclick = () => deleteItem(window.state.storedItems, window.state.namesChain, exercise)

        node.querySelector('input#period').oninput = e => {
            window.state.storedItems = updatePeriod(window.state.storedItems, window.state.namesChain, e.target.value)
        }
    })

    const listContainer = list(childExercises, exercisePath)

    return [ ...navBar(exercisePath), ...listContainer, ...container, ...buttonAdd(childExercises) ]
}

function updateName(storedItems, namesChain, name) {
    const updatedItems = module.updateItem(storedItems, namesChain, { name })
    // exercise.name = name;
    const [ firstPaths ] = module.arraySplitLast(namesChain)
    const updatedNamesChain = [ ...firstPaths, name ]
    window.history.replaceState({}, `${i18n('Gym')}`, `?exercise=${updatedNamesChain.map(encodeURI).join('/')}`)

    return { updatedItems, updatedNamesChain }
}

function updatePeriod(storedItems, namesChain, period) {
    return module.updateItem(storedItems, namesChain, { period })
}

function updateHistory(storedItems, namesChain, pastHistory, notes) {
    const history = [
        ...pastHistory,
        {
            notes,
            timestamp: Date.now(),
        },
    ]

    return module.updateItem(storedItems, namesChain, { history })
}

function deleteItem(storedExercises, namesChain, exercise) {
    const isDelete = confirm(`${i18n('Delete')} ${exercise.name}?`)
    if (isDelete) {
        module.updateItem(storedExercises, namesChain, { isDelete: true })
        window.history.back()
    }
}
