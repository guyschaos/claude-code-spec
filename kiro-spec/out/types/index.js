"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGUAGE_LABELS = exports.ErrorType = void 0;
// 错误类型
var ErrorType;
(function (ErrorType) {
    ErrorType["WORKSPACE_NOT_FOUND"] = "WORKSPACE_NOT_FOUND";
    ErrorType["FILE_PERMISSION_DENIED"] = "FILE_PERMISSION_DENIED";
    ErrorType["TEMPLATE_NOT_FOUND"] = "TEMPLATE_NOT_FOUND";
    ErrorType["COPY_FAILED"] = "COPY_FAILED";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
// 语言标签映射
exports.LANGUAGE_LABELS = {
    'zh-CN': '简体中文',
    'en': 'English',
    'ja': '日本語',
    'zh-TW': '繁體中文'
};
//# sourceMappingURL=index.js.map