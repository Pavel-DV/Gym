'use strict';

import * as module from './module.js';
import i18n from './i18n.js';

export function render(urlParams) {
    const data = urlParams.get('edit');
    console.log(data);
    if (data !== '') {
        const exercises = JSON.parse(data)
        localStorage.setItem('exercises', JSON.stringify(exercises, null, 2));
    }
    const container = module.htmlToElement(`
        <div>
            <a href="." id="link" class="nav-link">${i18n('Home')}</a>
            <p class="lead">${i18n('EditData')}</p>
            <p><textarea id="notes" class="form-control" rows="20">${localStorage.getItem('exercises')}</textarea></p>
        </div>
    `);

    container.forEach(node => {
        node.querySelector('#notes').oninput = e => {
            try {
                localStorage.setItem('exercises', JSON.stringify(JSON.parse(e.target.value), null, 2));
                e.target.classList.remove('is-invalid');
            } catch (error) {
                e.target.classList.add('is-invalid');
            }
        }
    });

    return container;
}
