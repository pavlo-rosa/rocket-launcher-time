function parseStr(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%d/g, () => args[i++]);
}

const parameterizedString = (...args) => {
    const str = args[0];
    const params = args.filter((arg, index) => index !== 0);
    if (!str) return "";
    return str.replace(/%s[0-9]+/g, matchedStr => {
        const variableIndex = matchedStr.replace("%s", "") - 1;
        return params[variableIndex];
    });
}

module.exports={
    parseStr,
    parameterizedString
}
