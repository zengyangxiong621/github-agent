import axios from 'axios';
import { config } from './config.js';

/**
 * DeepSeek AI 客户端
 */
export class DeepSeekClient {
  constructor() {
    this.apiKey = config.deepseek.apiKey;
    this.apiUrl = config.deepseek.apiUrl;
    this.model = config.deepseek.model;
    this.conversationHistory = [];
  }

  /**
   * 发送消息到 DeepSeek AI
   * @param {string} message - 用户消息
   * @param {Array} tools - 可用的工具列表
   * @returns {Promise<Object>} AI 响应
   */
  async chat(message, tools = []) {
    try {
      // 添加用户消息到历史
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      const requestBody = {
        model: this.model,
        messages: this.conversationHistory,
        temperature: 0.7,
        max_tokens: 2000
      };

      // 如果提供了工具，添加到请求中
      if (tools.length > 0) {
        requestBody.tools = tools;
        requestBody.tool_choice = 'auto';
      }

      const response = await axios.post(
        this.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const assistantMessage = response.data.choices[0].message;
      
      // 添加助手响应到历史
      this.conversationHistory.push(assistantMessage);

      return {
        content: assistantMessage.content,
        toolCalls: assistantMessage.tool_calls || [],
        finishReason: response.data.choices[0].finish_reason
      };
    } catch (error) {
      console.error('DeepSeek AI 请求错误:', error.response?.data || error.message);
      throw new Error(`DeepSeek AI 调用失败: ${error.message}`);
    }
  }

  /**
   * 添加工具执行结果到对话历史
   * @param {string} toolCallId - 工具调用 ID
   * @param {string} result - 工具执行结果
   */
  addToolResult(toolCallId, result) {
    this.conversationHistory.push({
      role: 'tool',
      tool_call_id: toolCallId,
      content: result
    });
  }

  /**
   * 清除对话历史
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * 设置系统提示词
   * @param {string} systemPrompt - 系统提示词
   */
  setSystemPrompt(systemPrompt) {
    // 移除旧的系统提示（如果存在）
    this.conversationHistory = this.conversationHistory.filter(
      msg => msg.role !== 'system'
    );
    
    // 在开头添加新的系统提示
    this.conversationHistory.unshift({
      role: 'system',
      content: systemPrompt
    });
  }
}

