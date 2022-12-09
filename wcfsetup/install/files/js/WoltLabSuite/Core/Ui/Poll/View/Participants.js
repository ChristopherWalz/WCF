/**
 * Abstract implementation for participants views.
 *
 * @author  Joshua Ruesweg
 * @copyright  2001-2022 WoltLab GmbH
 * @license  GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module  WoltLabSuite/Core/Ui/Poll/View/Participants
 * @since   5.5
 */
define(["require", "exports", "tslib", "../../User/List"], function (require, exports, tslib_1, List_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Participants = void 0;
    List_1 = tslib_1.__importDefault(List_1);
    class Participants {
        constructor(manager) {
            this.userList = undefined;
            this.pollManager = manager;
            const button = this.pollManager.getElement().querySelector(".showPollParticipantsButton");
            if (!button) {
                throw new Error(`Could not find button with selector "showPollParticipantsButton" for poll "${this.pollManager.pollId}"`);
            }
            this.button = button;
            this.button.addEventListener("click", (event) => {
                if (event) {
                    event.preventDefault();
                }
                this.open();
            });
        }
        open() {
            if (!this.userList) {
                this.userList = new List_1.default({
                    className: "wcf\\data\\poll\\PollAction",
                    dialogTitle: this.pollManager.question,
                    parameters: {
                        pollID: this.pollManager.pollId,
                    },
                });
            }
            this.userList.open();
        }
        showButton() {
            this.button.hidden = false;
        }
        hideButton() {
            this.button.hidden = true;
        }
    }
    exports.Participants = Participants;
    exports.default = Participants;
});
