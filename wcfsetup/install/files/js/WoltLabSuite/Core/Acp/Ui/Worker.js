/**
 * Worker manager with support for custom callbacks and loop counts.
 *
 * @author  Alexander Ebert
 * @copyright  2001-2019 WoltLab GmbH
 * @license  GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module  WoltLabSuite/Core/Acp/Ui/Worker
 */
define(["require", "exports", "tslib", "../../Ajax", "../../Core", "../../Language", "../../Ui/Dialog"], function (require, exports, tslib_1, Ajax, Core, Language, Dialog_1) {
    "use strict";
    Ajax = tslib_1.__importStar(Ajax);
    Core = tslib_1.__importStar(Core);
    Language = tslib_1.__importStar(Language);
    Dialog_1 = tslib_1.__importDefault(Dialog_1);
    class AcpUiWorker {
        /**
         * Creates a new worker instance.
         */
        constructor(options) {
            this.aborted = false;
            this.options = Core.extend({
                // dialog
                dialogId: "",
                dialogTitle: "",
                // ajax
                className: "",
                loopCount: -1,
                parameters: {},
                implicitContinue: false,
                // callbacks
                callbackAbort: null,
                callbackSuccess: null,
            }, options);
            this.options.dialogId += "Worker";
            // update title
            if (Dialog_1.default.getDialog(this.options.dialogId) !== undefined) {
                Dialog_1.default.setTitle(this.options.dialogId, this.options.dialogTitle);
            }
            this.request = Ajax.api(this);
        }
        _ajaxSuccess(data) {
            if (this.aborted) {
                return;
            }
            if (typeof data.template === "string") {
                Dialog_1.default.open(this, data.template);
            }
            const content = Dialog_1.default.getDialog(this).content;
            // update progress
            const progress = content.querySelector("progress");
            progress.value = data.progress;
            progress.nextElementSibling.textContent = `${data.progress}%`;
            // worker is still busy
            if (data.progress < 100) {
                Ajax.api(this, {
                    loopCount: data.loopCount,
                    parameters: data.parameters,
                });
            }
            else {
                // Suppress the close callback once and then restore it.
                Dialog_1.default.setCallback(this, "onClose", () => {
                    Dialog_1.default.setCallback(this, "onClose", () => this.onClose());
                });
                const spinner = content.querySelector(".fa-spinner");
                spinner.classList.remove("fa-spinner");
                spinner.classList.add("fa-check", "green");
                const formSubmit = document.createElement("div");
                formSubmit.className = "formSubmit";
                formSubmit.innerHTML =
                    '<button class="button buttonPrimary">' + Language.get("wcf.global.button.next") + "</button>";
                content.appendChild(formSubmit);
                Dialog_1.default.rebuild(this);
                const button = formSubmit.children[0];
                if (this.options.implicitContinue) {
                    button.disabled = true;
                    window.setTimeout(() => {
                        this.finalizeWorker(data);
                    }, 500);
                }
                else {
                    button.addEventListener("click", (event) => {
                        event.preventDefault();
                        this.finalizeWorker(data);
                    });
                    button.focus();
                }
            }
        }
        finalizeWorker(data) {
            if (typeof this.options.callbackSuccess === "function") {
                this.options.callbackSuccess(data);
                Dialog_1.default.close(this);
            }
            else {
                window.location.href = data.proceedURL;
            }
        }
        _ajaxFailure() {
            const dialog = Dialog_1.default.getDialog(this);
            if (dialog !== undefined) {
                const spinner = dialog.content.querySelector(".fa-spinner");
                spinner.classList.remove("fa-spinner");
                spinner.classList.add("fa-times", "red");
            }
            return true;
        }
        _ajaxSetup() {
            return {
                data: {
                    className: this.options.className,
                    loopCount: this.options.loopCount,
                    parameters: this.options.parameters,
                },
                silent: true,
                url: "index.php?worker-proxy/&t=" + Core.getXsrfToken(),
            };
        }
        _dialogSetup() {
            return {
                id: this.options.dialogId,
                options: {
                    backdropCloseOnClick: false,
                    onClose: () => this.onClose(),
                    title: this.options.dialogTitle,
                },
                source: null,
            };
        }
        onClose() {
            this.aborted = true;
            this.request.abortPrevious();
            if (typeof this.options.callbackAbort === "function") {
                this.options.callbackAbort();
            }
            else {
                window.location.reload();
            }
        }
    }
    Core.enableLegacyInheritance(AcpUiWorker);
    return AcpUiWorker;
});
