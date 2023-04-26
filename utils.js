export function fixJSON(jsonString) {
    const regex = /,\s*([\]}])/g;
    return jsonString.replace(regex, (match, group1) => group1);
}