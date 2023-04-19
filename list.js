'use strict';

import * as module from './module.js';

export default function list(items, parentItemName) {
    const links = module.sortItems(items)
        .map(item => {
            // const path = [ parentItemName, item.name ].filter(Boolean).map(name => encodeURI(name)).join('/');
            const path = [ parentItemName, item.name ].map(name => encodeURI(name)).join('/');
            const url = `?exercise=${path}`;
            const oneDay = 24 * 60 * 60 * 1000;
            const daysPassed = Math.trunc((Date.now() - item.lastDate) / oneDay);
            return `
                <a href="${url}" id="exercise-link" class="btn btn-light col-12 mb-2" data-name="${item.name}" style="text-align: left;">
                    ${daysPassed > 99 ? '--' : daysPassed}
                    ${item.name}
                </a>
            `;
        })
        .join('\n');

    return module.htmlToElement(links);
}
