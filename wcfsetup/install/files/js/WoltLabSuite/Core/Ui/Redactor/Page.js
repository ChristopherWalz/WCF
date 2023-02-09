/**
 * Converts `<woltlab-metacode>` into the bbcode representation.
 *
 * @author  Alexander Ebert
 * @copyright  2001-2019 WoltLab GmbH
 * @license  GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @woltlabExcludeBundle tiny
 */
define(["require", "exports", "tslib", "../Page/Search"], function (require, exports, tslib_1, UiPageSearch) {
    "use strict";
    UiPageSearch = tslib_1.__importStar(UiPageSearch);
    class UiRedactorPage {
        _editor;
        constructor(editor, button) {
            this._editor = editor;
            button.addEventListener("click", (ev) => this._click(ev));
        }
        _click(event) {
            event.preventDefault();
            UiPageSearch.open((pageId) => this._insert(pageId));
        }
        _insert(pageId) {
            this._editor.buffer.set();
            this._editor.insert.text(`[wsp='${pageId}'][/wsp]`);
        }
    }
    return UiRedactorPage;
});
