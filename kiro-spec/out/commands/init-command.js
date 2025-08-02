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
exports.InitCommand = void 0;
const vscode = __importStar(require("vscode"));
const file_manager_1 = require("@/managers/file-manager");
const notifications_1 = require("@/utils/notifications");
/**
 * 初始化项目命令
 */
class InitCommand {
    constructor(context) {
        this.fileManager = new file_manager_1.FileManager(context);
    }
    /**
     * 执行初始化项目命令
     */
    async execute() {
        try {
            // 检查工作区
            if (!vscode.workspace.workspaceFolders) {
                notifications_1.NotificationManager.showError('请先打开一个项目文件夹');
                return;
            }
            // 检查当前安装状态
            const status = await this.fileManager.detectInstallation();
            // 如果已经安装，询问用户是否继续
            if (status.claudeCommands || status.claudeConfig) {
                const action = await notifications_1.NotificationManager.showActionMessage('检测到项目已部分或完全安装Kiro规格驱动开发环境', '继续安装', '强制重新安装', '取消');
                switch (action) {
                    case '强制重新安装':
                        await this.fileManager.forceReinstall();
                        return;
                    case '取消':
                        return;
                    case '继续安装':
                        // 继续执行
                        break;
                    default:
                        return;
                }
            }
            // 选择语言
            const language = await notifications_1.NotificationManager.showLanguageSelection();
            if (!language) {
                notifications_1.NotificationManager.showWarning('未选择语言，安装已取消');
                return;
            }
            // 执行安装
            await this.fileManager.installComplete(language, false);
        }
        catch (error) {
            console.error('初始化项目失败:', error);
            notifications_1.NotificationManager.showError(`初始化项目失败: ${error}`);
        }
    }
    /**
     * 注册命令
     */
    static register(context) {
        const command = new InitCommand(context);
        return vscode.commands.registerCommand('kiro-spec.initProject', () => command.execute());
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=init-command.js.map