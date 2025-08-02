import * as vscode from 'vscode';
import { FileManager } from '../managers/file-manager';
import { NotificationManager } from '../utils/notifications';
import { SupportedLanguage } from '../types';

/**
 * 初始化项目命令
 */
export class InitCommand {
  private fileManager: FileManager;

  constructor(context: vscode.ExtensionContext) {
    this.fileManager = new FileManager(context);
  }

  /**
   * 执行初始化项目命令
   */
  async execute(): Promise<void> {
    try {
      // 检查工作区
      if (!vscode.workspace.workspaceFolders) {
        NotificationManager.showError('请先打开一个项目文件夹');
        return;
      }

      // 检查当前安装状态
      const status = await this.fileManager.detectInstallation();
      
      // 如果已经安装，询问用户是否继续
      if (status.claudeCommands || status.claudeConfig) {
        const action = await NotificationManager.showActionMessage(
          '检测到项目已部分或完全安装Kiro规格驱动开发环境',
          '继续安装',
          '强制重新安装',
          '取消'
        );

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
      const language = await NotificationManager.showLanguageSelection();
      if (!language) {
        NotificationManager.showWarning('未选择语言，安装已取消');
        return;
      }

      // 执行安装
      await this.fileManager.installComplete(language as SupportedLanguage, false);

    } catch (error) {
      console.error('初始化项目失败:', error);
      NotificationManager.showError(`初始化项目失败: ${error}`);
    }
  }

  /**
   * 注册命令
   */
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const command = new InitCommand(context);
    return vscode.commands.registerCommand('kiro-spec.initProject', () => command.execute());
  }
}