import { Media, MediaInsertType } from "../../../Media/Data";
import MediaManagerEditor from "../../../Media/Manager/Editor";

class AcpUiCodeMirrorMedia {
  protected readonly element: HTMLElement;

  constructor(elementId: string) {
    this.element = document.getElementById(elementId) as HTMLElement;

    const button = document.getElementById(`codemirror-${elementId}-media`)!;
    button.classList.add(button.id);

    new MediaManagerEditor({
      buttonClass: button.id,
      callbackInsert: (media, insertType, thumbnailSize) => this.insert(media, insertType, thumbnailSize),
    });
  }

  protected insert(mediaList: Map<number, Media>, insertType: MediaInsertType, thumbnailSize?: string): void {
    switch (insertType) {
      case MediaInsertType.Separate: {
        let sizeArgument = "";
        if (thumbnailSize) {
          sizeArgument = ` size="${thumbnailSize}"`;
        }

        const content = Array.from(mediaList.values())
          .map((item) => `{{ media="${item.mediaID}"${sizeArgument} }}`)
          .join("");

        (this.element as any).codemirror.replaceSelection(content);
      }
    }
  }
}

export = AcpUiCodeMirrorMedia;
