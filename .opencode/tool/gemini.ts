/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"
import { spawn } from "child_process"

export default tool({
  description: "Delegates a task to the Gemini CLI agent. Gemini will autonomously research, edit files, and run commands to complete the task.",
  args: {
    prompt: tool.schema.string().describe("The complete task description to send to Gemini."),
  },
  async execute(args) {
    return new Promise((resolve, reject) => {
      // Spawns the gemini CLI
      const proc = spawn("gemini", ["-p", args.prompt], {
        stdio: "pipe",
        env: process.env,
      })

      let output = ""
      proc.stdout.on("data", (data) => (output += data.toString()))
      proc.stderr.on("data", (data) => (output += data.toString()))

      proc.on("close", (code) => {
        resolve(`Gemini exited with code ${code}.\n\nOutput:\n${output}`)
      })
      proc.on("error", (err) => {
        reject(`Failed to start Gemini CLI: ${err.message}`)
      })
    })
  },
})