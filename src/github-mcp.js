import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import axios from 'axios';
import { config } from './config.js';

/**
 * GitHub MCP 客户端
 * 使用 Model Context Protocol 与 GitHub 交互
 */
export class GitHubMCPClient {
  constructor() {
    this.client = null;
    this.transport = null;
    this.token = config.github.token;
    this.owner = config.github.owner;
    this.apiUrl = 'https://api.github.com';
  }

  /**
   * 初始化 MCP 客户端
   */
  async initialize() {
    try {
      // 注意：这里使用直接的 GitHub API，因为 MCP SDK 需要特定的服务器设置
      // 在实际应用中，您可能需要启动一个 MCP 服务器
      console.log('✓ GitHub MCP 客户端初始化成功');
      return true;
    } catch (error) {
      console.error('GitHub MCP 初始化失败:', error.message);
      return false;
    }
  }

  /**
   * 获取仓库信息
   * @param {string} repo - 仓库名称
   */
  async getRepository(repo) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/repos/${this.owner}/${repo}`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`获取仓库信息失败: ${error.message}`);
    }
  }

  /**
   * 获取仓库的最近提交
   * @param {string} repo - 仓库名称
   * @param {number} count - 获取的提交数量
   */
  async getRecentCommits(repo, count = 10) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/repos/${this.owner}/${repo}/commits`,
        {
          params: { per_page: count },
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      return response.data.map(commit => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url
      }));
    } catch (error) {
      throw new Error(`获取提交记录失败: ${error.message}`);
    }
  }

  /**
   * 获取仓库的分支列表
   * @param {string} repo - 仓库名称
   */
  async getBranches(repo) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/repos/${this.owner}/${repo}/branches`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      return response.data.map(branch => ({
        name: branch.name,
        protected: branch.protected,
        sha: branch.commit.sha.substring(0, 7)
      }));
    } catch (error) {
      throw new Error(`获取分支列表失败: ${error.message}`);
    }
  }

  /**
   * 获取仓库的 Pull Requests
   * @param {string} repo - 仓库名称
   * @param {string} state - PR 状态 (open, closed, all)
   */
  async getPullRequests(repo, state = 'open') {
    try {
      const response = await axios.get(
        `${this.apiUrl}/repos/${this.owner}/${repo}/pulls`,
        {
          params: { state, per_page: 20 },
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      return response.data.map(pr => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.user.login,
        created_at: pr.created_at,
        url: pr.html_url
      }));
    } catch (error) {
      throw new Error(`获取 Pull Requests 失败: ${error.message}`);
    }
  }

  /**
   * 获取仓库的 Issues
   * @param {string} repo - 仓库名称
   * @param {string} state - Issue 状态 (open, closed, all)
   */
  async getIssues(repo, state = 'open') {
    try {
      const response = await axios.get(
        `${this.apiUrl}/repos/${this.owner}/${repo}/issues`,
        {
          params: { state, per_page: 20 },
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      return response.data
        .filter(issue => !issue.pull_request) // 过滤掉 PR
        .map(issue => ({
          number: issue.number,
          title: issue.title,
          state: issue.state,
          author: issue.user.login,
          created_at: issue.created_at,
          labels: issue.labels.map(l => l.name),
          url: issue.html_url
        }));
    } catch (error) {
      throw new Error(`获取 Issues 失败: ${error.message}`);
    }
  }

  /**
   * 搜索仓库
   * @param {string} query - 搜索关键词
   */
  async searchRepositories(query) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/search/repositories`,
        {
          params: { q: query, per_page: 10 },
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      return response.data.items.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url
      }));
    } catch (error) {
      throw new Error(`搜索仓库失败: ${error.message}`);
    }
  }

  /**
   * 获取用户信息
   * @param {string} username - 用户名（可选，默认为当前用户）
   */
  async getUserInfo(username = null) {
    try {
      const url = username 
        ? `${this.apiUrl}/users/${username}`
        : `${this.apiUrl}/user`;
        
      const response = await axios.get(url, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      return {
        login: response.data.login,
        name: response.data.name,
        bio: response.data.bio,
        public_repos: response.data.public_repos,
        followers: response.data.followers,
        following: response.data.following,
        url: response.data.html_url
      };
    } catch (error) {
      throw new Error(`获取用户信息失败: ${error.message}`);
    }
  }

  /**
   * 关闭客户端连接
   */
  async close() {
    if (this.transport) {
      await this.transport.close();
    }
  }
}

