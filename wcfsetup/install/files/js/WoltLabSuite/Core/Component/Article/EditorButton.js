/**
 * Provides a custom editor button to insert article links.
 *
 * @author Alexander Ebert
 * @copyright 2001-2023 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 6.0
 * @woltlabExcludeBundle all
 */
define(["require", "exports", "../../Language", "../../Ui/Article/Search", "../Ckeditor/Event"], function (require, exports, Language_1, Search_1, Event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setup = void 0;
    function setupBbcode(ckeditor) {
        ckeditor.sourceElement.addEventListener("bbcode", (evt) => {
            const bbcode = evt.detail;
            if (bbcode === "wsa") {
                evt.preventDefault();
                (0, Search_1.open)((articleId) => {
                    ckeditor.insertText(`[wsa='${articleId}'][/wsa]`);
                });
            }
        });
    }
    function setup(element) {
        (0, Event_1.listenToCkeditor)(element).setupConfiguration(({ configuration }) => {
            configuration.woltlabBbcode.push({
                icon: "file-word;false",
                name: "wsa",
                label: (0, Language_1.getPhrase)("wcf.editor.button.article"),
            });
        });
        (0, Event_1.listenToCkeditor)(element).ready(({ ckeditor }) => {
            setupBbcode(ckeditor);
        });
    }
    exports.setup = setup;
});
