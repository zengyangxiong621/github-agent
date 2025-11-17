import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  // DeepSeek AI 配置
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat'
  },
  
  // GitHub 配置
  github: {
    token: process.env.GITHUB_TOKEN || '',
    owner: process.env.GITHUB_OWNER || ''
  },
  
  // 工作区配置
  workspace: {
    path: process.env.WORKSPACE_PATH || process.cwd()  // 默认使用启动时的当前目录
  }
};

// 验证必需的配置
export function validateConfig() {
  const errors = [];
  
  if (!config.deepseek.apiKey) {
    errors.push('缺少 DEEPSEEK_API_KEY 环境变量');
  }
  
  if (!config.github.token) {
    errors.push('缺少 GITHUB_TOKEN 环境变量');
  }
  
  if (errors.length > 0) {
    console.warn('⚠️  配置警告：');
    errors.forEach(error => console.warn(`   - ${error}`));
    console.warn('   部分功能可能无法使用。请检查 .env 文件。\n');
  }
  
  return errors.length === 0;
}

