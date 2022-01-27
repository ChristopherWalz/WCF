/**
 * @woltlabExcludeBundle all
 */
define(["require", "exports", "tslib", "../../../../../Core", "../../../../../Language", "../../../../Notification", "./Abstract"], function (require, exports, tslib_1, Core, Language, UiNotification, Abstract_1) {
    "use strict";
    Core = (0, tslib_1.__importStar)(Core);
    Language = (0, tslib_1.__importStar)(Language);
    UiNotification = (0, tslib_1.__importStar)(UiNotification);
    Abstract_1 = (0, tslib_1.__importDefault)(Abstract_1);
    class UiUserProfileMenuItemFollow extends Abstract_1.default {
        constructor(userId, isActive) {
            super(userId, isActive);
        }
        _getLabel() {
            return Language.get("wcf.user.button." + (this._isActive ? "un" : "") + "follow");
        }
        _getAjaxActionName() {
            return this._isActive ? "unfollow" : "follow";
        }
        _ajaxSuccess(data) {
            this._isActive = !!data.returnValues.following;
            this._updateButton();
            UiNotification.show();
        }
        _ajaxSetup() {
            return {
                data: {
                    className: "wcf\\data\\user\\follow\\UserFollowAction",
                },
            };
        }
    }
    Core.enableLegacyInheritance(UiUserProfileMenuItemFollow);
    return UiUserProfileMenuItemFollow;
});
