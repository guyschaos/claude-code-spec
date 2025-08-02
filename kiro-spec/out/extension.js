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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const init_command_1 = require("./commands/init-command");
const status_command_1 = require("./commands/status-command");
const force_reinstall_command_1 = require("./commands/force-reinstall-command");
/**
 * 扩展激活时调用
 */
function activate(context) {
    console.log('Kiro Spec 扩展已激活');
    try {
        // 注册所有命令
        const disposables = [
            init_command_1.InitCommand.register(context),
            status_command_1.StatusCommand.register(context),
            force_reinstall_command_1.ForceReinstallCommand.register(context)
        ];
        // 将所有命令添加到上下文中，确保它们在扩展停用时能被正确释放
        disposables.forEach(disposable => {
            context.subscriptions.push(disposable);
        });
        console.log('Kiro Spec 所有命令已注册成功');
        // 显示欢迎信息（仅在首次安装或更新时）
        showWelcomeMessage(context);
    }
    catch (error) {
        console.error('Kiro Spec 扩展激活失败:', error);
        vscode.window.showErrorMessage(`Kiro Spec 扩展激活失败: ${error}`);
    }
}
exports.activate = activate;
/**
 * 扩展停用时调用
 */
function deactivate() {
    console.log('Kiro Spec 扩展已停用');
}
exports.deactivate = deactivate;
/**
 * 显示欢迎信息
 */
async function showWelcomeMessage(context) {
    const extensionVersion = getExtensionVersion();
    const lastShownVersion = context.globalState.get('lastWelcomeVersion');
    // 仅在版本更新或首次安装时显示
    if (lastShownVersion !== extensionVersion) {
        const action = await vscode.window.showInformationMessage(`🎉 欢迎使用 Kiro Spec v${extensionVersion}！\n\n一键安装Claude Code规格驱动开发环境`, '立即开始', '稍后提醒', '不再显示');
        switch (action) {
            case '立即开始':
                // 执行初始化命令
                vscode.commands.executeCommand('kiro-spec.initProject');
                break;
            case '不再显示':
                // 记录版本，避免重复显示
                context.globalState.update('lastWelcomeVersion', extensionVersion);
                break;
            case '稍后提醒':
            default:
                // 不做任何操作，下次激活时会再次显示
                break;
        }
    }
}
/**
 * 获取扩展版本号
 */
function getExtensionVersion() {
    const extension = vscode.extensions.getExtension('kiro-code.kiro-spec');
    return extension?.packageJSON?.version || '1.0.0';
}
//# sourceMappingURL=extension.js.map