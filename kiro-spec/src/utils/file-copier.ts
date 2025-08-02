import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { SupportedLanguage, ExtensionError, ErrorType } from '@/types';

/**
 * 文件复制器 - 负责复制模板文件到目标项目
 */
export class FileCopier {
  private extensionPath: string;

  constructor(context: vscode.ExtensionContext) {
    this.extensionPath = context.extensionPath;
  }

  /**
   * 复制Claude Commands目录
   */
  async copyClaudeCommands(workspaceRoot: string, forceOverwrite: boolean = false): Promise<void> {
    const sourcePath = path.join(this.extensionPath, 'templates', 'claude-commands');
    const targetPath = path.join(workspaceRoot, '.claude', 'commands');

    try {
      // 确保源目录存在
      if (!(await fs.pathExists(sourcePath))) {
        throw this.createError(ErrorType.TEMPLATE_NOT_FOUND, '模板文件不存在');
      }

      // 如果目标存在且不强制覆盖，则跳过
      if (!forceOverwrite && (await fs.pathExists(targetPath))) {
        return;
      }

      // 确保目标目录存在
      await fs.ensureDir(path.dirname(targetPath));

      // 复制目录
      await fs.copy(sourcePath, targetPath, {
        overwrite: forceOverwrite,
        errorOnExist: !forceOverwrite,
        filter: (src: string) => !path.basename(src).startsWith('.')
      });

    } catch (error) {
      throw this.createError(ErrorType.COPY_FAILED, `复制Claude Commands失败: ${error}`);
    }
  }

  /**
   * 复制CLAUDE配置文件
   */
  async copyClaudeConfig(
    workspaceRoot: string, 
    language: SupportedLanguage, 
    forceOverwrite: boolean = false
  ): Promise<void> {
    const sourceFileName = `CLAUDE_${language}.md`;
    const sourcePath = path.join(this.extensionPath, 'templates', 'claude-configs', sourceFileName);
    const targetPath = path.join(workspaceRoot, 'CLAUDE.md');

    try {
      // 确保源文件存在
      if (!(await fs.pathExists(sourcePath))) {
        throw this.createError(
          ErrorType.TEMPLATE_NOT_FOUND, 
          `语言模板文件不存在: ${sourceFileName}`
        );
      }

      // 如果目标存在且不强制覆盖，则跳过
      if (!forceOverwrite && (await fs.pathExists(targetPath))) {
        return;
      }

      // 复制配置文件
      await fs.copy(sourcePath, targetPath, {
        overwrite: forceOverwrite,
        errorOnExist: !forceOverwrite
      });

    } catch (error) {
      throw this.createError(ErrorType.COPY_FAILED, `复制CLAUDE配置失败: ${error}`);
    }
  }

  /**
   * 批量安装所有必要文件
   */
  async installAll(
    workspaceRoot: string, 
    language: SupportedLanguage, 
    forceOverwrite: boolean = false
  ): Promise<void> {
    try {
      // 复制Claude Commands目录
      await this.copyClaudeCommands(workspaceRoot, forceOverwrite);
      
      // 复制CLAUDE配置文件
      await this.copyClaudeConfig(workspaceRoot, language, forceOverwrite);
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('TEMPLATE_NOT_FOUND')) {
        throw error;
      }
      throw this.createError(ErrorType.COPY_FAILED, `安装失败: ${error}`);
    }
  }

  /**
   * 清理已安装的文件
   */
  async cleanup(workspaceRoot: string): Promise<void> {
    const claudeCommandsPath = path.join(workspaceRoot, '.claude', 'commands');
    const claudeConfigPath = path.join(workspaceRoot, 'CLAUDE.md');

    try {
      // 删除Commands目录
      if (await fs.pathExists(claudeCommandsPath)) {
        await fs.remove(claudeCommandsPath);
      }

      // 删除配置文件
      if (await fs.pathExists(claudeConfigPath)) {
        await fs.remove(claudeConfigPath);
      }

    } catch (error) {
      throw this.createError(ErrorType.COPY_FAILED, `清理失败: ${error}`);
    }
  }

  /**
   * 创建扩展错误对象
   */
  private createError(type: ErrorType, message: string, details?: unknown): ExtensionError {
    return {
      type,
      message,
      details,
      recovery: this.getRecoveryAdvice(type)
    };
  }

  /**
   * 获取错误恢复建议
   */
  private getRecoveryAdvice(errorType: ErrorType): string {
    switch (errorType) {
      case ErrorType.WORKSPACE_NOT_FOUND:
        return '请先打开一个项目文件夹';
      case ErrorType.FILE_PERMISSION_DENIED:
        return '请检查文件权限或以管理员身份运行VS Code';
      case ErrorType.TEMPLATE_NOT_FOUND:
        return '请重新安装扩展或联系开发者';
      case ErrorType.COPY_FAILED:
        return '请检查磁盘空间和文件权限，然后重试';
      default:
        return '请重试操作或联系技术支持';
    }
  }
}