/**
 * Delete files which are uploaded via AJAX.
 *
 * @author  Joshua Ruesweg
 * @copyright  2001-2019 WoltLab GmbH
 * @license  GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module  WoltLabSuite/Core/Ui/File/Delete
 * @since  5.2
 * @woltlabExcludeBundle tiny
 */
define(["require", "exports", "tslib", "../../Ajax", "../../Core", "../../Dom/Change/Listener", "../../Language"], function (require, exports, tslib_1, Ajax, Core, Listener_1, Language) {
    "use strict";
    Ajax = (0, tslib_1.__importStar)(Ajax);
    Core = (0, tslib_1.__importStar)(Core);
    Listener_1 = (0, tslib_1.__importDefault)(Listener_1);
    Language = (0, tslib_1.__importStar)(Language);
    class UiFileDelete {
        constructor(buttonContainerId, targetId, isSingleImagePreview, uploadHandler) {
            this.containers = new Map();
            this.deleteButton = undefined;
            this.isSingleImagePreview = isSingleImagePreview;
            this.uploadHandler = uploadHandler;
            const buttonContainer = document.getElementById(buttonContainerId);
            if (buttonContainer === null) {
                throw new Error(`Element id '${buttonContainerId}' is unknown.`);
            }
            this.buttonContainer = buttonContainer;
            const target = document.getElementById(targetId);
            if (target === null) {
                throw new Error(`Element id '${targetId}' is unknown.`);
            }
            this.target = target;
            const internalId = this.target.dataset.internalId;
            if (!internalId) {
                throw new Error("InternalId is unknown.");
            }
            this.internalId = internalId;
            this.rebuild();
        }
        /**
         * Creates the upload button.
         */
        createButtons() {
            let triggerChange = false;
            this.target.querySelectorAll("li.uploadedFile").forEach((element) => {
                const uniqueFileId = element.dataset.uniqueFileId;
                if (this.containers.has(uniqueFileId)) {
                    return;
                }
                const elementData = {
                    uniqueFileId: uniqueFileId,
                    element: element,
                };
                this.containers.set(uniqueFileId, elementData);
                this.initDeleteButton(element, elementData);
                triggerChange = true;
            });
            if (triggerChange) {
                Listener_1.default.trigger();
            }
        }
        /**
         * Init the delete button for a specific element.
         */
        initDeleteButton(element, elementData) {
            const buttonGroup = element.querySelector(".buttonGroup");
            if (buttonGroup === null) {
                throw new Error(`Button group in '${this.target.id}' is unknown.`);
            }
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.className = "button jsDeleteButton small";
            span.textContent = Language.get("wcf.global.button.delete");
            li.appendChild(span);
            buttonGroup.appendChild(li);
            li.addEventListener("click", this.deleteElement.bind(this, elementData.uniqueFileId));
        }
        /**
         * Delete a specific file with the given uniqueFileId.
         */
        deleteElement(uniqueFileId) {
            Ajax.api(this, {
                uniqueFileId: uniqueFileId,
                internalId: this.internalId,
            });
        }
        /**
         * Rebuilds the delete buttons for unknown files.
         */
        rebuild() {
            if (!this.isSingleImagePreview) {
                this.createButtons();
                return;
            }
            const img = this.target.querySelector("img");
            if (img !== null) {
                const uniqueFileId = img.dataset.uniqueFileId;
                if (!this.containers.has(uniqueFileId)) {
                    const elementData = {
                        uniqueFileId: uniqueFileId,
                        element: img,
                    };
                    this.containers.set(uniqueFileId, elementData);
                    this.deleteButton = document.createElement("p");
                    this.deleteButton.className = "button deleteButton";
                    const span = document.createElement("span");
                    span.textContent = Language.get("wcf.global.button.delete");
                    this.deleteButton.appendChild(span);
                    this.buttonContainer.appendChild(this.deleteButton);
                    this.deleteButton.addEventListener("click", this.deleteElement.bind(this, elementData.uniqueFileId));
                }
            }
        }
        _ajaxSuccess(data) {
            const elementData = this.containers.get(data.uniqueFileId);
            elementData.element.remove();
            if (this.isSingleImagePreview && this.deleteButton) {
                this.deleteButton.remove();
                this.deleteButton = undefined;
            }
            this.uploadHandler.checkMaxFiles();
            Core.triggerEvent(this.target, "change");
        }
        _ajaxSetup() {
            return {
                url: "index.php?ajax-file-delete/&t=" + Core.getXsrfToken(),
            };
        }
    }
    Core.enableLegacyInheritance(UiFileDelete);
    return UiFileDelete;
});
