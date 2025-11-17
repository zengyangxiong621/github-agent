import fs from 'fs/promises';
import path from 'path';
import { existsSync, statSync } from 'fs';
import chalk from 'chalk';

/**
 * 文件操作类
 */
export class FileOperations {
  constructor(workingDir = process.cwd()) {
    this.workingDir = workingDir;
    // 默认排除的目录
    this.defaultExcludeDirs = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      'out',
      'target'
    ];
  }

  /**
   * 设置工作目录
   */
  setWorkingDir(dir) {
    this.workingDir = dir;
  }

  /**
   * 获取工作目录
   */
  getWorkingDir() {
    return this.workingDir;
  }

  /**
   * 检查是否应该排除该目录
   */
  shouldExcludeDir(dirName) {
    return this.defaultExcludeDirs.includes(dirName);
  }

  /**
   * 列出目录中的文件和文件夹
   * @param {string} targetPath - 目标路径（相对或绝对）
   * @param {boolean} showHidden - 是否显示隐藏文件
   * @param {boolean} recursive - 是否递归列出子目录
   */
  async listFiles(targetPath = '.', showHidden = false, recursive = false) {
    try {
      const fullPath = path.isAbsolute(targetPath) 
        ? targetPath 
        : path.join(this.workingDir, targetPath);

      if (!existsSync(fullPath)) {
        return { success: false, error: `路径不存在: ${targetPath}` };
      }

      const stat = statSync(fullPath);
      if (!stat.isDirectory()) {
        return { success: false, error: `${targetPath} 不是一个目录` };
      }

      let files = await fs.readdir(fullPath);

      // 过滤隐藏文件和排除的目录
      files = files.filter(f => {
        // 过滤隐藏文件
        if (!showHidden && f.startsWith('.')) {
          return false;
        }
        // 过滤排除的目录
        if (this.shouldExcludeDir(f)) {
          return false;
        }
        return true;
      });

      const fileDetails = [];
      
      for (const file of files) {
        const filePath = path.join(fullPath, file);
        const fileStat = statSync(filePath);
        
        const detail = {
          name: file,
          type: fileStat.isDirectory() ? 'directory' : 'file',
          size: fileStat.size,
          modified: fileStat.mtime,
          path: path.relative(this.workingDir, filePath) || '.'
        };

        fileDetails.push(detail);

        // 递归列出子目录
        if (recursive && fileStat.isDirectory()) {
          const subResult = await this.listFiles(
            path.join(targetPath, file),
            showHidden,
            true
          );
          if (subResult.success && subResult.data) {
            fileDetails.push(...subResult.data.map(item => ({
              ...item,
              path: path.join(file, item.path)
            })));
          }
        }
      }

      // 按类型和名称排序
      fileDetails.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      return {
        success: true,
        data: fileDetails,
        path: fullPath,
        count: fileDetails.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 读取文件内容
   * @param {string} filePath - 文件路径
   * @param {string} encoding - 编码格式
   * @param {number} maxLines - 最大读取行数（0表示全部）
   */
  async readFile(filePath, encoding = 'utf-8', maxLines = 0) {
    try {
      const fullPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(this.workingDir, filePath);

      if (!existsSync(fullPath)) {
        return { success: false, error: `文件不存在: ${filePath}` };
      }

      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        return { success: false, error: `${filePath} 是一个目录，请使用 list_files` };
      }

      // 检查文件大小
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (stat.size > maxSize) {
        return { 
          success: false, 
          error: `文件太大 (${(stat.size / 1024 / 1024).toFixed(2)}MB)，超过 10MB 限制` 
        };
      }

      let content = await fs.readFile(fullPath, encoding);

      // 限制行数
      if (maxLines > 0) {
        const lines = content.split('\n');
        if (lines.length > maxLines) {
          content = lines.slice(0, maxLines).join('\n');
          content += `\n\n... (省略了 ${lines.length - maxLines} 行)`;
        }
      }

      return {
        success: true,
        data: {
          path: filePath,
          fullPath: fullPath,
          content: content,
          size: stat.size,
          lines: content.split('\n').length,
          encoding: encoding
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 搜索文件
   * @param {string} pattern - 搜索模式（支持通配符）
   * @param {string} searchPath - 搜索路径
   */
  async searchFiles(pattern, searchPath = '.') {
    try {
      const fullPath = path.isAbsolute(searchPath)
        ? searchPath
        : path.join(this.workingDir, searchPath);

      if (!existsSync(fullPath)) {
        return { success: false, error: `路径不存在: ${searchPath}` };
      }

      const results = [];
      const regex = new RegExp(
        pattern.replace(/\*/g, '.*').replace(/\?/g, '.'),
        'i'
      );

      const searchDir = async (dir) => {
        const files = await fs.readdir(dir);

        for (const file of files) {
          // 跳过隐藏文件和目录
          if (file.startsWith('.')) continue;
          
          // 跳过排除的目录
          if (this.shouldExcludeDir(file)) continue;

          const filePath = path.join(dir, file);
          const stat = statSync(filePath);

          if (stat.isDirectory()) {
            await searchDir(filePath);
          } else if (regex.test(file)) {
            results.push({
              name: file,
              path: path.relative(this.workingDir, filePath),
              size: stat.size,
              modified: stat.mtime
            });
          }
        }
      };

      await searchDir(fullPath);

      return {
        success: true,
        data: results,
        count: results.length,
        pattern: pattern
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取文件信息
   * @param {string} filePath - 文件路径
   */
  async getFileInfo(filePath) {
    try {
      const fullPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(this.workingDir, filePath);

      if (!existsSync(fullPath)) {
        return { success: false, error: `路径不存在: ${filePath}` };
      }

      const stat = statSync(fullPath);

      return {
        success: true,
        data: {
          name: path.basename(fullPath),
          path: filePath,
          fullPath: fullPath,
          type: stat.isDirectory() ? 'directory' : 'file',
          size: stat.size,
          sizeFormatted: this.formatSize(stat.size),
          created: stat.birthtime,
          modified: stat.mtime,
          accessed: stat.atime,
          permissions: stat.mode.toString(8).slice(-3)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 格式化文件大小
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

/**
 * 格式化文件列表输出
 */
export function formatFileList(result) {
  if (!result.success) {
    return chalk.red(`✗ ${result.error}`);
  }

  let output = chalk.cyan(`\n📁 目录: ${result.path}\n`);
  output += chalk.gray(`   共 ${result.count} 项\n\n`);

  const { data } = result;
  
  // 分组显示
  const directories = data.filter(f => f.type === 'directory');
  const files = data.filter(f => f.type === 'file');

  if (directories.length > 0) {
    output += chalk.bold.blue('📂 文件夹:\n');
    directories.forEach(dir => {
      output += chalk.blue(`   ${dir.name}/\n`);
    });
    output += '\n';
  }

  if (files.length > 0) {
    output += chalk.bold.white('📄 文件:\n');
    files.forEach(file => {
      const fileOps = new FileOperations();
      const sizeStr = fileOps.formatSize(file.size);
      output += chalk.white(`   ${file.name}`) + chalk.gray(` (${sizeStr})\n`);
    });
  }

  return output;
}

/**
 * 格式化文件内容输出
 */
export function formatFileContent(result, maxDisplayLines = 50) {
  if (!result.success) {
    return chalk.red(`✗ ${result.error}`);
  }

  const { data } = result;
  let output = chalk.cyan(`\n📄 文件: ${data.path}\n`);
  output += chalk.gray(`   大小: ${new FileOperations().formatSize(data.size)}`);
  output += chalk.gray(` | 行数: ${data.lines}\n`);
  output += chalk.gray('━'.repeat(60) + '\n\n');

  const lines = data.content.split('\n');
  const displayLines = Math.min(lines.length, maxDisplayLines);

  for (let i = 0; i < displayLines; i++) {
    const lineNum = String(i + 1).padStart(4, ' ');
    output += chalk.gray(`${lineNum} | `) + lines[i] + '\n';
  }

  if (lines.length > maxDisplayLines) {
    output += chalk.yellow(`\n... (省略了 ${lines.length - maxDisplayLines} 行，使用 max_lines 参数查看更多)\n`);
  }

  output += chalk.gray('\n' + '━'.repeat(60) + '\n');

  return output;
}

