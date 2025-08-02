# GitHub Actions VSIX 发布流程测试指南

## 📋 测试准备

在测试自动化发布流程之前，请确保：

1. ✅ GitHub Actions workflow文件已就位（`.github/workflows/release.yml`）
2. ✅ `kiro-spec/package.json` 中的版本号正确
3. ✅ 所有代码变更已提交到main分支
4. ✅ 项目构建脚本正常工作

## 🧪 测试步骤

### 1. 本地验证

在创建标签之前，先在本地测试构建过程：

```bash
# 切换到扩展目录
cd kiro-spec

# 安装依赖
npm install

# 运行代码检查
npm run lint

# 编译TypeScript
npm run compile

# 本地构建VSIX（需要全局安装vsce）
npm install -g @vscode/vsce
npm run package

# 验证生成的VSIX文件
ls -la *.vsix
```

### 2. 版本号管理

```bash
# 回到项目根目录
cd ..

# 更新版本号（根据变更类型选择）
cd kiro-spec
npm version patch   # 修复: 1.0.0 -> 1.0.1
# npm version minor   # 功能: 1.0.0 -> 1.1.0  
# npm version major   # 破坏性: 1.0.0 -> 2.0.0

# 提交版本变更
cd ..
git add kiro-spec/package.json
git commit -m "chore: bump version to $(node -p "require('./kiro-spec/package.json').version")"
git push origin main
```

### 3. 触发自动发布

```bash
# 获取当前版本号
VERSION=$(node -p "require('./kiro-spec/package.json').version")

# 创建并推送标签
git tag "v$VERSION"
git push origin "v$VERSION"

# GitHub Actions将自动触发构建
```

### 4. 监控构建过程

1. **查看Actions运行状态**：
   - 访问：`https://github.com/kiro-code/kiro-spec/actions`
   - 找到最新的"Release VSIX"工作流

2. **检查构建日志**：
   - 点击工作流查看详细日志
   - 确认每个步骤都成功完成

3. **验证输出**：
   - ✅ 代码检查通过
   - ✅ TypeScript编译成功
   - ✅ VSIX文件生成
   - ✅ 版本号验证通过
   - ✅ GitHub Release创建

## ✅ 验证发布结果

### 检查GitHub Release

1. 访问：`https://github.com/kiro-code/kiro-spec/releases`
2. 确认最新Release包含：
   - ✅ 正确的版本号和标签
   - ✅ 自动生成的Release说明
   - ✅ `kiro-spec-x.x.x.vsix` 文件附件

### 测试VSIX安装

1. **下载VSIX文件**：
   ```bash
   curl -L -o "kiro-spec-test.vsix" \
     "https://github.com/kiro-code/kiro-spec/releases/download/v$VERSION/kiro-spec-$VERSION.vsix"
   ```

2. **VS Code中测试安装**：
   - 打开VS Code
   - `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
   - 选择下载的VSIX文件
   - 验证扩展功能正常

3. **命令行测试安装**：
   ```bash
   code --install-extension "kiro-spec-$VERSION.vsix"
   ```

## 🐛 常见问题排查

### 构建失败

1. **版本号不匹配**：
   - 检查git标签版本与package.json版本是否一致
   - 重新创建正确的标签

2. **代码检查失败**：
   - 本地运行 `npm run lint` 修复问题
   - 提交修复后重新创建标签

3. **TypeScript编译错误**：
   - 本地运行 `npm run compile` 检查错误
   - 修复类型错误后重新发布

### Release创建失败

1. **权限问题**：
   - 确认Actions有正确的GITHUB_TOKEN权限
   - 检查Repository Settings → Actions → General

2. **标签冲突**：
   ```bash
   # 删除错误的标签
   git tag -d v1.0.0
   git push --delete origin v1.0.0
   
   # 重新创建正确的标签
   git tag v1.0.0
   git push origin v1.0.0
   ```

## 📊 成功指标

完整的测试流程成功后，应该具备：

- ✅ GitHub Actions工作流绿色通过
- ✅ GitHub Release自动创建
- ✅ VSIX文件成功上传并可下载
- ✅ 扩展在VS Code中正常安装和运行
- ✅ 版本号在所有地方保持一致
- ✅ Release说明自动生成并包含变更信息

## 🔄 定期维护

建议定期执行以下维护任务：

1. **依赖更新**：定期更新npm依赖包
2. **工作流测试**：每月至少测试一次完整发布流程  
3. **文档更新**：保持README和文档与实际功能同步
4. **版本策略**：遵循语义化版本控制规范

---

**祝您的自动化发布流程运行顺利！** 🚀