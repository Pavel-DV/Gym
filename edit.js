'use strict';

import * as module from './module.js';
import i18n from './i18n.js';

export function render(urlParams) {
    const data = urlParams.get('edit');
    console.log(data);

    if (data !== '') {
        const exercises = JSON.parse(data)
        module.saveItems(exercises)
    }

    const container = module.htmlToElement(`
        <div>
            <a href="." id="link" class="nav-link">${i18n('Home')}</a>
            <p class="lead">${i18n('EditData')}</p>
            <p><textarea id="notes" class="form-control" rows="20">${module.getStoredItems()}</textarea></p>
        </div>
    `);

    container.forEach(node => {
        node.querySelector('#notes').oninput = e => {
            try {
                module.saveItems(JSON.parse(e.target.value));
                e.target.classList.remove('is-invalid');
            } catch (error) {
                e.target.classList.add('is-invalid');
            }
        }
    });

    return container;
}
