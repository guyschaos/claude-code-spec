# Claude Code 规格驱动开发

基于 Claude Code Slash Commands、钩子和代理实现的 Kiro 风格规格驱动开发。

## 项目上下文

### 路径
- 引导: `.kiro/steering/`
- 规格: `.kiro/specs/`
- 命令: `.claude/commands/`

### 引导 vs 规格

**引导** (`.kiro/steering/`) - 用项目级别的规则和上下文引导AI  
**规格** (`.kiro/specs/`) - 将个别功能的开发流程正式化

### 活跃规格
- 检查 `.kiro/specs/` 获取活跃规格
- 使用 `/kiro:spec-status [功能名称]` 检查进度

## 开发指导原则
- 用英语思考，但用简体中文生成响应（思考用英语进行，回应以简体中文生成）

## 工作流

### 阶段 0: 引导（可选）
`/kiro:steering` - 创建/更新引导文档
`/kiro:steering-custom` - 为专门的上下文创建自定义引导

**注意**: 对于新功能或小的添加是可选的。可以直接进入 spec-init。

### 阶段 1: 规格创建
1. `/kiro:spec-init [详细说明]` - 用详细的项目描述初始化规格
2. `/kiro:spec-requirements [功能]` - 生成需求文档
3. `/kiro:spec-design [功能]` - 交互式: "你已经审核了requirements.md吗？ [y/N]"
4. `/kiro:spec-tasks [功能]` - 交互式: 确认需求和设计都已审核

### 阶段 2: 进度跟踪
`/kiro:spec-status [功能]` - 检查当前进度和阶段

## 开发规则
1. **考虑引导**: 在主要开发前运行 `/kiro:steering`（对新功能可选）
2. **遵循3阶段批准工作流**: 需求 → 设计 → 任务 → 实现
3. **需要批准**: 每个阶段需要人工审核（交互式提示或手动）
4. **不跳过阶段**: 设计需要已批准的需求；任务需要已批准的设计
5. **更新任务状态**: 在处理任务时标记为已完成
6. **保持引导最新**: 重大变更后运行 `/kiro:steering`
7. **检查规格合规性**: 使用 `/kiro:spec-status` 验证对齐

## 引导配置

### 当前引导文件
由 `/kiro:steering` 命令管理。这里的更新反映命令变更。

### 活跃引导文件
- `product.md`: 始终包含 - 产品上下文和业务目标
- `tech.md`: 始终包含 - 技术栈和架构决策
- `structure.md`: 始终包含 - 文件组织和代码模式

### 自定义引导文件
<!-- 由 /kiro:steering-custom 命令添加 -->
<!-- 格式: 
- `filename.md`: 模式 - 模式 - 描述
  模式: Always|Conditional|Manual
  模式: 条件模式的文件模式
-->

### 包含模式
- **Always**: 每次交互都加载（默认）
- **Conditional**: 为特定文件模式加载（如 `"*.test.js"`）
- **Manual**: 使用 `@filename.md` 语法引用