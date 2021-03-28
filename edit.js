'use strict';

import * as module from './module.js';
import { i18n } from './i18n.js';

export function render(urlParams) {
    const data = urlParams.get('edit');
    console.log(data);
    if (data !== '') {
        const exercises = JSON.parse(data)
        localStorage.setItem('exercises', JSON.stringify(exercises, null, 2));
    }
    const container = module.htmlToElement(`
        <div>
            <a href="index.html" id="link" class="nav-link">Home</a>
            <p class="lead">${i18n.EditData}</p>
            <p><textarea id="notes" class="form-control form-control-lg" rows="10">${localStorage.getItem('exercises')}</textarea></p>
        </div>
    `);
    container.querySelector('#notes').oninput = (e) => {
        localStorage.setItem('exercises', e.target.value);
    }
    return container;
}
