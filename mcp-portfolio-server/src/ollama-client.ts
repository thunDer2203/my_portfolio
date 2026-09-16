/**
 * ollama-client.ts
 *
 * A standalone MCP client that bridges Ollama (running locally) to your
 * portfolio MCP server. This is the "DIY client" pattern: unlike the
 * Anthropic MCP connector (which does discovery + tool execution for you
 * server-side), here WE own the whole loop:
 *
 *   1. Connect to the MCP server as a subprocess (stdio transport)
 *   2. List its tools, convert them into OpenAI-style tool schemas
 *      (Ollama's API is OpenAI-compatible)
 *   3. Send the user's question + tool list to Ollama
 *   4. If Ollama responds wanting to call a tool, WE call it against the
 *      real MCP server, then feed the result back to Ollama
 *   5. Repeat until Ollama gives a final text answer (no more tool calls)
 *
 * Run with: npx tsx src/ollama-client.ts "your question here"
 * (or compile with tsc + run the built JS, same as the server)
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Ollama, Message } from "ollama";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import dotenv from 'dotenv'
dotenv.config()

const OLLAMA_API=process.env.OLLAMA_API_KEY;
const OLLAMA_URL = "https://ollama.com";
const OLLAMA_MODEL = "gpt-oss:120b"; // change to whatever you pulled

const ollama = new Ollama({
  host: OLLAMA_URL,
  headers: { Authorization: 'Bearer ' + OLLAMA_API },
})
// ---- Types for the OpenAI-compatible chat completion API ----


interface OpenAiTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type?: string;
      [key: string]: any;
    };
  };
}

async function main() {
  // Connect to MCP
  const transport = new StdioClientTransport({
    command: "node",
    args: ["build/index.js"],
  });

  const mcpClient = new Client({
    name: "ollama-bridge",
    version: "1.0.0",
  });

  await mcpClient.connect(transport);

  // Discover MCP tools
  const { tools: mcpTools } = await mcpClient.listTools();

  const openAiTools: OpenAiTool[] = mcpTools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description ?? "",
      parameters: t.inputSchema,
    },
  }));

  console.log(
    `Connected to MCP server. Discovered ${mcpTools.length} tools:`,
    mcpTools.map((t) => t.name).join(", ")
  );

  // This stays alive for the entire session
  const messages: Message[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant answering questions about a software engineer's portfolio. Use the available tools to fetch real data before answering — never guess.",
    },
  ];

  // Create terminal interface
  const rl = readline.createInterface({
    input,
    output,
  });

  console.log("\nOllama MCP Chat");
  console.log("Type 'exit' to quit.\n");

  while (true) {
    const question = await rl.question("You: ");

    if (question.trim().toLowerCase() === "exit") {
      break;
    }

    if (!question.trim()) {
      continue;
    }

    messages.push({
      role: "user",
      content: question,
    });

    // Agent/tool loop for THIS question
    const MAX_TURNS = 5;

    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const res = await ollama.chat({
        model: OLLAMA_MODEL,
        messages,
        tools: openAiTools,
      });

      const assistantMessage = res.message;

      messages.push(assistantMessage);

      // Ollama gave us a final answer
      if (!assistantMessage.tool_calls?.length) {
        console.log(`\nOllama: ${assistantMessage.content}\n`);
        break;
      }

      // Ollama requested tools
      for (const call of assistantMessage.tool_calls) {
        console.log(
          `[calling tool: ${call.function.name}(${JSON.stringify(
            call.function.arguments
          )})]`
        );

        const result = await mcpClient.callTool({
          name: call.function.name,
          arguments: call.function.arguments,
        });

        const resultText = Array.isArray(result.content)
          ? result.content
              .map((c) => ("text" in c ? c.text : JSON.stringify(c)))
              .join("\n")
          : JSON.stringify(result.content);

        messages.push({
          role: "tool",
          content: resultText,
        });
      }
    }
  }

  rl.close();
  await mcpClient.close();

  console.log("\nChat ended.");
}
main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
