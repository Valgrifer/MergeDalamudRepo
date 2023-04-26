// noinspection JSCheckFunctionSignatures

import Repolist from "./repolist.js";
import Config from "./config.js";
import fetch from "node-fetch";
import {writeFileSync} from "fs";
import {fixJSON, findUrlLine, compareVersions, commitAndPush} from "./utils.js";

const SETTINGS = { method: "Get" };

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
                if(item.AssemblyVersion !== same.AssemblyVersion && compareVersions(item.AssemblyVersion, same.AssemblyVersion) === item.AssemblyVersion)
                {
                    Object.keys(same).forEach(key => delete same[key])
                    Object.keys(item).forEach(key => same[key] = item[key])
                }
                return;
            }
            finalList.push(item);
        });

    let info = Config.defaultInfoPlugin;
    /** @type {function(RepoItem)} */
    const printer = item => {
        info.Description += `
- ${item.originRepository} at line ${findUrlLine(item.originRepository)}`;
    };

    info.Description = "404: ";
    errorList.filter((item) => item.code === 404)
        .forEach(printer);

    info.Description += "\n\n\n500: ";
    errorList.filter((item) => item.code === 500)
        .forEach(printer);

    console.error(info.Description);

    finalList.push(info);

    writeFileSync(Config.freezeFilePath, JSON.stringify(finalList))
    commitAndPush(Config.freezeFilePath, Config.commitMessage)
})()