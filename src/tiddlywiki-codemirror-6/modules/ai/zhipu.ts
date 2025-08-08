import cm6 from '@/cm6/config';

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_API_KEY = cm6.ZHIPU_API_KEY();

/**
 * 使用 fetch 调用 Zhipu GLM-4 模型
 * @param {string} message 用户输入
 * @param {string} [model="glm-4"] 模型名称
 * @returns {Promise<string>} 模型返回的内容
 */
export async function zhipuai(message: string, model = 'glm-4') {
  try {
    const res = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }],
        temperature: 0.95,
        top_p: 0.7,
        stream: true
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error('Zhipu API 错误:', errData);
      return '请求失败: ' + (errData?.error?.message || res.statusText);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '无返回内容';
  } catch (err) {
    console.error('请求异常:', err);
    return '请求异常';
  }
}

export async function zhipuStreamRequest(
  messages: string,
  onMessage: Function,
  cbl: Function,
  options?: { signal?: AbortSignal }
) {
  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [{ role: 'user', content: messages }],
        temperature: 0.95,
        top_p: 0.7,
        stream: true
      }),
      signal: options?.signal
    });

    if (!response.ok) throw new Error(`请求失败: ${response.status}`);
    if (!response.body) throw new Error('');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let partial = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      partial += chunk;

      const lines = partial.split('\n\n');
      partial = lines.pop() || ''; // 可能还未完整

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const json = line.slice(6);
          if (json === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onMessage(content);
          } catch (err) {
            console.error('JSON 解析错误:', err);
          }
        }
      }
    }
  } catch (error) {
    console.error('请求错误:', error);
    throw error; // 根据需求选择是否抛出
  } finally {
    cbl();
  }
}
