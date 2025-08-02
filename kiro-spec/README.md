# Kiro Spec - 规格驱动开发自动化安装

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/kiro-code/kiro-spec)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/kiro-code/kiro-spec/blob/main/LICENSE)

为Claude Code规格驱动开发项目提供一键式自动化安装和配置功能的VS Code扩展。

## ✨ 核心功能

- 🚀 **一键安装** - 自动安装所有必需的`.claude/commands`目录和`CLAUDE.md`配置文件
- 🌐 **多语言支持** - 支持简体中文、英文、日文、繁体中文四种语言
- 🔄 **智能检测** - 自动检测项目安装状态，避免重复安装
- ⚡ **强制重装** - 提供强制重新安装选项，可覆盖现有配置
- 📊 **状态检查** - 随时查看项目的Kiro配置安装状态

## 🛠️ 安装方法

### 从GitHub Releases下载VSIX

1. **下载VSIX文件**:
   - 访问 [GitHub Releases页面](https://github.com/kiro-code/kiro-spec/releases)
   - 下载最新版本的 `kiro-spec-x.x.x.vsix` 文件

2. **安装扩展**:
   - 在VS Code中打开命令面板 (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - 输入 `Extensions: Install from VSIX...`
   - 选择下载的VSIX文件进行安装

3. **命令行安装** (可选):
   ```bash
   code --install-extension kiro-spec-x.x.x.vsix
   ```

### 自动化发布流程

本扩展使用GitHub Actions自动构建和发布：

- ✅ **自动触发** - 当创建新的git tag时（如 `v1.0.1`）自动构建
- ✅ **版本验证** - 自动验证git tag与package.json版本号一致性
- ✅ **质量检查** - 运行代码检查和TypeScript编译
- ✅ **VSIX构建** - 自动生成VSIX安装包
- ✅ **GitHub Release** - 自动创建Release并上传VSIX文件

### 开发者发布新版本

如果您是项目维护者，发布新版本的步骤：

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 创建并推送标签
git push origin main --tags

# 3. GitHub Actions会自动构建并发布
```

## 🚀 使用方法

### 基础操作

1. **打开项目**: 在VS Code中打开你要配置的项目目录
2. **打开命令面板**: 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
3. **选择Kiro命令**: 输入"Kiro Spec"查看所有可用命令

### 可用命令

#### `Kiro Spec: 初始化项目`
- **功能**: 自动安装Kiro规格驱动开发所需的所有文件
- **安装内容**:
  - `.claude/commands/kiro/` 目录及所有命令文件
  - 选择语言版本的 `CLAUDE.md` 配置文件
- **使用场景**: 首次在项目中设置Kiro规格驱动开发环境

#### `Kiro Spec: 检查安装状态`
- **功能**: 检查当前项目的Kiro配置安装状态
- **显示信息**:
  - CLAUDE.md文件状态
  - .claude/commands/kiro目录状态
  - 各个命令文件的完整性检查
- **使用场景**: 验证安装是否完整，排查配置问题

#### `Kiro Spec: 强制重新安装`
- **功能**: 强制覆盖现有配置，重新安装所有文件
- **警告**: 会覆盖现有的CLAUDE.md和命令文件
- **使用场景**: 修复损坏的配置或更新到最新版本

## 🌍 多语言支持

扩展支持以下语言版本：

- **🇨🇳 简体中文** (`zh-CN`) - 默认中文环境
- **🇺🇸 English** (`en`) - 英文环境  
- **🇯🇵 日本語** (`ja`) - 日文环境
- **🇹🇼 繁體中文** (`zh-TW`) - 繁体中文环境

在初始化项目时，扩展会提示选择语言，并安装相应语言版本的配置文件。

## 📁 安装的文件结构

初始化完成后，项目中会创建以下文件结构：

```
project/
├── CLAUDE.md                      # 主配置文件（选择的语言版本）
└── .claude/
    └── commands/
        └── kiro/
            ├── spec-init.md       # 规格初始化命令
            ├── spec-requirements.md # 需求生成命令
            ├── spec-design.md     # 设计生成命令
            ├── spec-tasks.md      # 任务生成命令
            ├── spec-status.md     # 状态查看命令
            ├── steering.md        # 指导文档管理命令
            └── steering-custom.md # 自定义指导文档命令
```

## 🔧 技术特性

- **构建时文件复制** - 模板文件在扩展构建时从源项目动态复制，避免数据重复
- **智能文件检测** - 使用文件哈希校验确保文件完整性
- **用户友好的通知** - 清晰的成功/错误/警告通知系统
- **TypeScript开发** - 完全使用TypeScript开发，提供更好的代码质量

## 🐛 问题反馈

如果遇到任何问题或有功能建议，请在以下位置反馈：

- **GitHub Issues**: [https://github.com/kiro-code/kiro-spec/issues](https://github.com/kiro-code/kiro-spec/issues)
- **邮件联系**: kiro-code@example.com

## 📄 许可证

本项目基于 MIT 许可证开源。查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢Claude Code项目为规格驱动开发提供的优秀框架和工具支持。

---

**享受更高效的规格驱动开发体验！** 🎉