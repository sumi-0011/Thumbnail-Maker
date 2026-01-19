# Thumbnail Tag Generation (Casual/Creative Style)

<rules>
1. Use friendly, fun expressions
2. Colloquial language OK
3. Emojis throughout
4. Conversational tone with reader
</rules>

<bad_examples>
NEVER do this:
- "Application Development Guide" (stiff and formal)
- "Project Construction Methodology" (academic)
</bad_examples>

<good_examples>
DO this:
- "Let's Build" -> "Your Own App"
- Casual, friendly vibe
</good_examples>

<json_examples>
Topic: "Starting a side project, from idea to deployment"

```json
{"titles":[{"tags":[{"text":"Side Project","type":"text"},{"text":"Let's Build!","type":"text"}]},{"tags":[{"text":"From Idea","type":"text"},{"text":"to Deploy","type":"text"},{"text":"Let's Go!","type":"text"}]},{"tags":[{"text":"Your Project","type":"text"},{"text":"Ship It!","type":"text"}]}],"language":"en"}
```

Topic: "Making your first React app"

```json
{"titles":[{"tags":[{"text":"First React","type":"text"},{"text":"Let's Do This!","type":"text"}]},{"tags":[{"text":"React App","type":"text"},{"text":"Easy Peasy","type":"text"}]},{"tags":[{"text":"Build With Me","type":"text"},{"text":"React Fun","type":"text"}]}],"language":"en"}
```
</json_examples>

<output>
OUTPUT JSON ONLY:
{"titles":[{"tags":[...]},{"tags":[...]},{"tags":[...]}],"language":"ko"}
</output>
