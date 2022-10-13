/**
 * Manages code blocks.
 *
 * @author      Alexander Ebert
 * @copyright  2001-2019 WoltLab GmbH
 * @license     GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module      WoltLabSuite/Core/Ui/Redactor/Code
 * @woltlabExcludeBundle tiny
 */
define(["require", "exports", "tslib", "../../Dom/Util", "../../Event/Handler", "../../Language", "../../StringUtil", "../Dialog", "./PseudoHeader", "../../prism-meta"], function (require, exports, tslib_1, Util_1, EventHandler, Language, StringUtil, Dialog_1, UiRedactorPseudoHeader, prism_meta_1) {
    "use strict";
    Util_1 = tslib_1.__importDefault(Util_1);
    EventHandler = tslib_1.__importStar(EventHandler);
    Language = tslib_1.__importStar(Language);
    StringUtil = tslib_1.__importStar(StringUtil);
    Dialog_1 = tslib_1.__importDefault(Dialog_1);
    UiRedactorPseudoHeader = tslib_1.__importStar(UiRedactorPseudoHeader);
    prism_meta_1 = tslib_1.__importDefault(prism_meta_1);
    let _headerHeight = 0;
    class UiRedactorCode {
        _callbackEdit;
        _editor;
        _elementId;
        _pre = null;
        knownElements = new WeakSet();
        /**
         * Initializes the source code management.
         */
        constructor(editor) {
            this._editor = editor;
            this._elementId = this._editor.$element[0].id;
            EventHandler.add("com.woltlab.wcf.redactor2", `bbcode_code_${this._elementId}`, (data) => this._bbcodeCode(data));
            EventHandler.add("com.woltlab.wcf.redactor2", `observe_load_${this._elementId}`, () => this._observeLoad());
            // support for active button marking
            this._editor.opts.activeButtonsStates.pre = "code";
            // static bind to ensure that removing works
            this._callbackEdit = this._edit.bind(this);
            // bind listeners on init
            this._observeLoad();
        }
        /**
         * Intercepts the insertion of `[code]` tags and uses a native `<pre>` instead.
         */
        _bbcodeCode(data) {
            data.cancel = true;
            let pre = this._editor.selection.block();
            if (pre && pre.nodeName === "PRE" && pre.classList.contains("woltlabHtml")) {
                return;
            }
            this._editor.button.toggle({}, "pre", "func", "block.format");
            pre = this._editor.selection.block();
            if (pre && pre.nodeName === "PRE" && !pre.classList.contains("woltlabHtml")) {
                if (pre.childElementCount === 1 && pre.children[0].nodeName === "BR") {
                    // drop superfluous linebreak
                    pre.removeChild(pre.children[0]);
                }
                this._setTitle(pre);
                pre.addEventListener("click", this._callbackEdit);
                // work-around for Safari
                this._editor.caret.end(pre);
            }
        }
        /**
         * Binds event listeners and sets quote title on both editor
         * initialization and when switching back from code view.
         */
        _observeLoad() {
            this._editor.$editor[0].querySelectorAll("pre:not(.woltlabHtml)").forEach((pre) => {
                if (!this.knownElements.has(pre)) {
                    this.knownElements.add(pre);
                    pre.addEventListener("mousedown", this._callbackEdit);
                }
                this._setTitle(pre);
            });
        }
        /**
         * Opens the dialog overlay to edit the code's properties.
         */
        _edit(event) {
            const pre = event.currentTarget;
            if (_headerHeight === 0) {
                _headerHeight = UiRedactorPseudoHeader.getHeight(pre);
            }
            // check if the click hit the header
            const offset = Util_1.default.offset(pre);
            if (event.pageY > offset.top && event.pageY < offset.top + _headerHeight) {
                event.preventDefault();
                this._editor.selection.save();
                this._pre = pre;
                Dialog_1.default.open(this);
            }
        }
        /**
         * Saves the changes to the code's properties.
         */
        _dialogSubmit() {
            const id = "redactor-code-" + this._elementId;
            const pre = this._pre;
            ["file", "highlighter", "line"].forEach((attr) => {
                const input = document.getElementById(`${id}-${attr}`);
                pre.dataset[attr] = input.value;
            });
            this._setTitle(pre);
            this._editor.caret.after(pre);
            Dialog_1.default.close(this);
        }
        /**
         * Sets or updates the code's header title.
         */
        _setTitle(pre) {
            const file = pre.dataset.file;
            let highlighter = pre.dataset.highlighter;
            highlighter =
                this._editor.opts.woltlab.highlighters.indexOf(highlighter) !== -1 ? prism_meta_1.default[highlighter].title : "";
            const title = Language.get("wcf.editor.code.title", {
                file,
                highlighter,
            });
            if (pre.dataset.title !== title) {
                pre.dataset.title = title;
            }
        }
        _delete(event) {
            event.preventDefault();
            const pre = this._pre;
            let caretEnd = pre.nextElementSibling || pre.previousElementSibling;
            if (caretEnd === null && pre.parentElement !== this._editor.core.editor()[0]) {
                caretEnd = pre.parentElement;
            }
            if (caretEnd === null) {
                this._editor.code.set("");
                this._editor.focus.end();
            }
            else {
                pre.remove();
                this._editor.caret.end(caretEnd);
            }
            Dialog_1.default.close(this);
        }
        _dialogSetup() {
            const id = `redactor-code-${this._elementId}`;
            const idButtonDelete = `${id}-button-delete`;
            const idButtonSave = `${id}-button-save`;
            const idFile = `${id}-file`;
            const idHighlighter = `${id}-highlighter`;
            const idLine = `${id}-line`;
            return {
                id: id,
                options: {
                    onClose: () => {
                        this._editor.selection.restore();
                        Dialog_1.default.destroy(this);
                    },
                    onSetup: () => {
                        document.getElementById(idButtonDelete).addEventListener("click", (ev) => this._delete(ev));
                        // set highlighters
                        let highlighters = `<option value="">${Language.get("wcf.editor.code.highlighter.detect")}</option>
            <option value="plain">${Language.get("wcf.editor.code.highlighter.plain")}</option>`;
                        const values = this._editor.opts.woltlab.highlighters.map((highlighter) => {
                            return [highlighter, prism_meta_1.default[highlighter].title];
                        });
                        // sort by label
                        values.sort((a, b) => a[1].localeCompare(b[1]));
                        highlighters += values
                            .map(([highlighter, title]) => {
                            return `<option value="${highlighter}">${StringUtil.escapeHTML(title)}</option>`;
                        })
                            .join("\n");
                        document.getElementById(idHighlighter).innerHTML = highlighters;
                    },
                    onShow: () => {
                        const pre = this._pre;
                        const highlighter = document.getElementById(idHighlighter);
                        highlighter.value = pre.dataset.highlighter || "";
                        const line = ~~(pre.dataset.line || 1);
                        const lineInput = document.getElementById(idLine);
                        lineInput.value = line.toString();
                        const filename = document.getElementById(idFile);
                        filename.value = pre.dataset.file || "";
                    },
                    title: Language.get("wcf.editor.code.edit"),
                },
                source: `<div class="section">
          <dl>
            <dt>
              <label for="${idHighlighter}">${Language.get("wcf.editor.code.highlighter")}</label>
            </dt>
            <dd>
              <select id="${idHighlighter}"></select>
              <small>${Language.get("wcf.editor.code.highlighter.description")}</small>
            </dd>
          </dl>
          <dl>
            <dt>
              <label for="${idLine}">${Language.get("wcf.editor.code.line")}</label>
            </dt>
            <dd>
              <input type="number" id="${idLine}" min="0" value="1" class="long" data-dialog-submit-on-enter="true">
              <small>${Language.get("wcf.editor.code.line.description")}</small>
            </dd>
          </dl>
          <dl>
            <dt>
              <label for="${idFile}">${Language.get("wcf.editor.code.file")}</label>
            </dt>
            <dd>
              <input type="text" id="${idFile}" class="long" data-dialog-submit-on-enter="true">
              <small>${Language.get("wcf.editor.code.file.description")}</small>
            </dd>
          </dl>
        </div>
        <div class="formSubmit">
          <button type="button" id="${idButtonSave}" class="button buttonPrimary" data-type="submit">${Language.get("wcf.global.button.save")}</button>
          <button type="button" id="${idButtonDelete}" class="button">${Language.get("wcf.global.button.delete")}</button>
        </div>`,
            };
        }
    }
    return UiRedactorCode;
});
