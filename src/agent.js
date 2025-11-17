import { DeepSeekClient } from './deepseek.js';
import { GitHubMCPClient } from './github-mcp.js';
import { GitCommands, formatStatus, formatLog } from './git-commands.js';
import { tools } from './tools.js';
import chalk from 'chalk';
import ora from 'ora';

/**
 * GitHub Agent 核心类
 */
export class GitHubAgent {
  constructor() {
    this.deepseek = new DeepSeekClient();
    this.github = new GitHubMCPClient();
    this.git = new GitCommands();
    
    // 设置系统提示词
    this.deepseek.setSystemPrompt(`你是一个专业的 GitHub 和 Git 助手。你可以帮助用户：
1. 执行各种 Git 命令（status, log, branch, commit, push, pull 等）
2. 查看 GitHub 仓库信息（提交记录、分支、PR、Issues 等）
3. 搜索 GitHub 仓库和用户

当用户询问时，你应该：
- 理解用户的意图
- 选择合适的工具来完成任务
- 用清晰、友好的方式展示结果
- 如果需要参数但用户没有提供，请询问用户

请用中文回复用户。`);
  }

  /**
   * 初始化 Agent
   */
  async initialize() {
    await this.github.initialize();
  }

  /**
   * 处理用户消息
   */
  async handleMessage(message) {
    const spinner = ora('正在思考...').start();
    
    try {
      // 发送消息给 AI
      const response = await this.deepseek.chat(message, tools);
      
      spinner.stop();
      
      // 如果 AI 需要调用工具
      if (response.toolCalls.length > 0) {
        console.log(chalk.gray('\n🔧 正在执行操作...\n'));
        
        // 执行所有工具调用
        for (const toolCall of response.toolCalls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          
          console.log(chalk.blue(`→ 执行: ${toolName}`));
          
          // 执行工具
          const result = await this.executeTool(toolName, toolArgs);
          
          // 将结果添加到对话历史
          this.deepseek.addToolResult(
            toolCall.id,
            JSON.stringify(result)
          );
        }
        
        // 让 AI 总结工具执行结果
        const finalSpinner = ora('正在生成回复...').start();
        const finalResponse = await this.deepseek.chat('请总结上述操作的结果', []);
        finalSpinner.stop();
        
        return finalResponse.content;
      }
      
      // 如果不需要调用工具，直接返回 AI 回复
      return response.content;
      
    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  /**
   * 执行工具
   */
  async executeTool(toolName, args) {
    try {
      switch (toolName) {
        // Git 命令
        case 'git_status': {
          const result = await this.git.status();
          if (result.success) {
            console.log(formatStatus(result.data));
          }
          return result;
        }
        
        case 'git_log': {
          const maxCount = args.maxCount || 10;
          const result = await this.git.log(maxCount);
          if (result.success) {
            console.log(formatLog(result.data));
          }
          return result;
        }
        
        case 'git_branch': {
          const result = await this.git.branch();
          if (result.success) {
            console.log(chalk.cyan('\n分支列表:'));
            Object.keys(result.data.branches).forEach(branch => {
              const isCurrent = branch === result.data.current;
              const prefix = isCurrent ? chalk.green('* ') : '  ';
              console.log(prefix + branch);
            });
            console.log();
          }
          return result;
        }
        
        case 'git_checkout': {
          const result = await this.git.checkout(args.branchName);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          }
          return result;
        }
        
        case 'git_create_branch': {
          const result = await this.git.createBranch(args.branchName);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          }
          return result;
        }
        
        case 'git_add': {
          const files = args.files || '.';
          const result = await this.git.add(files);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          }
          return result;
        }
        
        case 'git_commit': {
          const result = await this.git.commit(args.message);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}`));
            console.log(chalk.gray(`  提交: ${result.data.commit}\n`));
          }
          return result;
        }
        
        case 'git_push': {
          const result = await this.git.push(args.remote, args.branch);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          }
          return result;
        }
        
        case 'git_pull': {
          const result = await this.git.pull(args.remote, args.branch);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          }
          return result;
        }
        
        case 'git_diff': {
          const result = await this.git.diff();
          if (result.success && result.data) {
            console.log(chalk.cyan('\n文件差异:\n'));
            console.log(result.data);
          }
          return result;
        }
        
        case 'git_stash': {
          const result = await this.git.stash();
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          }
          return result;
        }
        
        case 'git_stash_pop': {
          const result = await this.git.stashPop();
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          }
          return result;
        }
        
        // GitHub 命令
        case 'github_get_repo': {
          const repo = await this.github.getRepository(args.repo);
          console.log(chalk.cyan('\n仓库信息:'));
          console.log(chalk.white(`  名称: ${repo.full_name}`));
          console.log(chalk.white(`  描述: ${repo.description || '无'}`));
          console.log(chalk.yellow(`  ⭐ Stars: ${repo.stargazers_count}`));
          console.log(chalk.blue(`  🔱 Forks: ${repo.forks_count}`));
          console.log(chalk.gray(`  URL: ${repo.html_url}\n`));
          return { success: true, data: repo };
        }
        
        case 'github_get_commits': {
          const count = args.count || 10;
          const commits = await this.github.getRecentCommits(args.repo, count);
          console.log(chalk.cyan(`\n最近 ${commits.length} 次提交:\n`));
          commits.forEach(commit => {
            console.log(chalk.yellow(`${commit.sha}`) + ' - ' + chalk.gray(commit.date));
            console.log(chalk.white(`  ${commit.message}`));
            console.log(chalk.blue(`  作者: ${commit.author}\n`));
          });
          return { success: true, data: commits };
        }
        
        case 'github_get_branches': {
          const branches = await this.github.getBranches(args.repo);
          console.log(chalk.cyan('\nGitHub 分支列表:\n'));
          branches.forEach(branch => {
            const protected_tag = branch.protected ? chalk.red(' [受保护]') : '';
            console.log(chalk.white(`  ${branch.name}`) + protected_tag);
            console.log(chalk.gray(`    SHA: ${branch.sha}`));
          });
          console.log();
          return { success: true, data: branches };
        }
        
        case 'github_get_prs': {
          const state = args.state || 'open';
          const prs = await this.github.getPullRequests(args.repo, state);
          console.log(chalk.cyan(`\nPull Requests (${state}):\n`));
          if (prs.length === 0) {
            console.log(chalk.gray('  没有找到 PR\n'));
          } else {
            prs.forEach(pr => {
              console.log(chalk.yellow(`#${pr.number}`) + ' - ' + chalk.white(pr.title));
              console.log(chalk.blue(`  作者: ${pr.author}`) + ' - ' + chalk.gray(pr.created_at));
              console.log(chalk.gray(`  ${pr.url}\n`));
            });
          }
          return { success: true, data: prs };
        }
        
        case 'github_get_issues': {
          const state = args.state || 'open';
          const issues = await this.github.getIssues(args.repo, state);
          console.log(chalk.cyan(`\nIssues (${state}):\n`));
          if (issues.length === 0) {
            console.log(chalk.gray('  没有找到 Issue\n'));
          } else {
            issues.forEach(issue => {
              console.log(chalk.yellow(`#${issue.number}`) + ' - ' + chalk.white(issue.title));
              console.log(chalk.blue(`  作者: ${issue.author}`) + ' - ' + chalk.gray(issue.created_at));
              if (issue.labels.length > 0) {
                console.log(chalk.magenta(`  标签: ${issue.labels.join(', ')}`));
              }
              console.log(chalk.gray(`  ${issue.url}\n`));
            });
          }
          return { success: true, data: issues };
        }
        
        case 'github_search_repos': {
          const repos = await this.github.searchRepositories(args.query);
          console.log(chalk.cyan(`\n搜索结果 "${args.query}":\n`));
          repos.forEach(repo => {
            console.log(chalk.white(repo.full_name));
            console.log(chalk.gray(`  ${repo.description || '无描述'}`));
            console.log(chalk.yellow(`  ⭐ ${repo.stars}`) + ' ' + chalk.blue(`🔱 ${repo.forks}`));
            console.log(chalk.gray(`  ${repo.url}\n`));
          });
          return { success: true, data: repos };
        }
        
        case 'github_get_user': {
          const user = await this.github.getUserInfo(args.username);
          console.log(chalk.cyan('\n用户信息:'));
          console.log(chalk.white(`  用户名: ${user.login}`));
          console.log(chalk.white(`  姓名: ${user.name || '未设置'}`));
          console.log(chalk.gray(`  简介: ${user.bio || '无'}`));
          console.log(chalk.yellow(`  公开仓库: ${user.public_repos}`));
          console.log(chalk.blue(`  关注者: ${user.followers}`));
          console.log(chalk.blue(`  正在关注: ${user.following}`));
          console.log(chalk.gray(`  ${user.url}\n`));
          return { success: true, data: user };
        }
        
        default:
          return { success: false, error: `未知的工具: ${toolName}` };
      }
    } catch (error) {
      console.log(chalk.red(`✗ 错误: ${error.message}\n`));
      return { success: false, error: error.message };
    }
  }

  /**
   * 清除对话历史
   */
  clearHistory() {
    this.deepseek.clearHistory();
    this.deepseek.setSystemPrompt(`你是一个专业的 GitHub 和 Git 助手。你可以帮助用户：
1. 执行各种 Git 命令（status, log, branch, commit, push, pull 等）
2. 查看 GitHub 仓库信息（提交记录、分支、PR、Issues 等）
3. 搜索 GitHub 仓库和用户

当用户询问时，你应该：
- 理解用户的意图
- 选择合适的工具来完成任务
- 用清晰、友好的方式展示结果
- 如果需要参数但用户没有提供，请询问用户

请用中文回复用户。`);
  }
}

