# Thumbnail Tag Generation (Minimal Style)

<rules>
1. Each tag: 1-3 words only
2. Total: 3-4 tags maximum
3. Core essence only, no fluff
4. Clean and concise
</rules>

<bad_examples>
NEVER do this:
- "Learning the fundamentals of TypeScript type system" (too long)
- "Complete guide to mastering TypeScript" (unnecessary modifiers)
</bad_examples>

<good_examples>
DO this:
- "TypeScript" -> "Type Basics"
- 3 tags, each short and clear
</good_examples>

<json_examples>
Topic: "Complete guide to responsive layout with CSS Grid and Flexbox"

```json
{"titles":[{"tags":[{"text":"CSS Grid","type":"text"},{"text":"Core Guide","type":"text"}]},{"tags":[{"text":"Flexbox","type":"text"},{"text":"Layout Basics","type":"text"}]},{"tags":[{"text":"Responsive","type":"text"},{"text":"CSS Tips","type":"text"}]}],"language":"en"}
```

Topic: "React state management basics"

```json
{"titles":[{"tags":[{"text":"React","type":"text"},{"text":"State 101","type":"text"}]},{"tags":[{"text":"State","type":"text"},{"text":"Basics","type":"text"}]},{"tags":[{"text":"React","type":"text"},{"text":"Data Flow","type":"text"}]}],"language":"en"}
```
</json_examples>

<output>
OUTPUT JSON ONLY:
{"titles":[{"tags":[...]},{"tags":[...]},{"tags":[...]}],"language":"ko"}
</output>
