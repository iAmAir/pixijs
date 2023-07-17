import { JSONFormat } from './JSONFormat';

import type { BitmapFontData } from '../BitmapFontData';

/**
 * BitmapFont format that's JSON-based.
 * @private
 */
export class JSONStringFormat
{
    /**
     * Check if resource refers to text json font data.
     * @param data
     * @returns - True if resource could be treated as font data, false otherwise.
     */
    static test(data: unknown): boolean
    {
        if (typeof data === 'string')
        {
            try
            {
                const json = JSON.parse(data);

                return JSONFormat.test(json);
            }
            catch (e)
            {
                return false;
            }
        }

        return false;
    }

    /**
     * Convert the text JSON into BitmapFontData that we can use.
     * @param jsonTxt
     * @returns - Data to use for BitmapFont
     */
    static parse(jsonTxt: string): BitmapFontData
    {
        return JSONFormat.parse(JSON.parse(jsonTxt));
    }
}
