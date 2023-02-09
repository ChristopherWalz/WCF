/**
 * Data handler for a tag form builder field in an Ajax form.
 *
 * @author  Matthias Schmidt
 * @copyright 2001-2020 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 5.2
 */
define(["require", "exports", "tslib", "./Field", "../../../Ui/ItemList"], function (require, exports, tslib_1, Field_1, UiItemList) {
    "use strict";
    Field_1 = tslib_1.__importDefault(Field_1);
    UiItemList = tslib_1.__importStar(UiItemList);
    class Tag extends Field_1.default {
        _getData() {
            const values = UiItemList.getValues(this._fieldId).map((item) => item.value);
            return {
                [this._fieldId]: values,
            };
        }
    }
    return Tag;
});
