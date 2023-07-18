import { JSONFormat } from './JSONFormat';
import { JSONStringFormat } from './JSONStringFormat';
import { TextFormat } from './TextFormat';
import { XMLFormat } from './XMLFormat';
import { XMLStringFormat } from './XMLStringFormat';

import type { BitmapFontData } from '../BitmapFontData';

// Registered formats, maybe make this extensible in the future?
const formats = [
    JSONFormat,
    JSONStringFormat,
    TextFormat,
    XMLFormat,
    XMLStringFormat
] as const;

const parseFormats = [
    JSONStringFormat,
    TextFormat,
    XMLStringFormat
] as const;

/**
 * Auto-detect BitmapFont parsing format based on data.
 * @private
 * @param {any} data - Data to detect format
 * @returns {any} Format or null
 */
export function autoDetectFormat(data: unknown): typeof formats[number] | null
{
    for (let i = 0; i < formats.length; i++)
    {
        if (formats[i].test(data))
        {
            return formats[i];
        }
    }

    return null;
}

/**
 * Auto-detect BitmapFontData parsing format based on data.
 * @private
 * @param {any} data - Data to detect format
 * @returns {BitmapFontData} BitmapFontData
 */
export function autoDetectParse(data: unknown): BitmapFontData
{
    for (let i = 0; i < parseFormats.length; i++)
    {
        if (parseFormats[i].test(data))
        {
            return parseFormats[i].parse(data as string);
        }
    }

    return null;
}

export type { IBitmapFontRawData } from './TextFormat';
export { JSONFormat, JSONStringFormat, TextFormat, XMLFormat, XMLStringFormat };
