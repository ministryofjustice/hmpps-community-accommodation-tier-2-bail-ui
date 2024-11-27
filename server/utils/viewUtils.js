"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReferer = exports.formatLines = void 0;
var config_1 = require("../config");
var formUtils_1 = require("./formUtils");
var formatLines = function (text) {
    if (!text) {
        return '';
    }
    var normalizedText = normalizeText(text);
    var paragraphs = normalizedText.split('\n\n').map(function (paragraph) {
        return paragraph
            .split('\n')
            .map(function (line) { return (0, formUtils_1.escape)(line); })
            .join('<br />');
    });
    if (paragraphs.length === 1) {
        return paragraphs[0];
    }
    return "<p>".concat(paragraphs.join('</p><p>'), "</p>");
};
exports.formatLines = formatLines;
var validateReferer = function (referer) {
    if (!referer || !referer.startsWith(config_1.default.ingressUrl)) {
        return '/';
    }
    return referer;
};
exports.validateReferer = validateReferer;
function normalizeText(text) {
    var output = text.trim();
    output = output.replace(/(\r\n)/g, '\n');
    output = output.replace(/(\r)/g, '\n');
    output = output.replace(/(\n){2,}/g, '\n\n');
    return output;
}
