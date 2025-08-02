"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManager = void 0;
const vscode = __importStar(require("vscode"));
/**
 * 通知工具类
 */
class NotificationManager {
    /**
     * 显示成功通知
     */
    static showSuccess(message) {
        vscode.window.showInformationMessage(`✅ ${message}`);
    }
    /**
     * 显示警告通知
     */
    static showWarning(message) {
        vscode.window.showWarningMessage(`⚠️ ${message}`);
    }
    /**
     * 显示错误通知
     */
    static showError(message) {
        vscode.window.showErrorMessage(`❌ ${message}`);
    }
    /**
     * 显示带操作按钮的通知
     */
    static async showActionMessage(message, ...actions) {
        return await vscode.window.showInformationMessage(message, ...actions);
    }
    /**
     * 显示安装成功通知
     */
    static showInstallationSuccess(language) {
        this.showSuccess(`Kiro规格驱动开发环境安装成功！\n语言：${language}\n现在可以开始使用 /kiro:* 命令了。`);
    }
    /**
     * 显示安装状态通知
     */
    static showStatusResult(isInstalled, language, missingFiles) {
        if (isInstalled) {
            this.showSuccess(`安装状态：正常\n语言：${language || '未知'}`);
        }
        else {
            const missing = missingFiles?.join(', ') || '未知文件';
            this.showWarning(`安装不完整\n缺失文件：${missing}\n建议重新运行初始化命令`);
        }
    }
    /**
     * 显示重新安装确认对话框
     */
    static async showReinstallConfirmation() {
        const result = await vscode.window.showWarningMessage('检测到项目已安装Kiro规格驱动开发环境，是否要强制重新安装？\n\n⚠️ 这将覆盖现有的配置文件', { modal: true }, '确认重新安装', '取消');
        return result === '确认重新安装';
    }
    /**
     * 显示语言选择对话框
     */
    static async showLanguageSelection() {
        const items = [
            { label: '简体中文', description: 'Simplified Chinese', detail: 'zh-CN' },
            { label: 'English', description: 'English', detail: 'en' },
            { label: '日本語', description: 'Japanese', detail: 'ja' },
            { label: '繁體中文', description: 'Traditional Chinese', detail: 'zh-TW' }
        ];
        const selected = await vscode.window.showQuickPick(items, {
            title: '选择语言 / Select Language',
            placeHolder: '请选择文档和配置文件的语言',
            ignoreFocusOut: true
        });
        return selected?.detail;
    }
}
exports.NotificationManager = NotificationManager;
//# sourceMappingURL=notifications.js.map