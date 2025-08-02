#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('📦 开始复制模板文件...');

// 项目根目录
const projectRoot = path.resolve(__dirname, '../../');
const extensionRoot = path.resolve(__dirname, '../');

// 源文件路径
const sourcePaths = {
  // CLAUDE配置文件（多语言版本）
  claudeConfigs: {
    'CLAUDE_zh-CN.md': path.join(projectRoot, 'CLAUDE_zh-CN.md'),
    'CLAUDE_en.md': path.join(projectRoot, 'CLAUDE_en.md'), 
    'CLAUDE_ja.md': path.join(projectRoot, 'CLAUDE_ja.md'),
    'CLAUDE_zh-TW.md': path.join(projectRoot, 'CLAUDE_zh-TW.md')
  },
  // Kiro命令文件
  kiroCommands: {
    'spec-init.md': path.join(projectRoot, '.claude/commands/kiro/spec-init.md'),
    'spec-requirements.md': path.join(projectRoot, '.claude/commands/kiro/spec-requirements.md'),
    'spec-design.md': path.join(projectRoot, '.claude/commands/kiro/spec-design.md'),
    'spec-tasks.md': path.join(projectRoot, '.claude/commands/kiro/spec-tasks.md'),
    'spec-status.md': path.join(projectRoot, '.claude/commands/kiro/spec-status.md'),
    'steering.md': path.join(projectRoot, '.claude/commands/kiro/steering.md'),
    'steering-custom.md': path.join(projectRoot, '.claude/commands/kiro/steering-custom.md')
  }
};

// 目标文件路径
const targetPaths = {
  claudeConfigs: path.join(extensionRoot, 'templates/claude-configs'),
  kiroCommands: path.join(extensionRoot, 'templates/claude-commands/kiro')
};

async function copyFiles() {
  try {
    // 确保目标目录存在
    await fs.ensureDir(targetPaths.claudeConfigs);
    await fs.ensureDir(targetPaths.kiroCommands);

    // 复制CLAUDE配置文件
    console.log('📄 复制CLAUDE配置文件...');
    for (const [filename, sourcePath] of Object.entries(sourcePaths.claudeConfigs)) {
      if (await fs.pathExists(sourcePath)) {
        const targetPath = path.join(targetPaths.claudeConfigs, filename);
        await fs.copy(sourcePath, targetPath);
        console.log(`  ✅ ${filename}`);
      } else {
        console.warn(`  ⚠️  源文件不存在: ${sourcePath}`);
      }
    }

    // 复制Kiro命令文件
    console.log('⚡ 复制Kiro命令文件...');
    for (const [filename, sourcePath] of Object.entries(sourcePaths.kiroCommands)) {
      if (await fs.pathExists(sourcePath)) {
        const targetPath = path.join(targetPaths.kiroCommands, filename);
        await fs.copy(sourcePath, targetPath);
        console.log(`  ✅ ${filename}`);
      } else {
        console.warn(`  ⚠️  源文件不存在: ${sourcePath}`);
      }
    }

    console.log('✨ 模板文件复制完成!');
    
    // 输出统计信息
    const claudeCount = Object.keys(sourcePaths.claudeConfigs).length;
    const kiroCount = Object.keys(sourcePaths.kiroCommands).length;
    console.log(`📊 总计复制: ${claudeCount} 个CLAUDE配置文件, ${kiroCount} 个Kiro命令文件`);

  } catch (error) {
    console.error('❌ 复制模板文件失败:', error);
    process.exit(1);
  }
}

// 检查是否存在必要的源文件
async function validateSources() {
  const missingFiles = [];
  
  // 检查至少一个CLAUDE配置文件存在
  const claudeFiles = Object.values(sourcePaths.claudeConfigs);
  const claudeExists = await Promise.all(claudeFiles.map(f => fs.pathExists(f)));
  if (!claudeExists.some(exists => exists)) {
    missingFiles.push('至少一个CLAUDE配置文件');
  }

  // 检查核心Kiro命令文件
  const coreKiroFiles = [
    sourcePaths.kiroCommands['spec-init.md'],
    sourcePaths.kiroCommands['spec-requirements.md'],
    sourcePaths.kiroCommands['spec-design.md'],
    sourcePaths.kiroCommands['spec-tasks.md']
  ];
  
  for (const filePath of coreKiroFiles) {
    if (!(await fs.pathExists(filePath))) {
      missingFiles.push(path.basename(filePath));
    }
  }

  if (missingFiles.length > 0) {
    console.error('❌ 缺少必要的源文件:');
    missingFiles.forEach(file => console.error(`  - ${file}`));
    console.error('请确保在项目根目录中运行此脚本，且所有源文件都存在。');
    process.exit(1);
  }
}

// 主函数
async function main() {
  await validateSources();
  await copyFiles();
}

main();