import * as vscode from 'vscode';
import { InitCommand } from '@/commands/init-command';
import { StatusCommand } from '@/commands/status-command';
import { ForceReinstallCommand } from '@/commands/force-reinstall-command';

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Kiro Spec 扩展已激活');

  try {
    // 注册所有命令
    const disposables = [
      InitCommand.register(context),
      StatusCommand.register(context),
      ForceReinstallCommand.register(context)
    ];

    // 将所有命令添加到上下文中，确保它们在扩展停用时能被正确释放
    disposables.forEach(disposable => {
      context.subscriptions.push(disposable);
    });

    console.log('Kiro Spec 所有命令已注册成功');

    // 显示欢迎信息（仅在首次安装或更新时）
    showWelcomeMessage(context);

  } catch (error) {
    console.error('Kiro Spec 扩展激活失败:', error);
    vscode.window.showErrorMessage(`Kiro Spec 扩展激活失败: ${error}`);
  }
}

/**
 * 扩展停用时调用
 */
export function deactivate() {
  console.log('Kiro Spec 扩展已停用');
}

/**
 * 显示欢迎信息
 */
async function showWelcomeMessage(context: vscode.ExtensionContext) {
  const extensionVersion = getExtensionVersion();
  const lastShownVersion = context.globalState.get<string>('lastWelcomeVersion');

  // 仅在版本更新或首次安装时显示
  if (lastShownVersion !== extensionVersion) {
    const action = await vscode.window.showInformationMessage(
      `🎉 欢迎使用 Kiro Spec v${extensionVersion}！\n\n一键安装Claude Code规格驱动开发环境`,
      '立即开始',
      '稍后提醒',
      '不再显示'
    );

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
function getExtensionVersion(): string {
  const extension = vscode.extensions.getExtension('kiro-code.kiro-spec');
  return extension?.packageJSON?.version || '1.0.0';
}