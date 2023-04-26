// noinspection JSCheckFunctionSignatures

import Repolist from "./repolist.js";
import Config from "./config.js";
import fetch from "node-fetch";
import fs from "fs";
import {fixJSON} from "./utils.js";

const SETTINGS = { method: "Get" };

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

(async () => {
    /** @type {RepoItem[]} */
    let errorList = [];
    /** @type {RepoItem[]} */
    let finalList = [];

    /** @type {RepoItem[]} */
    const RepoListResult = (await Promise.all(Repolist.map(originRepository => fetch(originRepository, SETTINGS)
        .then(async res => {
            if (res.status === 200)
                return JSON.parse(fixJSON(await res.text()))
                    .map(item => ({
                        ...item,
                        originRepository,
                        Description: (item.Description ? item.Description + '\n\n' : '') + "Plugin from " + originRepository
                    }));
            return [{
                originRepository,
                code: 404,
                error: "Not Found",
            }];
        })
        .catch(err => ([
                {
                    originRepository,
                    code: 500,
                    error: "Une erreur c'est produit",
                    err
                }])))))
        .reduce((el1, el2) => {
            if(!el1)
                return el2;
            el2.forEach(el => el1.push(el))
            return el1;
        });

    RepoListResult.filter(item =>
            item.error || !item.Disabled && !Config.BlackListPlugin.includes(item.InternalName) && item.DalamudApiLevel && item.DalamudApiLevel >= Config.DalamudApiLevel
        ).forEach(item => {
            if(item.error)
            {
                errorList.push(item);
                return;
            }
            let same;
            if((same = finalList.find(el => el.InternalName === item.InternalName)))
            {
                console.log(item.AssemblyVersion, same.AssemblyVersion)
                return;
            }
            finalList.push(item);
        });

    let info = Config.defaultInfoPlugin;
    /** @type {function(RepoItem)} */
    const printer = item => {
        info.Description += "\n- " + item.originRepository;
    };

    info.Description = "404: ";
    errorList.filter((item) => item.code === 404)
        .forEach(printer);

    info.Description += "\n\n\n500: ";
    errorList.filter((item) => item.code === 500)
        .forEach(printer);

    console.error(info.Description);

    finalList.push(info);

    fs.writeFileSync(Config.freezeFilePath, JSON.stringify(finalList))
})()