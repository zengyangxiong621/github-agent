import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execPromise = promisify(exec);

/**
 * 终端命令执行器
 */
export class TerminalCommands {
  constructor(workingDir = process.cwd()) {
    this.workingDir = workingDir;
    this.commandHistory = [];
    this.maxHistorySize = 50;
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
   * 执行命令
   * @param {string} command - 要执行的命令
   * @param {Object} options - 执行选项
   */
  async executeCommand(command, options = {}) {
    try {
      const {
        timeout = 30000,  // 默认超时 30 秒
        maxBuffer = 1024 * 1024 * 10,  // 默认最大缓冲 10MB
        captureOutput = true,
        workingDir = this.workingDir
      } = options;

      // 记录命令历史
      this.addToHistory(command);

      // 安全检查 - 防止危险命令
      if (this.isDangerousCommand(command)) {
        return {
          success: false,
          error: '拒绝执行：该命令可能具有危险性',
          command: command,
          dangerous: true
        };
      }

      console.log(chalk.blue(`\n→ 执行命令: ${command}`));
      console.log(chalk.gray(`   工作目录: ${workingDir}\n`));

      const startTime = Date.now();

      const { stdout, stderr } = await execPromise(command, {
        cwd: workingDir,
        timeout,
        maxBuffer,
        shell: '/bin/bash'
      });

      const executionTime = Date.now() - startTime;

      // 显示输出
      if (stdout) {
        console.log(chalk.white(stdout));
      }

      if (stderr) {
        console.log(chalk.yellow('警告输出:'));
        console.log(chalk.yellow(stderr));
      }

      return {
        success: true,
        command: command,
        stdout: stdout,
        stderr: stderr,
        executionTime: executionTime,
        workingDir: workingDir
      };

    } catch (error) {
      console.log(chalk.red(`✗ 命令执行失败: ${error.message}\n`));

      return {
        success: false,
        command: command,
        error: error.message,
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        code: error.code,
        workingDir: this.workingDir
      };
    }
  }

  /**
   * 执行多个命令（串行）
   * @param {Array<string>} commands - 命令数组
   */
  async executeCommands(commands, options = {}) {
    const results = [];

    for (const command of commands) {
      const result = await this.executeCommand(command, options);
      results.push(result);

      // 如果命令失败且设置了 stopOnError，则停止执行
      if (!result.success && options.stopOnError) {
        break;
      }
    }

    return {
      success: results.every(r => r.success),
      results: results,
      total: commands.length,
      succeeded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }

  /**
   * 检查命令是否危险
   * @param {string} command - 命令字符串
   */
  isDangerousCommand(command) {
    const dangerousPatterns = [
      /rm\s+-rf\s+\/[^\/]/,  // rm -rf /xxx (根目录删除)
      /:\(\)\{.*\};:/,  // Fork bomb
      /mkfs/,  // 格式化文件系统
      /dd\s+if=.*of=\/dev/,  // 危险的 dd 操作
      />.*\/dev\/sd/,  // 直接写入磁盘设备
      /curl.*\|\s*bash/,  // 危险的管道执行
      /wget.*\|\s*sh/,  // 危险的管道执行
      /chmod\s+-R\s+777\s+\//,  // 递归修改根目录权限
      /chown\s+-R.*\s+\//,  // 递归修改根目录所有者
      /sudo\s+rm\s+-rf\s+\/(?!home|tmp|var)/  // sudo 删除关键系统目录
    ];

    // 检查是否包含危险模式
    return dangerousPatterns.some(pattern => pattern.test(command));
  }

  /**
   * 获取命令建议（基于常用命令）
   */
  getSuggestions(partialCommand) {
    const commonCommands = [
      // 文件操作
      'ls -la', 'ls -lh', 'cat', 'head', 'tail', 'grep', 'find',
      'mkdir', 'touch', 'cp', 'mv', 'pwd', 'cd',
      
      // 系统信息
      'uname -a', 'whoami', 'date', 'uptime', 'df -h', 'du -sh',
      'ps aux', 'top', 'free -h',
      
      // 网络
      'ping', 'curl', 'wget', 'netstat', 'ifconfig',
      
      // Git (已有专门的 git 命令模块)
      'git status', 'git log', 'git diff', 'git branch',
      
      // Node.js / npm
      'npm install', 'npm start', 'npm test', 'npm run',
      'node --version', 'npm --version',
      
      // 其他
      'echo', 'env', 'history', 'which', 'whereis'
    ];

    if (!partialCommand) {
      return commonCommands;
    }

    return commonCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(partialCommand.toLowerCase())
    );
  }

  /**
   * 添加命令到历史
   */
  addToHistory(command) {
    this.commandHistory.push({
      command: command,
      timestamp: new Date(),
      workingDir: this.workingDir
    });

    // 限制历史记录大小
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }
  }

