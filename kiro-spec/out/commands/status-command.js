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
exports.StatusCommand = void 0;
const vscode = __importStar(require("vscode"));
const file_manager_1 = require("../managers/file-manager");
const notifications_1 = require("../utils/notifications");
/**
 * 检查安装状态命令
 */
class StatusCommand {
    constructor(context) {
        this.fileManager = new file_manager_1.FileManager(context);
    }
    /**
     * 执行状态检查命令
     */
    async execute() {
        try {
            // 检查工作区
            if (!vscode.workspace.workspaceFolders) {
                notifications_1.NotificationManager.showError('请先打开一个项目文件夹');
                return;
            }
            // 执行状态检查
            await this.fileManager.checkStatus();
        }
        catch (error) {
            console.error('状态检查失败:', error);
            notifications_1.NotificationManager.showError(`状态检查失败: ${error}`);
        }
    }
    /**
     * 注册命令
     */
    static register(context) {
        const command = new StatusCommand(context);
        return vscode.commands.registerCommand('kiro-spec.checkStatus', () => command.execute());
    }
}
exports.StatusCommand = StatusCommand;
//# sourceMappingURL=status-command.js.map