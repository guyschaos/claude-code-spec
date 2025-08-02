import * as vscode from 'vscode';
import { FileManager } from '@/managers/file-manager';
import { NotificationManager } from '@/utils/notifications';

/**
 * 强制重新安装命令
 */
export class ForceReinstallCommand {
  private fileManager: FileManager;

  constructor(context: vscode.ExtensionContext) {
    this.fileManager = new FileManager(context);
  }

  /**
   * 执行强制重新安装命令
   */
  async execute(): Promise<void> {
    try {
      // 检查工作区
      if (!vscode.workspace.workspaceFolders) {
        NotificationManager.showError('请先打开一个项目文件夹');
        return;
      }

      // 执行强制重新安装
      await this.fileManager.forceReinstall();

    } catch (error) {
      console.error('强制重新安装失败:', error);
      NotificationManager.showError(`强制重新安装失败: ${error}`);
    }
  }

  /**
   * 注册命令
   */
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const command = new ForceReinstallCommand(context);
    return vscode.commands.registerCommand('kiro-spec.forceReinstall', () => command.execute());
  }
}