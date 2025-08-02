import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { InstallationStatus, SupportedLanguage } from '../types';

/**
 * 文件检测器 - 负责检测项目安装状态
 */
export class FileDetector {
  /**
   * 检测项目安装状态
   */
  static async detectInstallation(): Promise<InstallationStatus> {
    const workspaceRoot = this.getWorkspaceRoot();
    if (!workspaceRoot) {
      throw new Error('未打开工作区');
    }

    const claudeCommandsPath = path.join(workspaceRoot, '.claude', 'commands');
    const claudeConfigPath = path.join(workspaceRoot, 'CLAUDE.md');

    const status: InstallationStatus = {
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
  static async detectConfigLanguage(configPath: string): Promise<SupportedLanguage | undefined> {
    try {
      const content = await fs.readFile(configPath, 'utf8');
      
      // 通过内容特征检测语言
      if (content.includes('简体中文') || content.includes('规格驱动开发')) {
        return 'zh-CN';
      } else if (content.includes('English') || content.includes('spec-driven development')) {
        return 'en';
      } else if (content.includes('日本語') || content.includes('仕様駆動開発')) {
        return 'ja';
      } else if (content.includes('繁體中文') || content.includes('規格驅動開發')) {
        return 'zh-TW';
      }
      
      return undefined;
    } catch (error) {
      console.error('检测配置文件语言失败:', error);
      return undefined;
    }
  }

  /**
   * 检查必要的Kiro命令文件是否存在
   */
  static async validateCommandFiles(workspaceRoot: string): Promise<string[]> {
    const missingFiles: string[] = [];
    
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
  static getWorkspaceRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  /**
   * 检查目录是否为空
   */
  static async isDirectoryEmpty(dirPath: string): Promise<boolean> {
    try {
      const files = await fs.readdir(dirPath);
      return files.length === 0;
    } catch (error) {
      // 目录不存在视为空
      return true;
    }
  }

  /**
   * 检查文件是否可写
   */
  static async isFileWritable(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, fs.constants.W_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
}