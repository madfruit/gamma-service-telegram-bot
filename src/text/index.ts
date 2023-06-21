import {Language} from 'package-types';
import {TextShortcut} from './textShortcuts';
import {En} from './en';
import {Uk} from './uk';

export function getText(shortcut: TextShortcut) {
    return Uk[shortcut];
}

function getTextShortcuts(data: Object): TextShortcut[] {
    const textShortcuts: TextShortcut[] = [];
    Object.keys(data).map((key) => {
        if (key in TextShortcut) {
            textShortcuts.push(<TextShortcut>key);
        }
    });
    return textShortcuts;
}

export function getMessageFromSimbadObject(data: {[key: string]: string | string[]}): string {
    let result = '';
    Object.keys(data).map((key) => {
        try {
            const value = data[key];
            // @ts-ignore
            const translatedKey = Uk[key.trim()];
            if (translatedKey) {
                result += translatedKey + ': ';
                if (Array.isArray(value)) {
                    let valueStr = '';
                    value.forEach((str) => {
                        valueStr += str + ', ';
                    });
                    result += valueStr.slice(0, valueStr.length -2);
                } else {
                    result += value;
                }
                result += '\n';
            }
        } catch {

        }
    });
    return result;
}
