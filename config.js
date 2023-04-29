const config = {
    /** @var {number} **/
    DalamudApiLevel: 8,
    /** @var {string[]} **/
    BlackListPlugin: [
        "Splatoon",
        "DSREyeLocator",
        "AbyssosToolbox",
        "Athavar.FFXIV.Plugin",
        "BossMod",
    ],
    /** @var {string} **/
    freezeFilePath: "repo.json",
    /** @var {boolean} **/
    autoCommitPush: true,
    /** @var {string} **/
    commitMessage: "test",
    /** @var {string} **/
    commitBranch: "master",
};


// noinspection JSValidateTypes
/**  @type RepoItem */
const defaultInfoPlugin = {
    Author: "Valgrifer",
    Name: "DalamudRepoInfo",
    InternalName: "DalamudRepoInfo",
    AssemblyVersion: "0.0.0.1",
    Description: "",
    ApplicableVersion: "any",
    RepoUrl: "https://steam.valgrifer.fr/DalamudRepo/",
    DalamudApiLevel: config.DalamudApiLevel,
    LoadPriority: 0,
    Punchline: "Information sur ce script",
    ImageUrls: null,
    IconUrl: "",
    IsHide: "False",
    IsTestingExclusive: "False",
    DownloadCount: 0,
    CategoryTags: [],
    LastUpdate: Math.round(Date.now() / 1000),
    DownloadLinkInstall: "https://steam.valgrifer.fr/DalamudRepo/404.zip",
    DownloadLinkUpdate: "https://steam.valgrifer.fr/DalamudRepo/404.zip",
    Tags: [
        "repo",
        "info",
    ]
}

export default {
    ...config,
    defaultInfoPlugin
};