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
exports.FileDetector = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
/**
 * 文件检测器 - 负责检测项目安装状态
 */
class FileDetector {
    /**
     * 检测项目安装状态
     */
    static async detectInstallation() {
        const workspaceRoot = this.getWorkspaceRoot();
        if (!workspaceRoot) {
            throw new Error('未打开工作区');
        }
        const claudeCommandsPath = path.join(workspaceRoot, '.claude', 'commands');
        const claudeConfigPath = path.join(workspaceRoot, 'CLAUDE.md');
        const status = {
            claudeCommands: await fs.pathExists(claudeCommandsPath),
            claudeConfig: await fs.pathExists(claudeConfigPath)
        };
        // 如果配置文件存在，检测语言
        if (status.claudeConfig) {
            status.language = await this.detectConfigLanguage(claudeConfigPath);
        }
        return status;
    }
    /**
     * 检测配置文件语言
     */
    static async detectConfigLanguage(configPath) {
        try {
            const content = await fs.readFile(configPath, 'utf8');
            // 通过内容特征检测语言
            if (content.includes('简体中文') || content.includes('规格驱动开发')) {
                return 'zh-CN';
            }
            else if (content.includes('English') || content.includes('spec-driven development')) {
                return 'en';
            }
            else if (content.includes('日本語') || content.includes('仕様駆動開発')) {
                return 'ja';
            }
            else if (content.includes('繁體中文') || content.includes('規格驅動開發')) {
                return 'zh-TW';
            }
            return undefined;
        }
        catch (error) {
            console.error('检测配置文件语言失败:', error);
            return undefined;
        }
    }
    /**
     * 检查必要的Kiro命令文件是否存在
     */
    static async validateCommandFiles(workspaceRoot) {
        const missingFiles = [];
        const requiredFiles = [
            '.claude/commands/kiro/spec-init.md',
            '.claude/commands/kiro/spec-requirements.md',
            '.claude/commands/kiro/spec-design.md',
            '.claude/commands/kiro/spec-tasks.md',
            '.claude/commands/kiro/spec-status.md',
            '.claude/commands/kiro/steering.md',
            '.claude/commands/kiro/steering-custom.md'
        ];
        for (const file of requiredFiles) {
            const filePath = path.join(workspaceRoot, file);
            if (!(await fs.pathExists(filePath))) {
                missingFiles.push(file);
            }
        }
        return missingFiles;
    }
    /**
     * 获取工作区根目录
     */
    static getWorkspaceRoot() {
        return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    }
    /**
     * 检查目录是否为空
     */
    static async isDirectoryEmpty(dirPath) {
        try {
            const files = await fs.readdir(dirPath);
            return files.length === 0;
        }
        catch (error) {
            // 目录不存在视为空
            return true;
        }
    }
    /**
     * 检查文件是否可写
     */
    static async isFileWritable(filePath) {
        try {
            await fs.access(filePath, fs.constants.W_OK);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.FileDetector = FileDetector;
//# sourceMappingURL=file-detector.js.map