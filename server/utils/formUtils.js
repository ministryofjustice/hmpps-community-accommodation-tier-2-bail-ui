"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFieldValues = exports.escape = void 0;
exports.convertKeyValuePairToRadioItems = convertKeyValuePairToRadioItems;
exports.convertKeyValuePairToCheckboxItems = convertKeyValuePairToCheckboxItems;
var nunjucks = require("nunjucks");
var escape = function (text) {
    var escapeFilter = new nunjucks.Environment().getFilter('escape');
    return escapeFilter(text).val;
};
exports.escape = escape;
function convertKeyValuePairToRadioItems(object, checkedItem) {
    return Object.keys(object).map(function (key) {
        return {
            value: key,
            text: object[key],
            checked: checkedItem === key,
        };
    });
}
function convertKeyValuePairToCheckboxItems(object, checkedItems) {
    if (checkedItems === void 0) { checkedItems = []; }
    return Object.keys(object).map(function (key) {
        return {
            value: key,
            text: object[key],
            checked: checkedItems.includes(key),
        };
    });
}
var dateFieldValues = function (fieldName, context, errors) {
    if (errors === void 0) { errors = {}; }
    var errorClass = errors[fieldName] ? 'govuk-input--error' : '';
    return [
        {
            classes: "govuk-input--width-2 ".concat(errorClass),
            name: 'day',
            value: context["".concat(fieldName, "-day")],
        },
        {
            classes: "govuk-input--width-2 ".concat(errorClass),
            name: 'month',
            value: context["".concat(fieldName, "-month")],
        },
        {
            classes: "govuk-input--width-4 ".concat(errorClass),
            name: 'year',
            value: context["".concat(fieldName, "-year")],
        },
    ];
};
exports.dateFieldValues = dateFieldValues;
