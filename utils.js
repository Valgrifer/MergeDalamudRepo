import {readFileSync} from 'fs';

/**
 * @typedef {Object} RepoItem
 * @property {undefined|string} Author
 * @property {undefined|string} Name
 * @property {undefined|boolean} Disabled
 * @property {undefined|string} Description
 * @property {undefined|string} InternalName
 * @property {undefined|string} AssemblyVersion
 * @property {undefined|string} TestingAssemblyVersion
 * @property {undefined|string} RepoUrl
 * @property {undefined|string} ApplicableVersion
 * @property {undefined|number} DalamudApiLevel
 * @property {undefined|string} DownloadLinkInstall
 * @property {undefined|string} DownloadLinkTesting
 * @property {undefined|string} DownloadLinkUpdate
 * @property {undefined|string} IconUrl
 * @property {undefined|string[]} Tags
 *
 * @property {string} originRepository
 * @property {undefined|string} error
 * @property {undefined|number} code
 * @property {undefined|any} err
 */

/**
 * Corrige une chaîne de caractères JSON malformée en supprimant les caractères spéciaux non valides.
 * @param {string} jsonString - La chaîne de caractères JSON malformée à corriger.
 * @returns {string} La chaîne de caractères JSON corrigée.
 * @generatedBy ChatGPT
 */
export function fixJSON(jsonString) {
    const regex = /,\s*([\]}])/g;
    return jsonString.replace(regex, (match, group1) => group1);
}

/**
 * Search Url of repository in 'repolist.js'
 * @param {string} url
 * @return {number} Ligne of url
 */
export function findUrlLine(url)
{
    const fileContentLine = readFileSync('repolist.js', {encoding:'utf8', flag:'r'}).split('\r\n');

    for(let i in fileContentLine)
        if(fileContentLine[i].indexOf(url) >= 0)
            return parseInt(i)+1;

    return -1;
}

/**
 * Compare deux versions et renvoie la plus haute.
 * @param {string} version1 - La première version à comparer.
 * @param {string} version2 - La deuxième version à comparer.
 * @returns {string} La version la plus haute.
 * @generatedBy ChatGPT
 */
export function compareVersions(version1, version2) {
    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;

        if (part1 > part2) {
            return version1;
        } else if (part1 < part2) {
            return version2;
        }
    }

    return version1; // Les versions sont identiques
}