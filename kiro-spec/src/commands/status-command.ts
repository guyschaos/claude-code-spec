import * as vscode from 'vscode';
import { FileManager } from '../managers/file-manager';
import { NotificationManager } from '../utils/notifications';

/**
 * 检查安装状态命令
 */
export class StatusCommand {
  private fileManager: FileManager;

  constructor(context: vscode.ExtensionContext) {
    this.fileManager = new FileManager(context);
  }

  /**
   * 执行状态检查命令
   */
  async execute(): Promise<void> {
    try {
      // 检查工作区
      if (!vscode.workspace.workspaceFolders) {
        NotificationManager.showError('请先打开一个项目文件夹');
        return;
      }

      // 执行状态检查
      await this.fileManager.checkStatus();

    } catch (error) {
      console.error('状态检查失败:', error);
      NotificationManager.showError(`状态检查失败: ${error}`);
    }
  }

  /**
   * 注册命令
   */
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const command = new StatusCommand(context);
    return vscode.commands.registerCommand('kiro-spec.checkStatus', () => command.execute());
  }
}