  /**
   * 获取命令历史
   */
  getHistory(count = 10) {
    const history = this.commandHistory.slice(-count).reverse();
    return {
      success: true,
      data: history,
      total: this.commandHistory.length
    };
  }

  /**
   * 清除命令历史
   */
  clearHistory() {
    this.commandHistory = [];
    return { success: true, message: '命令历史已清除' };
  }

  /**
   * 检查命令是否存在
   * @param {string} commandName - 命令名称
   */
  async commandExists(commandName) {
    try {
      await execPromise(`which ${commandName}`);
      return { success: true, exists: true, command: commandName };
    } catch {
      return { success: true, exists: false, command: commandName };
    }
  }

  /**
   * 获取环境变量
   * @param {string} varName - 变量名（可选）
   */
  getEnvironmentVariable(varName = null) {
    try {
      if (varName) {
        return {
          success: true,
          variable: varName,
          value: process.env[varName] || null
        };
      } else {
        return {
          success: true,
          variables: process.env
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * 格式化命令执行结果
 */
export function formatCommandResult(result) {
  let output = '';

  if (!result.success) {
    output += chalk.red(`\n✗ 命令执行失败\n`);
    output += chalk.gray(`   命令: ${result.command}\n`);
    if (result.dangerous) {
      output += chalk.red.bold(`   原因: ${result.error}\n`);
    } else {
      output += chalk.red(`   错误: ${result.error}\n`);
      if (result.stderr) {
        output += chalk.yellow(`\n错误输出:\n${result.stderr}\n`);
      }
    }
  } else {
    output += chalk.green(`\n✓ 命令执行成功\n`);
    output += chalk.gray(`   命令: ${result.command}\n`);
    output += chalk.gray(`   耗时: ${result.executionTime}ms\n`);
    
    if (result.stdout) {
      output += chalk.white(`\n输出:\n${result.stdout}\n`);
    }
    
    if (result.stderr) {
      output += chalk.yellow(`\n警告:\n${result.stderr}\n`);
    }
  }

  return output;
}

/**
 * 格式化多命令执行结果
 */
export function formatMultiCommandResult(result) {
  let output = chalk.cyan(`\n执行了 ${result.total} 个命令\n`);
  output += chalk.green(`✓ 成功: ${result.succeeded}`) + ' | ';
  output += chalk.red(`✗ 失败: ${result.failed}\n\n`);

  result.results.forEach((res, index) => {
    const status = res.success ? chalk.green('✓') : chalk.red('✗');
    output += `${status} [${index + 1}] ${res.command}\n`;
  });

  return output;
}

/**
 * 格式化命令历史
 */
export function formatCommandHistory(result) {
  if (!result.success) {
    return chalk.red(`✗ ${result.error}`);
  }

  let output = chalk.cyan(`\n📜 命令历史 (最近 ${result.data.length} 条)\n\n`);

  result.data.forEach((item, index) => {
    const time = item.timestamp.toLocaleString('zh-CN');
    output += chalk.gray(`${index + 1}. `) + chalk.white(item.command);
    output += chalk.gray(` (${time})\n`);
  });

  return output;
}

