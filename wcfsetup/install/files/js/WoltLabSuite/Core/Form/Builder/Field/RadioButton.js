/**
 * Data handler for a radio button form builder field in an Ajax form.
 *
 * @author  Matthias Schmidt
 * @copyright 2001-2020 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module  WoltLabSuite/Core/Form/Builder/Field/RadioButton
 * @since 5.2
 */
define(["require", "exports", "tslib", "./Field"], function (require, exports, tslib_1, Field_1) {
    "use strict";
    Field_1 = tslib_1.__importDefault(Field_1);
    class RadioButton extends Field_1.default {
        _fields;
        _getData() {
            const data = {};
            this._fields.some((input) => {
                if (input.checked) {
                    data[this._fieldId] = input.value;
                    return true;
                }
                return false;
            });
            return data;
        }
        _readField() {
            this._fields = Array.from(document.querySelectorAll("input[name=" + this._fieldId + "]"));
        }
    }
    return RadioButton;
});
