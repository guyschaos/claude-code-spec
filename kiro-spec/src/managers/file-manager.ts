import * as vscode from 'vscode';
import { FileDetector } from '@/utils/file-detector';
import { FileCopier } from '@/utils/file-copier';
import { NotificationManager } from '@/utils/notifications';
import { InstallationStatus, StatusResult, SupportedLanguage } from '@/types';

/**
 * 文件管理器 - 统筹文件操作
 */
export class FileManager {
  private fileCopier: FileCopier;

  constructor(context: vscode.ExtensionContext) {
    this.fileCopier = new FileCopier(context);
  }

  /**
   * 检测安装状态
   */
  async detectInstallation(): Promise<InstallationStatus> {
    try {
      return await FileDetector.detectInstallation();
    } catch (error) {
      NotificationManager.showError(`检测安装状态失败: ${error}`);
      throw error;
    }
  }

  /**
   * 执行完整安装
   */
  async installComplete(language: SupportedLanguage, forceOverwrite: boolean = false): Promise<void> {
    const workspaceRoot = FileDetector.getWorkspaceRoot();
    if (!workspaceRoot) {
      throw new Error('未打开工作区');
    }

    try {
      await this.fileCopier.installAll(workspaceRoot, language, forceOverwrite);
      NotificationManager.showInstallationSuccess(this.getLanguageLabel(language));
    } catch (error) {
      NotificationManager.showError(`安装失败: ${error}`);
      throw error;
    }
  }

  /**
   * 检查状态并返回详细信息
   */
  async checkStatus(): Promise<StatusResult> {
    try {
      const status = await this.detectInstallation();
      const workspaceRoot = FileDetector.getWorkspaceRoot();
      
      if (!workspaceRoot) {
        return {
          isInstalled: false,
          missingFiles: ['工作区'],
          recommendations: ['请先打开一个项目文件夹']
        };
      }

      const missingFiles: string[] = [];
      const recommendations: string[] = [];

      // 检查基本文件
      if (!status.claudeCommands) {
        missingFiles.push('.claude/commands');
      }
      if (!status.claudeConfig) {
        missingFiles.push('CLAUDE.md');
      }

      // 检查命令文件完整性
      if (status.claudeCommands) {
        const missingCommandFiles = await FileDetector.validateCommandFiles(workspaceRoot);
        missingFiles.push(...missingCommandFiles);
      }

      // 生成建议
      if (missingFiles.length > 0) {
        recommendations.push('建议重新运行"Kiro Spec: 初始化项目"命令');
        if (status.claudeCommands || status.claudeConfig) {
          recommendations.push('或使用"Kiro Spec: 强制重新安装"覆盖现有文件');
        }
      }

      const result: StatusResult = {
        isInstalled: missingFiles.length === 0,
        missingFiles,
        currentLanguage: status.language,
        recommendations
      };

      // 显示状态通知
      NotificationManager.showStatusResult(
        result.isInstalled, 
        status.language ? this.getLanguageLabel(status.language) : undefined,
        result.missingFiles
      );

      return result;
    } catch (error) {
      NotificationManager.showError(`状态检查失败: ${error}`);
      throw error;
    }
  }

  /**
   * 强制重新安装
   */
  async forceReinstall(): Promise<void> {
    // 显示确认对话框
    const confirmed = await NotificationManager.showReinstallConfirmation();
    if (!confirmed) {
      return;
    }

    // 选择语言
    const language = await NotificationManager.showLanguageSelection();
    if (!language) {
      return;
    }

    // 执行强制安装
    await this.installComplete(language as SupportedLanguage, true);
  }

  /**
   * 获取语言标签
   */
  private getLanguageLabel(language: SupportedLanguage): string {
    const labels = {
      'zh-CN': '简体中文',
      'en': 'English', 
      'ja': '日本語',
      'zh-TW': '繁體中文'
    };
    return labels[language];
  }
}