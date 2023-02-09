/**
 * Data handler for an item list form builder field in an Ajax form.
 *
 * @author  Matthias Schmidt
 * @copyright 2001-2020 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 5.2
 */
define(["require", "exports", "tslib", "./Field", "../../../Ui/ItemList/Static"], function (require, exports, tslib_1, Field_1, UiItemListStatic) {
    "use strict";
    Field_1 = tslib_1.__importDefault(Field_1);
    UiItemListStatic = tslib_1.__importStar(UiItemListStatic);
    class ItemList extends Field_1.default {
        _getData() {
            const values = [];
            UiItemListStatic.getValues(this._fieldId).forEach((item) => {
                if (item.objectId) {
                    values[item.objectId] = item.value;
                }
                else {
                    values.push(item.value);
                }
            });
            return {
                [this._fieldId]: values,
            };
        }
    }
    return ItemList;
});
