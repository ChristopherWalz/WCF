/**
 * Handles worker execution for the RebuildDataPage.
 *
 * @author  Tim Duesterhus
 * @copyright  2001-2021 WoltLab GmbH
 * @license  GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 */

import Worker from "../Worker";
import * as Language from "../../../Language";

const workers = new Map<HTMLElement, number>();

export function register(button: HTMLElement): void {
  if (!button.dataset.className) {
    throw new Error(`Missing 'data-class-name' attribute.`);
  }

  workers.set(button, parseInt(button.dataset.nicevalue!, 10));

  button.addEventListener("click", function (event) {
    event.preventDefault();

    void runWorker(button);
  });
}

export async function runAllWorkers(): Promise<void> {
  const sorted = Array.from(workers)
    .sort(([, a], [, b]) => {
      return a - b;
    })
    .map(([el]) => el);

  let i = 1;
  for (const worker of sorted) {
    await runWorker(worker, `${worker.textContent!} (${i++} / ${sorted.length})`, true);
  }
}

async function runWorker(
  button: HTMLElement,
  dialogTitle: string = button.textContent!,
  implicitContinue = false,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    new Worker({
      dialogId: "cache",
      dialogTitle,
      className: button.dataset.className,
      implicitContinue,
      callbackAbort() {
        reject();
      },
      callbackSuccess() {
        let span = button.nextElementSibling;
        if (span && span.nodeName === "SPAN") {
          span.remove();
        }

        span = document.createElement("span");
        span.innerHTML = `<fa-icon name="check" solid></fa-icon> ${Language.get("wcf.acp.worker.success")}`;
        button.parentNode!.insertBefore(span, button.nextElementSibling);
        resolve();
      },
    });
  });
}
