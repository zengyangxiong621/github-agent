#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { GitHubAgent } from './agent.js';
import { validateConfig } from './config.js';

/**
 * 打印欢迎信息
 */
function printWelcome() {
  console.clear();
  console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║                                            ║'));
  console.log(chalk.bold.cyan('║         🤖 GitHub Agent v1.0.0            ║'));
  console.log(chalk.bold.cyan('║                                            ║'));
  console.log(chalk.bold.cyan('║   基于 DeepSeek AI + GitHub MCP           ║'));
  console.log(chalk.bold.cyan('║                                            ║'));
  console.log(chalk.bold.cyan('╚════════════════════════════════════════════╝\n'));
  
  console.log(chalk.white('功能说明:'));
  console.log(chalk.gray('  • 执行所有 Git 命令（status, log, branch, commit 等）'));
  console.log(chalk.gray('  • 查看 GitHub 仓库信息（提交记录、分支、PR、Issues）'));
  console.log(chalk.gray('  • 搜索 GitHub 仓库和用户'));
  console.log(chalk.gray('  • 智能对话，自然语言操作\n'));
  
  console.log(chalk.yellow('命令:'));
  console.log(chalk.gray('  exit   - 退出程序'));
  console.log(chalk.gray('  clear  - 清除对话历史'));
  console.log(chalk.gray('  help   - 显示帮助信息\n'));
}

/**
 * 打印帮助信息
 */
function printHelp() {
  console.log(chalk.cyan('\n📚 帮助信息\n'));
  
  console.log(chalk.white('示例命令:\n'));
  
  console.log(chalk.yellow('Git 操作:'));
  console.log(chalk.gray('  • 查看当前仓库状态'));
  console.log(chalk.gray('  • 显示最近 10 次提交'));
  console.log(chalk.gray('  • 切换到 main 分支'));
  console.log(chalk.gray('  • 创建一个名为 feature-new 的分支'));
  console.log(chalk.gray('  • 提交所有更改，消息为 "update code"'));
  console.log(chalk.gray('  • 推送到远程仓库\n'));
  
  console.log(chalk.yellow('GitHub 操作:'));
  console.log(chalk.gray('  • 查看 workspace 仓库的最近提交'));
  console.log(chalk.gray('  • 获取 owner/repo 仓库的信息'));
  console.log(chalk.gray('  • 查看 owner/repo 的所有分支'));
  console.log(chalk.gray('  • 显示 owner/repo 的 open 状态的 PR'));
  console.log(chalk.gray('  • 搜索 react 相关的仓库'));
  console.log(chalk.gray('  • 获取用户 github 的信息\n'));
}

/**
 * 主函数
 */
async function main() {
  printWelcome();
  
  // 验证配置
  validateConfig();
  
  // 初始化 Agent
  const agent = new GitHubAgent();
  
  console.log(chalk.gray('正在初始化 GitHub Agent...\n'));
  await agent.initialize();
  
  console.log(chalk.green('✓ 初始化完成！开始对话吧。\n'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  
  // 开始交互循环
  while (true) {
    try {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk.cyan('你'),
          prefix: '💬'
        }
      ]);
      
      // 处理特殊命令
      const cmd = message.trim().toLowerCase();
      
      if (cmd === 'exit' || cmd === 'quit' || cmd === 'q') {
        console.log(chalk.yellow('\n👋 再见！\n'));
        process.exit(0);
      }
      
      if (cmd === 'clear') {
        agent.clearHistory();
        console.log(chalk.green('\n✓ 对话历史已清除\n'));
        continue;
      }
      
      if (cmd === 'help' || cmd === 'h') {
        printHelp();
        continue;
      }
      
      if (!message.trim()) {
        continue;
      }
      
      // 处理用户消息
      console.log();
      const response = await agent.handleMessage(message);
      
      // 显示 AI 回复
      if (response) {
        console.log(chalk.bold.green('🤖 Agent:'));
        console.log(chalk.white(response));
      }
      
      console.log(chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      
    } catch (error) {
      if (error.isTtyError) {
        console.error(chalk.red('\n✗ 终端环境不支持交互式输入\n'));
        process.exit(1);
      } else if (error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n👋 再见！\n'));
        process.exit(0);
      } else {
        console.error(chalk.red(`\n✗ 错误: ${error.message}\n`));
      }
    }
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error(chalk.red('\n✗ 未捕获的异常:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('\n✗ 未处理的 Promise 拒绝:'), reason);
  process.exit(1);
});

// 处理 Ctrl+C
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 再见！\n'));
  process.exit(0);
});

// 启动程序
main().catch(error => {
  console.error(chalk.red('\n✗ 程序启动失败:'), error);
  process.exit(1);
});

