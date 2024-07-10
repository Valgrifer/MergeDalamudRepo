import {readFileSync} from 'fs';
import {execSync} from 'child_process';
import axios from "axios";

/**
 * @typedef {Object} RepoItem
 * @property {undefined|boolean} Disabled
 * @property {undefined|string} Description
 * @property {undefined|string} InternalName
 * @property {undefined|string} AssemblyVersion
 * @property {undefined|string} TestingAssemblyVersion
 * @property {undefined|string} RepoUrl
 * @property {undefined|number} DalamudApiLevel
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
    if (version1 === undefined || version2 === undefined) {
        return version2 || version1;
    }
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

    return version1; // Les versions sont identiques.
}

/**
 * @param {RepoItem} v1
 * @param {RepoItem} v2
 * @return {boolean}
 */
export function pluginIsUpdate(v1, v2) {

}


/**
 * Effectue un commit et un push d'un fichier sur Git.
 * @param {string} file - Le chemin vers le fichier à committer et à pousser.
 * @param {string} commit - Message du Commit.
 * @param {string} branch - Branch du Commit.
 * @returns {void}
 */
export function commitAndPush(file, commit, branch) {
    try {
        // Ajouter le fichier au suivi de Git
        execSync(`git add ${file}`);

        // Effectuer le commit
        execSync(`git commit -m "${commit}"`);

        // Effectuer le push
        execSync(`git push origin HEAD:${branch}`);

        console.log(`The file ${file} has been committed and pushed to Git.`);
    } catch (error) {
        console.error(`An error occurred while executing Git commands: ${error.message}`);
    }
}

const discordLink = process.env.DISCORD_LINK;
/**
 * Envoie un message Discord avec les détails d'un plugin.
 * @param {RepoItem} plugin - Les informations du plugin.
 * @returns {Promise<void>} Une promesse résolue lorsque le message est envoyé avec succès, ou rejetée en cas d'erreur.
 */
export async function sendMessage(plugin) {
    try {
        await axios.post(discordLink, {
            embeds: [
                {
                    "title": plugin.Name,
                    "description": plugin.Changelog,
                    "color": 9510430,
                    "author": {
                        "name": plugin.Author
                    },
                    "thumbnail": {
                        "url": plugin.IconUrl
                    }
                }
            ],
            "username": plugin.Author,
        });

    } catch (error) {}
}