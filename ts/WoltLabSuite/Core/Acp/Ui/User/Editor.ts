/**
 * User editing capabilities for the user list.
 *
 * @author  Alexander Ebert
 * @copyright  2001-2019 WoltLab GmbH
 * @license  GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since       3.1
 */

import AcpUserContentRemoveHandler from "./Content/Remove/Handler";
import * as Core from "../../../Core";
import * as EventHandler from "../../../Event/Handler";
import * as Language from "../../../Language";
import UiDropdownSimple from "../../../Ui/Dropdown/Simple";
import DomUtil from "../../../Dom/Util";
import SendNewPasswordAction from "./Action/SendNewPasswordAction";
import ToggleConfirmEmailAction from "./Action/ToggleConfirmEmailAction";
import DisableAction from "./Action/DisableAction";
import BanAction from "./Action/BanAction";
import DeleteAction from "./Action/DeleteAction";

interface RefreshUsersData {
  userIds: number[];
}

class AcpUiUserEditor {
  /**
   * Initializes the edit dropdown for each user.
   */
  constructor() {
    document.querySelectorAll(".jsUserRow").forEach((userRow: HTMLTableRowElement) => this.initUser(userRow));

    EventHandler.add("com.woltlab.wcf.acp.user", "refresh", (data: RefreshUsersData) => this.refreshUsers(data));
  }

  /**
   * Initializes the edit dropdown for a user.
   */
  private initUser(userRow: HTMLTableRowElement): void {
    const userId = ~~userRow.dataset.objectId!;
    const dropdownId = `userListDropdown${userId}`;
    const dropdownMenu = UiDropdownSimple.getDropdownMenu(dropdownId)!;
    const legacyButtonContainer = userRow.querySelector(".jsLegacyButtons") as HTMLElement;

    if (dropdownMenu.childElementCount === 0 && legacyButtonContainer.childElementCount === 0) {
      const toggleButton = userRow.querySelector(".dropdownToggle") as HTMLAnchorElement;
      toggleButton.classList.add("disabled");

      return;
    }

    UiDropdownSimple.registerCallback(dropdownId, (identifier, action) => {
      if (action === "open") {
        this.rebuild(dropdownMenu, legacyButtonContainer);
      }
    });

    const editLink = dropdownMenu.querySelector(".jsEditLink") as HTMLAnchorElement;
    if (editLink !== null) {
      const toggleButton = userRow.querySelector(".dropdownToggle") as HTMLAnchorElement;
      toggleButton.addEventListener("dblclick", (event) => {
        event.preventDefault();

        editLink.click();
      });
    }

    const deleteContent = dropdownMenu.querySelector(".jsDeleteContent");
    if (deleteContent !== null) {
      new AcpUserContentRemoveHandler(deleteContent as HTMLAnchorElement, userId);
    }

    const sendNewPassword = dropdownMenu.querySelector(".jsSendNewPassword");
    if (sendNewPassword !== null) {
      new SendNewPasswordAction(sendNewPassword as HTMLAnchorElement, userId, userRow);
    }

    const toggleConfirmEmail = dropdownMenu.querySelector(".jsConfirmEmailToggle");
    if (toggleConfirmEmail !== null) {
      new ToggleConfirmEmailAction(toggleConfirmEmail as HTMLAnchorElement, userId, userRow);
    }

    const enableUser = dropdownMenu.querySelector(".jsEnable");
    if (enableUser !== null) {
      new DisableAction(enableUser as HTMLAnchorElement, userId, userRow);
    }

    const banUser = dropdownMenu.querySelector(".jsBan");
    if (banUser !== null) {
      new BanAction(banUser as HTMLAnchorElement, userId, userRow);
    }

    const deleteUser = dropdownMenu.querySelector(".jsDelete");
    if (deleteUser !== null) {
      new DeleteAction(deleteUser as HTMLAnchorElement, userId, userRow);
    }
  }

  /**
   * Rebuilds the dropdown by adding wrapper links for legacy buttons,
   * that will eventually receive the click event.
   */
  private rebuild(dropdownMenu: HTMLElement, legacyButtonContainer: HTMLElement): void {
    dropdownMenu.querySelectorAll(".jsLegacyItem").forEach((element) => element.remove());

    // inject buttons
    const items: HTMLLIElement[] = [];
    Array.from(legacyButtonContainer.children).forEach((button: HTMLAnchorElement) => {
      const item = document.createElement("li");
      item.className = "jsLegacyItem";
      item.innerHTML = '<a href="#"></a>';

      const link = item.children[0] as HTMLAnchorElement;
      link.textContent = button.dataset.tooltip || button.title;
      link.addEventListener("click", (event) => {
        event.preventDefault();

        // forward click onto original button
        if (button.nodeName === "A") {
          button.click();
        } else {
          Core.triggerEvent(button, "click");
        }
      });

      items.push(item);
    });

    items.forEach((item) => {
      dropdownMenu.insertAdjacentElement("afterbegin", item);
    });

    // check if there are visible items before each divider
    const listItems = Array.from(dropdownMenu.children) as HTMLElement[];
    listItems.forEach((element) => DomUtil.show(element));

    let hasItem = false;
    listItems.forEach((item) => {
      if (item.classList.contains("dropdownDivider")) {
        if (!hasItem) {
          DomUtil.hide(item);
        }
      } else {
        hasItem = true;
      }
    });
  }

  private refreshUsers(data: RefreshUsersData): void {
    document.querySelectorAll(".jsUserRow").forEach((userRow: HTMLTableRowElement) => {
      const userId = ~~userRow.dataset.objectId!;
      if (data.userIds.includes(userId)) {
        const userStatusIcons = userRow.querySelector(".userStatusIcons") as HTMLElement;

        const banned = Core.stringToBool(userRow.dataset.banned!);
        let iconBanned = userRow.querySelector(".jsUserStatusBanned") as HTMLElement;
        if (banned && iconBanned === null) {
          iconBanned = document.createElement("span");
          iconBanned.innerHTML = '<fa-icon name="lock"></fa-icon>';
          iconBanned.classList.add("jsUserStatusBanned", "jsTooltip");
          iconBanned.title = Language.get("wcf.user.status.banned");

          userStatusIcons.appendChild(iconBanned);
        } else if (!banned && iconBanned !== null) {
          iconBanned.remove();
        }

        const isDisabled = !Core.stringToBool(userRow.dataset.enabled!);
        let iconIsDisabled = userRow.querySelector(".jsUserStatusIsDisabled") as HTMLElement;
        if (isDisabled && iconIsDisabled === null) {
          iconIsDisabled = document.createElement("span");
          iconIsDisabled.innerHTML = '<fa-icon name="power-off"></fa-icon>';
          iconIsDisabled.classList.add("jsUserStatusIsDisabled", "jsTooltip");
          iconIsDisabled.title = Language.get("wcf.user.status.isDisabled");
          userStatusIcons.appendChild(iconIsDisabled);
        } else if (!isDisabled && iconIsDisabled !== null) {
          iconIsDisabled.remove();
        }
      }
    });
  }
}

export = AcpUiUserEditor;
