# Portfolio MCP Server

An MCP server that exposes your portfolio data (About, Skills, Projects,
Experience, Resume, Social Links) as tools an LLM client can call.

## What's here

- `src/data.ts` — the data layer. Currently returns **mock data** matching
  your Portfolio-as-a-Service entities, so you can run this immediately
  without a database connection.
- `src/index.ts` — the MCP server itself. Registers 7 tools:
  `get_about`, `get_skills`, `get_projects`, `search_projects`,
  `get_experience`, `get_resume_url`, `get_social_links`.

## Run it locally

```bash
npm install
npm run build
npm start
```

You should see `Portfolio MCP server running on stdio` on stderr — that
means it's alive and waiting for an MCP client to connect over stdio.

## Test it without writing a client

Use the official MCP Inspector — a browser-based tool for poking at any
MCP server directly:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

This opens a UI where you can see your tools listed and call them
manually, with real request/response JSON — the fastest way to sanity
check the server before wiring up a real client.

## Connect it to Claude Desktop (optional, for local `@`-mention testing)

Add this to your Claude Desktop MCP config
(`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "portfolio": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-portfolio-server/build/index.js"]
    }
  }
}
```

Restart Claude Desktop, and you'll see `portfolio` show up as a connected
server, with its tools available to Claude in conversation.

## Next steps (in order)

1. **Swap mock data for real Prisma queries.** Open `src/data.ts` — each
   function has a comment showing exactly what the Prisma call should
   look like. Point it at your existing `my_portfolio` schema and
   `DATABASE_URL`.
2. **Adjust field names** in the TypeScript interfaces at the top of
   `data.ts` to match your actual Prisma models — I guessed reasonable
   shapes based on your admin panel sections (About, Skills, Projects,
   Experience, Resume, Social Links), but your real schema may differ.
3. **Switch transport for public use.** Right now this uses `stdio`,
   which only works for local processes (Claude Desktop, Claude Code,
   MCP Inspector). For your portfolio's visitor-facing chat widget,
   you'll need the **Streamable HTTP** transport instead, so the server
   is reachable over the web from your backend's Claude API call. That's
   a small change to the bottom of `index.ts` — happy to do that next
   once the data layer is real.
4. **Deploy it** alongside (or as part of) your existing Express backend
   once it's on HTTP transport.

## Tool design notes

- **Tools vs. resources**: everything here is a *tool* (callable action)
  rather than a *resource* (static readable content), because portfolio
  visitors ask varied natural-language questions ("does he know
  Postgres?") that need searching/filtering, not a wholesale data dump.
- **`search_projects` exists separately from `get_projects`** because an
  LLM client picks tools based on their description — having a dedicated
  search tool with a description like "use this for 'does he have
  experience with X'" makes the model much more likely to call it
  correctly for that kind of question, versus fetching everything and
  filtering itself.
