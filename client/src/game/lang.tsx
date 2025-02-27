
export let langMap: ReadonlyMap<string, string>;
export let langText: string;
export let langJson: any;
switchLanguage("en_us");

export function switchLanguage(language: string) {
    langJson = require("../resources/lang/" + language + ".json");
    langMap = new Map<string, string>(Object.entries(langJson));
    langText = JSON.stringify(langJson);
}

/// Returns the translated string with the given key, replacing the placeholders with the given values.
export default function translate(langKey: string, ...valuesList: (string | number)[]): string {
    let out = langMap.get(langKey);
    if(out===undefined){
        console.error("Attempted to use non existent lang key: "+langKey);
        return "ERROR: "+langKey;
    }
    for(let i = 0; i < valuesList.length; i++){
        out = out.replace("\\"+(i), valuesList[i] as string);
    }
    return out;
}

export function translateChecked(langKey: string, ...valuesList: (string | number)[]): string | null {
    let out = langMap.get(langKey);
    if(out===undefined){
        return null;
    }
    for(let i = 0; i < valuesList.length; i++){
        out = out.replace("\\"+(i), valuesList[i] as string);
    }
    return out;
}
