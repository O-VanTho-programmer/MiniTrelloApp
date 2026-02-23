import { generateText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import fs from 'fs';

async function runCodingAgent(userRequest) {
  console.log("Agent đang phân tích yêu cầu...");

  const { text, toolCalls } = await generateText({
    model: google('gemini-1.5-pro'), 
    prompt: userRequest,

    tools: {
      readFile: tool({
        description: 'Đọc nội dung của một file trong project để hiểu cấu trúc code hiện tại.',
        parameters: z.object({ filePath: z.string() }),
        execute: async ({ filePath }) => {
          console.log(`[Agent Action] Đang đọc file: ${filePath}`);
          try { return fs.readFileSync(filePath, 'utf-8'); } 
          catch (e) { return "File không tồn tại."; }
        },
      }),

      createFile: tool({
        description: 'Tạo một file mới với nội dung code.',
        parameters: z.object({ filePath: z.string(), content: z.string() }),
        execute: async ({ filePath, content }) => {
          console.log(`[Agent Action] Đang tạo file: ${filePath}`);
          fs.writeFileSync(filePath, content);
          return `Đã tạo thành công ${filePath}`;
        },
      }),

      updateFile: tool({
        description: 'Ghi đè hoặc chèn code mới vào một file đã tồn tại.',
        parameters: z.object({ filePath: z.string(), newContent: z.string() }),
        execute: async ({ filePath, newContent }) => {
          console.log(`[Agent Action] Đang cập nhật file: ${filePath}`);
          fs.writeFileSync(filePath, newContent);
          return "Đã cập nhật file.";
        },
      })
    },
    maxSteps: 5, 
  });

  console.log("Agent đã hoàn thành công việc!");
  console.log("Báo cáo của Agent:", text);
}

runCodingAgent(`
  Tạo cho tôi một module 'Teacher' (MongoDB). 
  Đầu tiên hãy đọc file './server.js' để xem cách import routes.
  Sau đó tạo các file Model, Controller, Route tương ứng.
  Cuối cùng, cập nhật lại './server.js' để sử dụng route mới này.
`);