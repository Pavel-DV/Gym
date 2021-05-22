'use strict';

import * as module from './module.js';
import i18n from './i18n.js';

export default function navBar(exercisePath) {
    const pathSteps = exercisePath.split('/');

    const allPaths = pathSteps.reduce(
        (acc, exerciseName) => {
            const curPath = [ ...acc.curPath, exerciseName ];
            return { curPath, paths: [ ...acc.paths, curPath ] }
        }, { paths: [], curPath: [] }).paths;

    const [ [ home, ...secondPaths ], lastPath ] = module.arraySplitLast(allPaths);

    const pathsHtml = [
        `<li class="breadcrumb-item"><a href="?exercise=" id="link">${i18n('Home')}</a></li>`,
        ...secondPaths.map(path => `
            <li class="breadcrumb-item">
                <a href="?exercise=${path.map(name => encodeURI(name)).join('/')}" id="link">${path.slice(-1)[0]}</a>
            </li>
        `),
        `<li class="breadcrumb-item" active>${lastPath.slice(-1)[0]}</li>`,
    ].join('');

    return module.htmlToElement(`
        <nav style="display: flex;justify-content: space-between;">
            <ol class="breadcrumb">
                ${pathsHtml}
            </ol>

            <span>
                <a href="?save" id="link" style="text-decoration: none;">⤓</a>
                <a href="?load" id="link" style="text-decoration: none;">🗁📂</a>
                <a href="?edit" id="link" style="text-decoration: none;">✎</a>
            </span>
        </nav>
    `);
}
