import { BitmapFontData } from '../BitmapFontData';

/**
 * Internal data format used to convert to BitmapFontData
 * @private
 */
export interface IBitmapFontJSONData
{
    page?: {
        id: number;
        file: string;
    }[];
    atlas: {
        type: string;
        distanceRange: number;
        size: number;
        width: number;
        height: number;
        yOrigin: string;
    };
    name: string;
    metrics: {
        emSize: number;
        lineHeight: number;
        ascender: number;
        descender: number;
        underlineY: number;
        underlineThickness: number;
    };
    glyphs: {
        unicode: number;
        advance: number;
        planeBounds?: {
            left: number;
            bottom: number;
            right: number;
            top: number;
        };
        atlasBounds?: {
            left: number;
            bottom: number;
            right: number;
            top: number;
        };
    }[];
    kerning: {
        unicode1: number;
        unicode2: number;
        advance: number;
    }[];
}

const supportedFormats = ['msdf', 'mtsdf', 'sdf'];

/**
 * BitmapFont in msdf-atlas-gen JSON format
 * @class
 * @private
 */
export class JSONFormat
{
    /**
     * Check if resource refers to json MSDF font data.
     * @static
     * @private
     * @param {any} data
     * @returns {boolean} True if resource could be treated as font data, false otherwise.
     */
    static test(data: unknown): boolean
    {
        for (let i = 0; i < supportedFormats.length; i++)
        {
            const type: string = (data as Partial<IBitmapFontJSONData>)?.atlas?.type;

            if (type === supportedFormats[i])
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Convert the JSON into BitmapFontData that we can use.
     * @static
     * @private
     * @param {IBitmapFontJSONData} json
     * @returns {BitmapFontData} Data to use for BitmapFont
     */
    static parse(json: IBitmapFontJSONData): BitmapFontData
    {
        const data = new BitmapFontData();

        data.info.push({
            face: json.name,
            size: json.atlas.size,
        });

        data.common.push({
            lineHeight: json.atlas.size * json.metrics.lineHeight,
        });

        if (json.page.length > 0)
        {
            for (let i = 0; i < json.page.length; i++)
            {
                data.page.push({
                    id: json.page[i].id,
                    file: json.page[i].file
                });
            }
        }
        else
        {
            data.page.push({
                id: 0,
                file: `${json.name}.png`
            });
        }

        for (let i = 0; i < json.glyphs.length; i++)
        {
            const letter = json.glyphs[i];
            const x = letter?.atlasBounds?.left || 0;
            const y = ((json.atlas.yOrigin === 'bottom')
                ? json.atlas.height - letter?.atlasBounds?.top
                : letter?.atlasBounds?.top) || 0;
            const width = (letter?.atlasBounds?.right - letter?.atlasBounds?.left) || 0;
            const height = ((json.atlas.yOrigin === 'bottom')
                ? letter?.atlasBounds?.top - letter?.atlasBounds?.bottom
                : letter?.atlasBounds?.bottom - letter?.atlasBounds?.top) || 0;
            const xoffset = letter?.planeBounds?.left * json.atlas.size || 0;
            const yoffset = (1 - letter?.planeBounds?.top) * json.atlas.size || 0;
            const xadvance = letter.advance * json.atlas.size;

            data.char.push({
                id: letter.unicode,
                page: 0,
                x,
                y,
                width,
                height,
                xoffset,
                yoffset,
                xadvance,
            });
        }

        for (let i = 0; i < json.kerning.length; i++)
        {
            const pair = json.kerning[i];

            data.kerning.push({
                amount: pair.advance,
                first: pair.unicode1,
                second: pair.unicode2
            });
        }

        data.distanceField.push({
            distanceRange: json.atlas.distanceRange,
            fieldType: json.atlas.type
        });

        return data;
    }
}
