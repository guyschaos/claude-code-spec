// 支持的语言类型
export type SupportedLanguage = 'zh-CN' | 'en' | 'ja' | 'zh-TW';

// 安装状态
export interface InstallationStatus {
  claudeCommands: boolean;
  claudeConfig: boolean;
  language?: SupportedLanguage;
}

// 状态检查结果
export interface StatusResult {
  isInstalled: boolean;
  missingFiles: string[];
  currentLanguage?: SupportedLanguage;
  recommendations: string[];
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 模板集合
export interface TemplateSet {
  commands: CommandTemplate[];
  configs: ConfigTemplate[];
}

// 命令模板
export interface CommandTemplate {
  name: string;
  path: string;
  content: string;
}

// 配置模板
export interface ConfigTemplate {
  language: SupportedLanguage;
  path: string;
  content: string;
}

// 错误类型
export enum ErrorType {
  WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
  FILE_PERMISSION_DENIED = 'FILE_PERMISSION_DENIED',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  COPY_FAILED = 'COPY_FAILED'
}

// 扩展错误
export interface ExtensionError {
  type: ErrorType;
  message: string;
  details?: any;
  recovery?: string;
}

// 语言标签映射
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  'zh-CN': '简体中文',
  'en': 'English',
  'ja': '日本語',
  'zh-TW': '繁體中文'
};