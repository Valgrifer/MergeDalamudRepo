// noinspection JSCheckFunctionSignatures
import Repolist from "./repolist.js";
import Config from "./config.js";
import fetch from "node-fetch";
import {readFileSync, writeFileSync} from "fs";
import {fixJSON, findUrlLine, commitAndPush, sendMessage, pluginIsUpdate} from "./utils.js";

const SETTINGS = {method: "Get"};

(async () => {
    /** @type {RepoItem[]} */
    let errorList = [];
    /** @type {RepoItem[]} */
    let finalList = [];

    /** @type {RepoItem[]} */
    const RepoListResult = (await Promise.all(Repolist.map(originRepository => fetch(originRepository, SETTINGS)
        .then(async res => {
            if (res.status === 200) {
                let json = JSON.parse(fixJSON(await res.text()));
                if (!Array.isArray(json))
                    json = [json];
                return json
                    .map(item => ({
                        ...item,
                        originRepository,
                        Description: (item.Description ? item.Description + '\n\n' : '') + "Plugin from " + originRepository
                    }));
            }
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
            if (!el1)
                return el2;
            el2.forEach(el => el1.push(el))
            return el1;
        });
    RepoListResult
        .filter(item =>
            item.error || !item.Disabled && !Config.BlackListPlugin.includes(item.InternalName) && item.DalamudApiLevel && item.DalamudApiLevel >= Config.DalamudApiLevel)
        .forEach(item => {
            if (item.error) {
                errorList.push(item);
                return;
            }
            let same;
            if ((same = finalList.find(el => el.InternalName === item.InternalName))) {
                if (pluginIsUpdate(item, same)) {
                    if (item.InternalName === "CustomizePlus") console.log("yes", same);
                    Object.keys(same).forEach(key => delete same[key]);
                    Object.keys(item).forEach(key => same[key] = item[key]);
                    if (item.InternalName === "CustomizePlus") console.log(same);
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

    finalList.sort((a, b) => a.InternalName.localeCompare(b.InternalName))

    finalList.push(info);

    /** @type {RepoItem[]} */
    let oldJson;

    try {
        oldJson = JSON.parse(readFileSync(Config.freezeFilePath, {encoding: 'utf8', flag: 'r'}));
    } catch (e) {
        oldJson = [];
    }

    const updated = finalList
        .map(el => {
        if (el.InternalName === Config.defaultInfoPlugin.InternalName)
            return false;

        let find = oldJson.find(e => e.InternalName === el.InternalName);

        if (find === undefined)
            return el;

        if (pluginIsUpdate(el, find))
            return el;

        return false;
    })
        .filter(el => el);

    if (updated.length === 0) {
        console.log("No Update Found!!");
        return;
    }
    console.log("Update Found!!");

    writeFileSync(Config.freezeFilePath, JSON.stringify(finalList, null, 2));

    if (Config.autoCommitPush) {
        if (Config.sendWebHook)
            await Promise.all(updated.map(sendMessage));

        commitAndPush(Config.freezeFilePath, Config.commitMessage, Config.commitBranch);
    }
})()
