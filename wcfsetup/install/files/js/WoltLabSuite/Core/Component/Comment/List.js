/**
 * Handles the comment list.
 *
 * @author Marcel Werk
 * @copyright 2001-2023 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module WoltLabSuite/Core/Component/Comment/List
 * @since 6.0
 */
define(["require", "exports", "tslib", "../../Ajax", "../../Dom/Change/Listener", "../../Dom/Util", "../../Helper/Selector", "../../Language", "./Add", "./Response/Add", "../../Ui/Scroll"], function (require, exports, tslib_1, Ajax_1, Listener_1, Util_1, Selector_1, Language_1, Add_1, Add_2, UiScroll) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setup = void 0;
    Listener_1 = tslib_1.__importDefault(Listener_1);
    Util_1 = tslib_1.__importDefault(Util_1);
    UiScroll = tslib_1.__importStar(UiScroll);
    class CommentList {
        #container;
        #commentResponseAdd;
        constructor(container) {
            this.#container = container;
            this.#initComments();
            this.#initResponses();
            this.#initLoadNextComments();
            this.#initCommentAdd();
            this.#initHashHandling();
        }
        #initHashHandling() {
            window.addEventListener("hashchange", () => {
                this.#handleHashChange();
            });
            this.#handleHashChange();
        }
        #handleHashChange() {
            const matches = window.location.hash.match(/^#(?:[^/]+\/)?comment(\d+)(?:\/response(\d+))?/);
            if (matches) {
                const comment = this.#container.querySelector(`.commentList__item[data-comment-id="${matches[1]}"]`);
                if (comment) {
                    if (matches[2]) {
                        const response = this.#container.querySelector(`.commentResponseList__item[data-response-id="${matches[2]}"]`);
                        if (response) {
                            this.#scrollTo(response, true);
                        }
                        else {
                            void this.#loadResponseSegment(comment, parseInt(matches[2]));
                        }
                    }
                    else {
                        this.#scrollTo(comment, true);
                    }
                }
                else {
                    void this.#loadCommentSegment(parseInt(matches[1]), matches[2] ? parseInt(matches[2]) : 0);
                }
            }
        }
        async #loadCommentSegment(commentId, responseId) {
            let permaLinkComment = this.#container.querySelector(".commentPermalink");
            if (permaLinkComment) {
                permaLinkComment.remove();
            }
            permaLinkComment = document.createElement("div");
            permaLinkComment.classList.add("commentList__item", "commentPermalink", "commentPermalink--loading");
            permaLinkComment.innerHTML =
                '<woltlab-core-loading-indicator size="48" hide-text></woltlab-core-loading-indicator>';
            this.#container.querySelector(".commentList")?.prepend(permaLinkComment);
            let ajaxResponse;
            try {
                ajaxResponse = (await (0, Ajax_1.dboAction)("loadComment", "wcf\\data\\comment\\CommentAction")
                    .objectIds([commentId])
                    .payload({
                    responseID: responseId,
                })
                    .dispatch());
            }
            catch (error) {
                await (0, Ajax_1.handleValidationErrors)(error, () => {
                    // The comment id is invalid or there is a mismatch, silently ignore it.
                    permaLinkComment.remove();
                    return true;
                });
            }
            const { template, response } = ajaxResponse;
            Util_1.default.insertHtml(template, permaLinkComment, "before");
            permaLinkComment.remove();
            const comment = this.#container.querySelector(`.commentList__item[data-comment-id="${commentId}"]`);
            comment.classList.add("commentPermalink");
            if (response) {
                const permalinkResponse = document.createElement("div");
                permalinkResponse.classList.add("commentResponseList__item", "commentResponsePermalink", "commentResponsePermalink--loading");
                permalinkResponse.innerHTML =
                    '<woltlab-core-loading-indicator size="32" hide-text></woltlab-core-loading-indicator>';
                comment.querySelector(".commentResponseList").prepend(permalinkResponse);
                this.#insertResponseSegment(response);
            }
            else {
                this.#scrollTo(comment, true);
            }
        }
        #insertResponseSegment(template) {
            const permalinkResponse = this.#container.querySelector(".commentResponsePermalink");
            Util_1.default.insertHtml(template, permalinkResponse, "before");
            const response = permalinkResponse.previousElementSibling;
            permalinkResponse.classList.add("commentResponsePermalink");
            permalinkResponse.remove();
            this.#scrollTo(response, true);
        }
        async #loadResponseSegment(comment, responseId) {
            let permalinkResponse = comment.querySelector(".commentResponsePermalink");
            if (permalinkResponse) {
                permalinkResponse.remove();
            }
            permalinkResponse = document.createElement("div");
            permalinkResponse.classList.add("commentResponseList__item", "commentResponsePermalink", "commentResponsePermalink--loading");
            permalinkResponse.innerHTML =
                '<woltlab-core-loading-indicator size="32" hide-text></woltlab-core-loading-indicator>';
            comment.querySelector(".commentResponseList").prepend(permalinkResponse);
            let response;
            try {
                response = (await (0, Ajax_1.dboAction)("loadResponse", "wcf\\data\\comment\\CommentAction")
                    .payload({
                    responseID: responseId,
                })
                    .dispatch());
            }
            catch (error) {
                await (0, Ajax_1.handleValidationErrors)(error, () => {
                    // The response id is invalid or there is a mismatch, silently ignore it.
                    permalinkResponse.remove();
                    return true;
                });
            }
            this.#insertResponseSegment(response.template);
        }
        #scrollTo(element, highlight = false) {
            UiScroll.element(element, () => {
                if (highlight) {
                    if (element.classList.contains("comment__highlight__target")) {
                        element.classList.remove("comment__highlight__target");
                    }
                    element.classList.add("comment__highlight__target");
                }
            });
        }
        #initCommentAdd() {
            if (this.#container.dataset.canAdd) {
                new Add_1.CommentAdd(this.#container.querySelector(".commentAdd"), parseInt(this.#container.dataset.objectTypeId), parseInt(this.#container.dataset.objectId), (template) => {
                    this.#insertComment(template);
                });
                this.#commentResponseAdd = new Add_2.CommentResponseAdd(this.#container.querySelector(".commentResponseAdd"), (commentId, template) => {
                    this.#insertResponse(commentId, template);
                });
            }
        }
        #initComments() {
            (0, Selector_1.wheneverFirstSeen)("woltlab-core-comment", (element) => {
                if (!this.#container.contains(element)) {
                    return;
                }
                element.addEventListener("reply", () => {
                    this.#showAddResponse(element, element.commentId);
                });
                element.addEventListener("delete", () => {
                    element.parentElement?.remove();
                });
                this.#initLoadNextResponses(element.parentElement);
            });
        }
        #initResponses() {
            (0, Selector_1.wheneverFirstSeen)("woltlab-core-comment-response", (element) => {
                if (!this.#container.contains(element)) {
                    return;
                }
                element.addEventListener("delete", () => {
                    element.parentElement?.remove();
                });
            });
        }
        #initLoadNextResponses(comment) {
            const displayedResponses = comment.querySelectorAll(".commentResponse").length;
            const responses = parseInt(comment.dataset.responses);
            if (displayedResponses < responses) {
                const phrase = (0, Language_1.getPhrase)("wcf.comment.response.more", { count: responses - displayedResponses });
                if (!comment.querySelector(".commentLoadNextResponses")) {
                    const item = document.createElement("div");
                    item.classList.add("commentResponseList__item", "commentLoadNextResponses");
                    comment.querySelector(".commentResponseList").append(item);
                    const button = document.createElement("button");
                    button.type = "button";
                    button.classList.add("button", "small", "commentLoadNextResponses__button");
                    button.textContent = phrase;
                    item.append(button);
                    button.addEventListener("click", () => {
                        void this.#loadNextResponses(comment);
                    });
                }
                else {
                    comment.querySelector(".commentLoadNextResponses__button").textContent = phrase;
                }
            }
            else {
                comment.querySelector(".commentLoadNextResponses")?.remove();
            }
        }
        async #loadNextResponses(comment, loadAllResponses = false) {
            const button = comment.querySelector(".commentLoadNextResponses__button");
            button.disabled = true;
            const response = (await (0, Ajax_1.dboAction)("loadResponses", "wcf\\data\\comment\\response\\CommentResponseAction")
                .payload({
                data: {
                    commentID: comment.dataset.commentId,
                    lastResponseTime: comment.dataset.lastResponseTime,
                    lastResponseID: comment.dataset.lastResponseId,
                    loadAllResponses: loadAllResponses ? 1 : 0,
                },
            })
                .dispatch());
            const fragment = Util_1.default.createFragmentFromHtml(response.template);
            fragment.querySelectorAll(".commentResponseList__item").forEach((element) => {
                comment.querySelector(`.commentResponseList__item[data-response-id="${element.dataset.responseId}"]`)?.remove();
            });
            comment
                .querySelector(".commentResponseList")
                .insertBefore(fragment, this.#container.querySelector(".commentLoadNextResponses"));
            comment.dataset.lastResponseTime = response.lastResponseTime.toString();
            comment.dataset.lastResponseId = response.lastResponseID.toString();
            this.#initLoadNextResponses(comment);
        }
        #initLoadNextComments() {
            if (this.#displayedComments < this.#totalComments) {
                if (!this.#container.querySelector(".commentLoadNext")) {
                    const div = document.createElement("div");
                    div.classList.add("commentList__item", "commentLoadNext");
                    this.#container.querySelector(".commentList").append(div);
                    const button = document.createElement("button");
                    button.type = "button";
                    button.classList.add("button", "small", "commentLoadNext__button");
                    button.textContent = (0, Language_1.getPhrase)("wcf.comment.more");
                    div.append(button);
                    button.addEventListener("click", () => {
                        void this.#loadNextComments();
                    });
                }
            }
        }
        async #loadNextComments() {
            const button = this.#container.querySelector(".commentLoadNext__button");
            button.disabled = true;
            const response = (await (0, Ajax_1.dboAction)("loadComments", "wcf\\data\\comment\\CommentAction")
                .payload({
                data: {
                    objectID: this.#container.dataset.objectId,
                    objectTypeID: this.#container.dataset.objectTypeId,
                    lastCommentTime: this.#container.dataset.lastCommentTime,
                },
            })
                .dispatch());
            const fragment = Util_1.default.createFragmentFromHtml(response.template);
            fragment.querySelectorAll(".commentList__item").forEach((element) => {
                this.#container.querySelector(`.commentList__item[data-comment-id="${element.dataset.commentId}"]`)?.remove();
            });
            this.#container
                .querySelector(".commentList")
                .insertBefore(fragment, this.#container.querySelector(".commentLoadNext"));
            this.#container.dataset.lastCommentTime = response.lastCommentTime.toString();
            if (this.#displayedComments < this.#totalComments) {
                button.disabled = false;
            }
            else {
                this.#container.querySelector(".commentLoadNext").hidden = true;
            }
        }
        #showAddResponse(comment, commentId) {
            comment.parentElement.append(this.#commentResponseAdd.container);
            this.#commentResponseAdd.show(commentId);
        }
        #insertComment(template) {
            Util_1.default.insertHtml(template, this.#container.querySelector(".commentAdd"), "after");
            Listener_1.default.trigger();
            const scrollTarget = this.#container.querySelector(".commentAdd").nextElementSibling;
            window.setTimeout(() => {
                UiScroll.element(scrollTarget);
            }, 100);
        }
        #insertResponse(commentId, template) {
            const item = this.#container.querySelector(`.commentList__item[data-comment-id="${commentId}"]`);
            let commentResponseList = item.querySelector(".commentResponseList");
            if (!commentResponseList) {
                const div = document.createElement("div");
                div.classList.add("comment__responses");
                item.append(div);
                commentResponseList = document.createElement("div");
                commentResponseList.classList.add("commentResponseList");
                commentResponseList.dataset.responses = "1";
                div.append(commentResponseList);
            }
            Util_1.default.insertHtml(template, commentResponseList, "append");
            Listener_1.default.trigger();
            const scrollTarget = commentResponseList.firstElementChild;
            window.setTimeout(() => {
                UiScroll.element(scrollTarget);
            }, 100);
        }
        get #displayedComments() {
            return this.#container.querySelectorAll(".comment").length;
        }
        get #totalComments() {
            return parseInt(this.#container.dataset.comments);
        }
    }
    function setup(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.debug(`Unable to find the container identified by '${elementId}'`);
            return;
        }
        new CommentList(element);
    }
    exports.setup = setup;
});
