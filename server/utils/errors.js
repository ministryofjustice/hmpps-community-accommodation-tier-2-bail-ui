"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskListAPIError = exports.UnknownPageError = exports.SessionDataError = exports.ValidationError = void 0;
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(data) {
        var _this = _super.call(this, 'Validation error') || this;
        _this.data = data;
        return _this;
    }
    return ValidationError;
}(Error));
exports.ValidationError = ValidationError;
var SessionDataError = /** @class */ (function (_super) {
    __extends(SessionDataError, _super);
    function SessionDataError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SessionDataError;
}(Error));
exports.SessionDataError = SessionDataError;
var UnknownPageError = /** @class */ (function (_super) {
    __extends(UnknownPageError, _super);
    function UnknownPageError(pageName) {
        return _super.call(this, "Cannot find the page ".concat(pageName)) || this;
    }
    return UnknownPageError;
}(Error));
exports.UnknownPageError = UnknownPageError;
var TaskListAPIError = /** @class */ (function (_super) {
    __extends(TaskListAPIError, _super);
    function TaskListAPIError(message, field) {
        var _this = _super.call(this, message) || this;
        _this.field = field;
        return _this;
    }
    return TaskListAPIError;
}(Error));
exports.TaskListAPIError = TaskListAPIError;
