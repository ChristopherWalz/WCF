/**
 * Data handler for the poll options.
 *
 * @author  Matthias Schmidt
 * @copyright 2001-2020 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 5.2
 */
define(["require", "exports", "tslib", "../Field"], function (require, exports, tslib_1, Field_1) {
    "use strict";
    Field_1 = tslib_1.__importDefault(Field_1);
    class Poll extends Field_1.default {
        _pollEditor;
        _getData() {
            return this._pollEditor.getData();
        }
        _readField() {
            // does nothing
        }
        setPollEditor(pollEditor) {
            this._pollEditor = pollEditor;
        }
    }
    return Poll;
});
