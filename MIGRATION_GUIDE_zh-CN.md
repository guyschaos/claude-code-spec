# 语言迁移指南 - 简体中文默认语言更新

## 📋 迁移概述

从 **Ver 0.3.0** 开始，Claude Code 规格驱动开发项目将 **简体中文** 设为新的默认语言，替代原来的日语默认设置。

## 🎯 变更内容

### 主要变更
- **默认语言**: 日语 → **简体中文**
- **默认文档**: `README.md` 和 `CLAUDE.md` 现在使用简体中文
- **命令默认设置**: `/kiro:spec-init` 生成的文档默认为简体中文
- **新的文件结构**: 增加了完整的简体中文文档支持

### 新的语言优先级
1. 🇨🇳 **简体中文** (默认)
2. 🇯🇵 日语
3. 🇺🇸 英语  
4. 🇹🇼 繁体中文

## 📁 新的文件结构

```
你的项目/
├── README.md              # 🆕 简体中文版本（新默认）
├── README_zh-CN.md        # 🆕 简体中文副本
├── README_ja.md           # 📦 日语版本（原 README.md）
├── README_en.md           # 英语版本
├── README_zh-TW.md        # 繁体中文版本
├── CLAUDE.md              # 🆕 简体中文版本（新默认）
├── CLAUDE_zh-CN.md        # 🆕 简体中文副本
├── CLAUDE_ja.md           # 📦 日语版本（原 CLAUDE.md）
├── CLAUDE_en.md           # 英语版本
├── CLAUDE_zh-TW.md        # 繁体中文版本
└── CHANGELOG_zh-CN.md     # 🆕 简体中文更新日志
```

## 🔄 迁移选项

### 选项1: 继续使用日语（推荐给现有日语用户）

如果你想继续使用日语作为项目的主要语言：

1. **恢复日语作为默认语言**：
   ```bash
   # 备份当前的简体中文版本
   cp CLAUDE.md CLAUDE_zh-CN_backup.md
   cp README.md README_zh-CN_backup.md
   
   # 使用日语版本替换默认文件
   cp CLAUDE_ja.md CLAUDE.md
   cp README_ja.md README.md
   ```

2. **修改 spec-init 默认语言设置**：
   编辑 `.claude/commands/kiro/spec-init.md` 第54行：
   ```diff
   - "language": "simplified chinese",
   + "language": "japanese",
   ```

### 选项2: 切换到简体中文（无需操作）

如果你希望使用简体中文作为新的默认语言，无需任何操作。项目已自动配置为简体中文。

### 选项3: 混合使用

你可以根据需要在不同场景使用不同语言：

- **项目文档**: 使用 `README_ja.md`、`README_en.md` 等具体语言版本
- **Claude 配置**: 复制 `CLAUDE_ja.md` 或 `CLAUDE_en.md` 到 `CLAUDE.md`
- **命令输出**: 通过修改 `spec-init.md` 中的语言设置控制

## ⚠️ 注意事项

### 现有项目的影响

1. **已存在的规格**: 现有的 `.kiro/specs/` 目录中的文档不会自动更新语言
2. **命令行为**: 新创建的规格将默认使用简体中文
3. **向后兼容**: 所有现有功能保持不变，仅默认语言发生变化

### 团队协作考虑

如果你的团队包含不同语言偏好的成员：

1. **统一决定**: 团队应共同决定使用哪种语言作为默认
2. **文档同步**: 更新 `CLAUDE.md` 后，确保所有团队成员同步更改
3. **清晰沟通**: 在项目文档中明确说明选择的语言和原因

## 🛠️ 故障排除

### 命令生成错误语言的文档

**问题**: `/kiro:spec-init` 生成了中文文档，但我想要日文
**解决**: 检查 `.claude/commands/kiro/spec-init.md` 第54行的语言设置

### 导航链接错误

**问题**: README 中的语言导航链接指向错误的文件
**解决**: 检查各语言版本 README 顶部的链接是否正确

### 混合语言问题

**问题**: 项目中出现多种语言混合的情况
**解决**: 
1. 确定团队首选语言
2. 统一更新 `CLAUDE.md` 和 `README.md`
3. 更新 `spec-init.md` 中的语言设置

## 📞 获取帮助

如果在迁移过程中遇到问题：

1. **检查文档**: 参考对应语言版本的 README 文件
2. **查看示例**: 参考 `docs/kiro/specs-example/` 目录中的示例
3. **重置项目**: 必要时可以重新复制 `.claude/commands/` 和相应的 `CLAUDE.md`

## 📝 迁移检查清单

- [ ] 决定项目使用的主要语言
- [ ] 更新 `CLAUDE.md` 为首选语言版本
- [ ] 更新 `README.md` 为首选语言版本  
- [ ] 修改 `.claude/commands/kiro/spec-init.md` 中的语言设置
- [ ] 通知团队成员关于语言变更
- [ ] 测试新规格创建功能
- [ ] 更新项目文档说明语言选择

---

**更新日期**: 2025年8月2日  
**版本**: Ver 0.3.0  
**适用于**: Claude Code 规格驱动开发项目