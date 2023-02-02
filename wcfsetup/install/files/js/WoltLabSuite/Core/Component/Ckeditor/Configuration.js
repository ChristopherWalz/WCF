define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createConfiguration = void 0;
    function createConfiguration(features) {
        const toolbar = [
            "heading",
            "|",
            "bold",
            "italic",
            {
                label: "woltlabToolbarGroup_format",
                items: ["underline", "strikethrough", "subscript", "superscript", "code"],
            },
            "|",
            {
                label: "woltlabToolbarGroup_list",
                items: ["bulletedList", "numberedList"],
            },
            "alignment",
        ];
        if (features.url) {
            toolbar.push("link");
        }
        if (features.image) {
            ("insertImage");
        }
        const blocks = ["insertTable", "blockQuote", "codeBlock"];
        if (features.spoiler) {
            blocks.push("spoiler");
        }
        if (features.html) {
            blocks.push("htmlEmbed");
        }
        if (features.media) {
            blocks.push("woltlabBbcode_media");
        }
        toolbar.push({
            label: "TODO: Insert block",
            icon: "plus",
            items: blocks,
        });
        const woltlabToolbarGroup = {
            format: {
                icon: "ellipsis;false",
                label: "TODO: Format text",
            },
            list: {
                icon: "list;false",
                label: "TODO: Insert list",
            },
        };
        // TODO: The typings are both outdated and incomplete.
        const config = {
            toolbar,
            woltlabToolbarGroup,
        };
        return config;
    }
    exports.createConfiguration = createConfiguration;
});
