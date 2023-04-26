const config = {
    DalamudApiLevel: 8,
    BlackListPlugin: [
        "Splatoon",
        "DSREyeLocator",
        "AbyssosToolbox",
        "Athavar.FFXIV.Plugin",
        "BossMod",
    ],
    freezeFilePath: "repo.json",
    commitMessage: "repo update",
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
        LastUpdate: Date.now() / 1000,
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