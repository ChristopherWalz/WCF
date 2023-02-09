/**
 * Data handler for a button form builder field in an Ajax form.
 *
 * @author  Matthias Schmidt
 * @copyright 2001-2020 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 5.4
 */
define(["require", "exports", "tslib", "./Field"], function (require, exports, tslib_1, Field_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Button = void 0;
    Field_1 = tslib_1.__importDefault(Field_1);
    class Button extends Field_1.default {
        _getData() {
            const data = {};
            if (this._field.dataset.isClicked === "1") {
                data[this._fieldId] = this._field.value;
            }
            return data;
        }
    }
    exports.Button = Button;
    exports.default = Button;
});
