/**
 * Periodically stores the editor contents to the local storage. Opening the
 * same view again offers to restore the stored contents.
 *
 * @author Alexander Ebert
 * @copyright 2001-2023 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 6.0
 */

import { getStoragePrefix } from "../../Core";
import { getPhrase } from "../../Language";
import { escapeHTML } from "../../StringUtil";

import type { ClassicEditor, EditorConfig } from "./Types";
import { dispatchToCkeditor, listenToCkeditor } from "./Event";

type Payload = {
  html: string;
  timestamp: number;
};

function getLocalStorageKey(identifier: string): string {
  return `${getStoragePrefix()}ckeditor5-${identifier}`;
}

function getRestoreDialog(): HTMLElement {
  const dialog = document.createElement("div");
  dialog.classList.add("ckeditor5__restoreDraft__dialog");
  dialog.setAttribute("role", "alertdialog");
  dialog.tabIndex = 0;

  dialog.innerHTML = `
    <div class="ckeditor5__restoreDraft__question">
      ${escapeHTML(getPhrase("wcf.editor.restoreDraft"))}
    </div>
    <div class="ckeditor5__restoreDraft__buttons">
      <button type="button" class="button buttonPrimary small" data-type="submit">
        ${escapeHTML(getPhrase("wcf.dialog.button.primary.restore"))}
      </button>
      <button type="button" class="button small" data-type="cancel">
        ${escapeHTML(getPhrase("wcf.dialog.button.cancel"))}
      </button>
    </div>
  `;

  return dialog;
}

export function deleteDraft(identifier: string): void {
  try {
    window.localStorage.removeItem(getLocalStorageKey(identifier));
  } catch {
    // We cannot do anything meaningful if this fails.
  }
}

function saveDraft(identifier: string, html: string): void {
  if (html === "") {
    deleteDraft(identifier);

    return;
  }

  const payload: Payload = {
    html,
    timestamp: Date.now(),
  };

  try {
    window.localStorage.setItem(getLocalStorageKey(identifier), JSON.stringify(payload));
  } catch (e) {
    console.warn("Unable to write to the local storage.", e);
  }
}

export function setupRestoreDraft(editor: ClassicEditor, identifier: string): void {
  let value: Payload | undefined = undefined;

  try {
    const payload = window.localStorage.getItem(getLocalStorageKey(identifier));
    if (payload !== null) {
      value = JSON.parse(payload);
    }
  } catch {
    deleteDraft(identifier);

    return;
  }

  if (value === undefined) {
    return;
  }

  // Check if the stored value is outdated.
  const lastEditTime = parseInt(editor.sourceElement!.dataset.autosaveLastEditTime!) || 0;
  if (lastEditTime && lastEditTime * 1_000 >= value.timestamp) {
    return;
  }

  const originalValue = editor.data.get();

  // Check if the stored value is identical to the current value.
  if (originalValue === value.html) {
    return;
  }

  editor.data.set(value.html);

  const wrapper = document.createElement("div");
  wrapper.classList.add("ckeditor5__restoreDraft");

  const dialog = getRestoreDialog();

  const dialogWrapper = document.createElement("div");
  dialogWrapper.classList.add("ckeditor5_restoreDraft__wrapper");
  dialogWrapper.append(dialog);

  editor.ui.element!.insertAdjacentElement("beforebegin", wrapper);
  wrapper.append(editor.ui.element!, dialogWrapper);

  const callbackIsFocused = (_evt: unknown, _name: unknown, value: boolean) => {
    if (value) {
      dialog.focus();
    }
  };
  editor.ui.focusTracker.on("change:isFocused", callbackIsFocused);

  const revertEditor = () => {
    editor.ui.focusTracker.off("change:isFocused", callbackIsFocused);

    wrapper.insertAdjacentElement("beforebegin", editor.ui.element!);
    wrapper.remove();

    editor.editing.view.focus();
  };

  dialog.querySelector('button[data-type="submit"]')!.addEventListener("click", () => {
    revertEditor();
  });

  dialog.querySelector('button[data-type="cancel"]')!.addEventListener("click", () => {
    editor.data.set(originalValue);
    deleteDraft(identifier);

    if (originalValue === "") {
      dispatchToCkeditor(editor.sourceElement!).discardRecoveredData();
    }

    revertEditor();
  });
}

function removeExpiredDrafts(): void {
  const oneWeekAgo = Date.now() - 7 * 86_400;

  Object.keys(localStorage)
    .filter((key) => key.startsWith(`ckeditor5-`))
    .forEach((key) => {
      let value: string | null;

      try {
        value = window.localStorage.getItem(key);
      } catch {
        // Nothing we can do, forget it.
        return;
      }

      if (value === null) {
        // The value is no longer available.
        return;
      }

      let payload: Payload | undefined = undefined;
      try {
        payload = JSON.parse(value);
      } catch {
        // `payload` remains set to `undefined`.
      }

      if (payload === undefined || payload.timestamp < oneWeekAgo) {
        try {
          localStorage.removeItem(key);
        } catch {
          // Nothing we can do, forget it.
        }
      }
    });
}

export function initializeAutosave(element: HTMLElement, configuration: EditorConfig, identifier: string): void {
  removeExpiredDrafts();

  configuration.autosave = {
    save(editor) {
      saveDraft(identifier, editor.data.get());

      return Promise.resolve();
    },
    waitingTime: 15_000,
  };

  listenToCkeditor(element).reset(() => deleteDraft(identifier));
}
