const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate completions for given combinations
app.post("/api/string-to-task", async (req, res) => {
  const { taskText } = req.body;

  if (!taskText) {
    return res.status(400).json({ error: "Task text is required" });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a task parser that extracts multiple structured tasks from natural language text like meeting transcripts.
          Parse the given text and return an array of JSON objects, where each object has the following fields:
          - task: The main task description (required)
          - assignee: The person assigned to the task (default: 'Unassigned')
          - dueDate: The due date and time in ISO format (default: null)
          - priority: Priority level (P1, P2, P3, or P4, default: 'P3')

          Rules for parsing:
          1. For assignee: Look for names after "to" or "for" or before "by"
          2. For due date: Look for patterns like "by [date/time]", "due [date/time]", "on [date]"
          3. For priority: Look for explicit mentions of P1, P2, P3, P4 or words like "urgent", "high priority"
          4. Convert all dates to ISO format (YYYY-MM-DDTHH:mm:ss)
          5. If multiple dates are found, use the most specific one
          6. Split the input into separate tasks when you see different assignees or distinct task descriptions
          7. Handle relative dates like "tomorrow", "tonight", "next week" appropriately

          Return ONLY the JSON array of tasks, no additional text.`,
        },
        { role: "user", content: taskText },
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 500, // Increased for multiple tasks
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
    });

    const output = chatCompletion.choices[0].message.content;

    try {
      // Parse the output to ensure it's valid JSON
      const parsedTasks = JSON.parse(output);

      console.log("parsedTasks", parsedTasks, "output", output);

      // Validate that we have an array of tasks
      if (!Array.isArray(parsedTasks)) {
        throw new Error("Expected an array of tasks");
      }

      // Validate and format each task
      const formattedTasks = parsedTasks.map((task, index) => {
        if (!task.task) {
          throw new Error(`Task description is missing for task ${index + 1}`);
        }

        return {
          id: Date.now() + index, // Add unique IDs
          name: task.task,
          assignee: task.assignee || "Unassigned",
          dueDate: task.dueDate || null,
          priority: task.priority || "P3",
        };
      });

      res.json(formattedTasks);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      res.status(500).json({
        error: "Failed to parse task data",
        details: parseError.message,
      });
    }
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({
      error: "Failed to process task",
      details: error?.message || error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
