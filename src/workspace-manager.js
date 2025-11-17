import path from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';

/**
 * 工作目录管理器
 */
export class WorkspaceManager {
  constructor(initialPath = process.cwd()) {
    this.currentPath = initialPath;
    this.history = [initialPath]; // 记录历史路径
    this.maxHistorySize = 10;
  }

  /**
   * 获取当前工作目录
   */
  getCurrentPath() {
    return this.currentPath;
  }

  /**
   * 切换工作目录
   */
  changePath(newPath) {
    // 处理相对路径
    const absolutePath = path.isAbsolute(newPath)
      ? newPath
      : path.resolve(this.currentPath, newPath);

    // 检查路径是否存在
    if (!existsSync(absolutePath)) {
      return {
        success: false,
        error: `路径不存在: ${newPath}`
      };
    }

    // 保存到历史
    this.currentPath = absolutePath;
    this.history.push(absolutePath);

    // 限制历史大小
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    return {
      success: true,
      path: absolutePath,
      message: `已切换到: ${absolutePath}`
    };
  }

  /**
   * 返回上一级目录
   */
  goUp() {
    const parentPath = path.dirname(this.currentPath);
    return this.changePath(parentPath);
  }

  /**
   * 返回到之前的目录
   */
  goBack() {
    if (this.history.length < 2) {
      return {
        success: false,
        error: '没有历史记录'
      };
    }

    // 移除当前路径
    this.history.pop();
    
    // 获取上一个路径
    const previousPath = this.history[this.history.length - 1];
    this.currentPath = previousPath;

    return {
      success: true,
      path: previousPath,
      message: `已返回到: ${previousPath}`
    };
  }

  /**
   * 获取路径历史
   */
  getHistory() {
    return {
      success: true,
      history: this.history,
      current: this.currentPath
    };
  }

  /**
   * 显示当前路径
   */
  showCurrentPath() {
    return {
      success: true,
      path: this.currentPath,
      home: process.env.HOME || process.env.USERPROFILE,
      cwd: process.cwd()
    };
  }
}

/**
 * 格式化路径显示
 */
export function formatPath(fullPath) {
  const home = process.env.HOME || process.env.USERPROFILE;
  if (home && fullPath.startsWith(home)) {
    return fullPath.replace(home, '~');
  }
  return fullPath;
}

