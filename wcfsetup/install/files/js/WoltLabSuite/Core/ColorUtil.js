/**
 * Helper functions to convert between different color formats.
 *
 * @author      Alexander Ebert
 * @copyright  2001-2021 WoltLab GmbH
 * @license     GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module  ColorUtil (alias)
 * @module      WoltLabSuite/Core/ColorUtil
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rgbaToHex = exports.rgbToHex = exports.hexToRgb = exports.rgbToHsv = exports.hsvToRgb = void 0;
    /**
     * Converts a HSV color into RGB.
     *
     * @see  https://secure.wikimedia.org/wikipedia/de/wiki/HSV-Farbraum#Transformation_von_RGB_und_HSV
     */
    function hsvToRgb(h, s, v) {
        const rgb = { r: 0, g: 0, b: 0 };
        const h2 = Math.floor(h / 60);
        const f = h / 60 - h2;
        s /= 100;
        v /= 100;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));
        if (s == 0) {
            rgb.r = rgb.g = rgb.b = v;
        }
        else {
            switch (h2) {
                case 1:
                    rgb.r = q;
                    rgb.g = v;
                    rgb.b = p;
                    break;
                case 2:
                    rgb.r = p;
                    rgb.g = v;
                    rgb.b = t;
                    break;
                case 3:
                    rgb.r = p;
                    rgb.g = q;
                    rgb.b = v;
                    break;
                case 4:
                    rgb.r = t;
                    rgb.g = p;
                    rgb.b = v;
                    break;
                case 5:
                    rgb.r = v;
                    rgb.g = p;
                    rgb.b = q;
                    break;
                case 0:
                case 6:
                    rgb.r = v;
                    rgb.g = t;
                    rgb.b = p;
                    break;
            }
        }
        return {
            r: Math.round(rgb.r * 255),
            g: Math.round(rgb.g * 255),
            b: Math.round(rgb.b * 255),
        };
    }
    exports.hsvToRgb = hsvToRgb;
    /**
     * Converts a RGB color into HSV.
     *
     * @see  https://secure.wikimedia.org/wikipedia/de/wiki/HSV-Farbraum#Transformation_von_RGB_und_HSV
     */
    function rgbToHsv(r, g, b) {
        let h, s;
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(Math.max(r, g), b);
        const min = Math.min(Math.min(r, g), b);
        const diff = max - min;
        h = 0;
        if (max !== min) {
            switch (max) {
                case r:
                    h = 60 * ((g - b) / diff);
                    break;
                case g:
                    h = 60 * (2 + (b - r) / diff);
                    break;
                case b:
                    h = 60 * (4 + (r - g) / diff);
                    break;
            }
            if (h < 0) {
                h += 360;
            }
        }
        if (max === 0) {
            s = 0;
        }
        else {
            s = diff / max;
        }
        return {
            h: Math.round(h),
            s: Math.round(s * 100),
            v: Math.round(max * 100),
        };
    }
    exports.rgbToHsv = rgbToHsv;
    /**
     * Converts HEX into RGB.
     */
    function hexToRgb(hex) {
        if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
            // only convert #abc and #abcdef
            const parts = hex.split("");
            // drop the hashtag
            if (parts[0] === "#") {
                parts.shift();
            }
            // parse shorthand #xyz
            if (parts.length === 3) {
                return {
                    r: parseInt(parts[0] + "" + parts[0], 16),
                    g: parseInt(parts[1] + "" + parts[1], 16),
                    b: parseInt(parts[2] + "" + parts[2], 16),
                };
            }
            else {
                return {
                    r: parseInt(parts[0] + "" + parts[1], 16),
                    g: parseInt(parts[2] + "" + parts[3], 16),
                    b: parseInt(parts[4] + "" + parts[5], 16),
                };
            }
        }
        return Number.NaN;
    }
    exports.hexToRgb = hexToRgb;
    /**
     * @since 5.5
     */
    function rgbComponentToHex(component) {
        if (component < 0 || component > 255) {
            throw new Error(`Invalid RGB component value '${component}' given.`);
        }
        return component.toString(16).padStart(2, "0").toUpperCase();
    }
    function rgbToHex(r, g, b) {
        if (g === undefined) {
            const match = /^rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?[0-9.]+)?\)$/.exec(r.toString());
            if (match) {
                r = +match[1];
                g = +match[2];
                b = +match[3];
            }
            else {
                throw new Error("Invalid RGB data given.");
            }
        }
        return rgbComponentToHex(r) + rgbComponentToHex(g) + rgbComponentToHex(b);
    }
    exports.rgbToHex = rgbToHex;
    /**
     * @since 5.5
     */
    function alphaToHex(alpha) {
        if (alpha < 0 || alpha > 1) {
            throw new Error(`Invalid alpha value '${alpha}' given.`);
        }
        return Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")
            .toUpperCase();
    }
    function rgbaToHex(r, g, b, a) {
        if (g === undefined) {
            const rgba = r;
            return rgbToHex(rgba.r, rgba.g, rgba.b) + alphaToHex(rgba.a);
        }
        return rgbToHex(r, g, b) + alphaToHex(a);
    }
    exports.rgbaToHex = rgbaToHex;
    // WCF.ColorPicker compatibility (color format conversion)
    window.__wcf_bc_colorUtil = {
        hexToRgb,
        hsvToRgb,
        rgbaToHex,
        rgbToHex,
        rgbToHsv,
    };
});
