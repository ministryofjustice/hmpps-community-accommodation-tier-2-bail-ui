"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorSummary = exports.generateErrorMessages = exports.errorSummary = exports.errorMessage = exports.catchValidationErrorOrPropogate = exports.catchAPIErrorOrPropogate = exports.fetchErrorsAndUserInput = exports.firstFlashItem = void 0;
var jsonpath_1 = require("jsonpath");
var errors_json_1 = require("../i18n/en/errors.json");
var errors_1 = require("./errors");
var viewUtils_1 = require("./viewUtils");
var firstFlashItem = function (request, key) {
    var message = request.flash(key);
    return message ? message[0] : undefined;
};
exports.firstFlashItem = firstFlashItem;
var fetchErrorsAndUserInput = function (request) {
    var errors = (0, exports.firstFlashItem)(request, 'errors') || {};
    var errorSummary = request.flash('errorSummary') || [];
    var userInput = (0, exports.firstFlashItem)(request, 'userInput') || {};
    var errorTitle = (0, exports.firstFlashItem)(request, 'errorTitle');
    return { errors: errors, errorTitle: errorTitle, errorSummary: errorSummary, userInput: userInput };
};
exports.fetchErrorsAndUserInput = fetchErrorsAndUserInput;
var catchAPIErrorOrPropogate = function (request, response, error) {
    if (error instanceof errors_1.TaskListAPIError) {
        request.flash('errors', {
            crn: (0, exports.errorMessage)(error.field, error.message),
        });
        request.flash('errorSummary', [(0, exports.errorSummary)(error.field, error.message)]);
        response.redirect((0, viewUtils_1.validateReferer)(request.headers.referer));
    }
    else {
        throw error;
    }
};
exports.catchAPIErrorOrPropogate = catchAPIErrorOrPropogate;
var catchValidationErrorOrPropogate = function (request, response, error, redirectPath) {
    var errors = extractValidationErrors(error);
    if (typeof errors === 'string') {
        request.flash('errorSummary', { text: errors });
    }
    else {
        var errorMessages = (0, exports.generateErrorMessages)(errors);
        var errorSummary_1 = (0, exports.generateErrorSummary)(errors);
        request.flash('errors', errorMessages);
        request.flash('errorSummary', errorSummary_1);
    }
    request.flash('userInput', request.body);
    response.redirect(redirectPath);
};
exports.catchValidationErrorOrPropogate = catchValidationErrorOrPropogate;
var errorMessage = function (field, text) {
    var _a;
    return {
        text: text,
        attributes: (_a = {},
            _a["data-cy-error-".concat(field)] = true,
            _a),
    };
};
exports.errorMessage = errorMessage;
var errorSummary = function (field, text) {
    return {
        text: text,
        href: "#".concat(field),
    };
};
exports.errorSummary = errorSummary;
var generateErrorMessages = function (errors) {
    return Object.keys(errors).reduce(function (obj, key) {
        var _a;
        return __assign(__assign({}, obj), (_a = {}, _a[key] = (0, exports.errorMessage)(key, errors[key]), _a));
    }, {});
};
exports.generateErrorMessages = generateErrorMessages;
var errorText = function (error) {
    var errors = jsonpath_1.default.value(errors_json_1.default, error.propertyName) ||
        throwUndefinedError("Cannot find a translation for an error at the path ".concat(error.propertyName));
    var text = errors[error.errorType] ||
        throwUndefinedError("Cannot find a translation for an error at the path ".concat(error.propertyName, " with the type ").concat(error.errorType));
    return text;
};
var throwUndefinedError = function (message) {
    throw new Error(message);
};
var generateErrors = function (params) {
    return params.reduce(function (obj, error) {
        var _a;
        var key = error.propertyName.split('.').slice(1).join('_');
        return __assign(__assign({}, obj), (_a = {}, _a[key] = errorText(error), _a));
    }, {});
};
var extractValidationErrors = function (error) {
    if ('data' in error) {
        if (Array.isArray(error.data['invalid-params']) && error.data['invalid-params'].length) {
            return generateErrors(error.data['invalid-params']);
        }
        if (typeof error.data === 'object' && error.data !== null && 'detail' in error.data) {
            return error.data.detail;
        }
        if (error instanceof errors_1.ValidationError) {
            return error.data;
        }
    }
    throw error;
};
var generateErrorSummary = function (errors) {
    return Object.keys(errors).map(function (k) { return (0, exports.errorSummary)(k, errors[k]); });
};
exports.generateErrorSummary = generateErrorSummary;
