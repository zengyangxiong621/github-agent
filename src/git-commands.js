import simpleGit from 'simple-git';
import { config } from './config.js';
import chalk from 'chalk';

/**
 * Git 命令执行器
 */
export class GitCommands {
  constructor(workingDir = config.workspace.path) {
    this.git = simpleGit(workingDir);
    this.workingDir = workingDir;
  }

  /**
   * 获取当前工作目录
   */
  getWorkingDir() {
    return this.workingDir;
  }

  /**
   * 设置工作目录
   */
  setWorkingDir(dir) {
    this.workingDir = dir;
    this.git = simpleGit(dir);
  }

  /**
   * 获取仓库状态
   */
  async status() {
    try {
      const status = await this.git.status();
      return {
        success: true,
        data: {
          current: status.current,
          tracking: status.tracking,
          ahead: status.ahead,
          behind: status.behind,
          modified: status.modified,
          created: status.created,
          deleted: status.deleted,
          renamed: status.renamed,
          staged: status.staged,
          conflicted: status.conflicted
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取提交日志
   * @param {number} maxCount - 最大提交数量
   */
  async log(maxCount = 10) {
    try {
      const log = await this.git.log({ maxCount });
      return {
        success: true,
        data: log.all.map(commit => ({
          hash: commit.hash.substring(0, 7),
          date: commit.date,
          message: commit.message,
          author: commit.author_name
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 查看分支列表
   */
  async branch() {
    try {
      const branches = await this.git.branch();
      return {
        success: true,
        data: {
          current: branches.current,
          all: branches.all,
          branches: branches.branches
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 创建新分支
   * @param {string} branchName - 分支名称
   */
  async createBranch(branchName) {
    try {
      await this.git.checkoutLocalBranch(branchName);
      return { success: true, message: `成功创建并切换到分支: ${branchName}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 切换分支
   * @param {string} branchName - 分支名称
   */
  async checkout(branchName) {
    try {
      await this.git.checkout(branchName);
      return { success: true, message: `成功切换到分支: ${branchName}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 添加文件到暂存区
   * @param {string|Array} files - 文件路径或文件路径数组
   */
  async add(files = '.') {
    try {
      await this.git.add(files);
      const fileList = Array.isArray(files) ? files.join(', ') : files;
      return { success: true, message: `成功添加文件到暂存区: ${fileList}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 提交更改
   * @param {string} message - 提交信息
   */
  async commit(message) {
    try {
      const result = await this.git.commit(message);
      return {
        success: true,
        message: `提交成功`,
        data: {
          commit: result.commit.substring(0, 7),
          summary: result.summary
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 推送到远程仓库
   * @param {string} remote - 远程仓库名称
   * @param {string} branch - 分支名称
   */
  async push(remote = 'origin', branch = null) {
    try {
      if (branch) {
        await this.git.push(remote, branch);
      } else {
        await this.git.push();
      }
      return { success: true, message: `成功推送到远程仓库: ${remote}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 从远程仓库拉取
   * @param {string} remote - 远程仓库名称
   * @param {string} branch - 分支名称
   */
  async pull(remote = 'origin', branch = null) {
    try {
      if (branch) {
        await this.git.pull(remote, branch);
      } else {
        await this.git.pull();
      }
      return { success: true, message: `成功从远程仓库拉取: ${remote}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取远程仓库列表
   */
  async remote() {
    try {
      const remotes = await this.git.getRemotes(true);
      return {
        success: true,
        data: remotes.map(r => ({
          name: r.name,
          fetch: r.refs.fetch,
          push: r.refs.push
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 添加远程仓库
   * @param {string} name - 远程仓库名称
   * @param {string} url - 远程仓库 URL
   */
  async addRemote(name, url) {
    try {
      await this.git.addRemote(name, url);
      return { success: true, message: `成功添加远程仓库: ${name} -> ${url}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 查看差异
   * @param {Array} options - diff 选项
   */
  async diff(options = []) {
    try {
      const diff = await this.git.diff(options);
      return { success: true, data: diff };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 暂存当前更改
   * @param {Array} options - stash 选项
   */
  async stash(options = []) {
    try {
      await this.git.stash(options);
      return { success: true, message: '成功暂存当前更改' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 应用暂存的更改
   */
  async stashPop() {
    try {
      await this.git.stash(['pop']);
      return { success: true, message: '成功应用暂存的更改' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 合并分支
   * @param {string} branch - 要合并的分支名称
   */
  async merge(branch) {
    try {
      await this.git.merge([branch]);
      return { success: true, message: `成功合并分支: ${branch}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 重置到指定提交
   * @param {string} mode - 重置模式 (soft, mixed, hard)
   * @param {string} commit - 提交 hash
   */
  async reset(mode = 'mixed', commit = 'HEAD') {
    try {
      await this.git.reset([`--${mode}`, commit]);
      return { success: true, message: `成功重置到: ${commit} (${mode})` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 克隆仓库
   * @param {string} url - 仓库 URL
   * @param {string} targetDir - 目标目录
   */
  async clone(url, targetDir) {
    try {
      await this.git.clone(url, targetDir);
      return { success: true, message: `成功克隆仓库到: ${targetDir}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取标签列表
   */
  async tags() {
    try {
      const tags = await this.git.tags();
      return { success: true, data: tags.all };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 创建标签
   * @param {string} tagName - 标签名称
   * @param {string} message - 标签信息
   */
  async createTag(tagName, message = '') {
    try {
      if (message) {
        await this.git.addTag(tagName, message);
      } else {
        await this.git.tag([tagName]);
      }
      return { success: true, message: `成功创建标签: ${tagName}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * 格式化输出 Git 状态
 */
export function formatStatus(statusData) {
  let output = '';
  
  output += chalk.bold.cyan(`\n当前分支: ${statusData.current}\n`);
  
  if (statusData.tracking) {
    output += chalk.gray(`跟踪: ${statusData.tracking}\n`);
  }
  
  if (statusData.ahead > 0) {
    output += chalk.green(`领先 ${statusData.ahead} 个提交\n`);
  }
  
  if (statusData.behind > 0) {
    output += chalk.red(`落后 ${statusData.behind} 个提交\n`);
  }
  
  if (statusData.staged.length > 0) {
    output += chalk.bold.green('\n已暂存的更改:\n');
    statusData.staged.forEach(file => {
      output += chalk.green(`  + ${file}\n`);
    });
  }
  
  if (statusData.modified.length > 0) {
    output += chalk.bold.yellow('\n已修改的文件:\n');
    statusData.modified.forEach(file => {
      output += chalk.yellow(`  M ${file}\n`);
    });
  }
  
  if (statusData.created.length > 0) {
    output += chalk.bold.green('\n新建的文件:\n');
    statusData.created.forEach(file => {
      output += chalk.green(`  + ${file}\n`);
    });
  }
  
  if (statusData.deleted.length > 0) {
    output += chalk.bold.red('\n已删除的文件:\n');
    statusData.deleted.forEach(file => {
      output += chalk.red(`  - ${file}\n`);
    });
  }
  
  if (statusData.conflicted.length > 0) {
    output += chalk.bold.red('\n冲突的文件:\n');
    statusData.conflicted.forEach(file => {
      output += chalk.red(`  ! ${file}\n`);
    });
  }
  
  return output;
}

/**
 * 格式化输出提交日志
 */
export function formatLog(logData) {
  let output = chalk.bold.cyan('\n提交历史:\n\n');
  
  logData.forEach(commit => {
    output += chalk.yellow(`${commit.hash}`) + ' - ';
    output += chalk.gray(commit.date) + '\n';
    output += chalk.white(`  ${commit.message}`) + '\n';
    output += chalk.blue(`  作者: ${commit.author}`) + '\n\n';
  });
  
  return output;
}

