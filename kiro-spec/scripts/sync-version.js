#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 开始同步版本号...');

/**
 * 从 Git 标签获取最新版本号
 * @returns {string|null} 版本号（不含v前缀）
 */
function getLatestVersionFromGit() {
  try {
    // 获取最新的版本标签
    const latestTag = execSync('git describe --tags --abbrev=0 --match="v*"', { 
      encoding: 'utf8', 
      cwd: path.resolve(__dirname, '../..') 
    }).trim();
    
    console.log(`📋 检测到最新Git标签: ${latestTag}`);
    
    // 移除 'v' 前缀
    const version = latestTag.replace(/^v/, '');
    
    // 验证版本号格式 (语义化版本)
    if (!/^\d+\.\d+\.\d+(-.*)?$/.test(version)) {
      throw new Error(`无效的版本号格式: ${version}`);
    }
    
    return version;
  } catch (error) {
    if (error.message.includes('No names found')) {
      console.warn('⚠️  没有找到版本标签，将使用默认版本号 1.0.0');
      return null;
    }
    throw new Error(`获取Git标签失败: ${error.message}`);
  }
}

/**
 * 获取当前 package.json 中的版本号
 * @returns {string} 当前版本号
 */
function getCurrentPackageVersion() {
  const packagePath = path.resolve(__dirname, '../package.json');
  const packageJson = require(packagePath);
  return packageJson.version;
}

/**
 * 更新 package.json 中的版本号
 * @param {string} newVersion 新版本号
 */
async function updatePackageVersion(newVersion) {
  const packagePath = path.resolve(__dirname, '../package.json');
  const packageJson = await fs.readJson(packagePath);
  
  const oldVersion = packageJson.version;
  packageJson.version = newVersion;
  
  await fs.writeJson(packagePath, packageJson, { spaces: 2 });
  
  console.log(`📝 package.json 版本号已更新:`);
  console.log(`   旧版本: ${oldVersion}`);
  console.log(`   新版本: ${newVersion}`);
}

/**
 * 主函数
 */
async function main() {
  try {
    const gitVersion = getLatestVersionFromGit();
    
    if (!gitVersion) {
      console.log('ℹ️  没有Git标签，保持当前package.json版本号不变');
      return;
    }
    
    const currentVersion = getCurrentPackageVersion();
    
    if (gitVersion === currentVersion) {
      console.log(`✅ 版本号已同步: ${currentVersion}`);
      return;
    }
    
    await updatePackageVersion(gitVersion);
    console.log('🎉 版本号同步完成！');
    
  } catch (error) {
    console.error('❌ 版本同步失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  getLatestVersionFromGit,
  getCurrentPackageVersion,
  updatePackageVersion
};