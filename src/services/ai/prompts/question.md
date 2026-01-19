# Thumbnail Tag Generation (Question Style)

<rules>
1. Tags must form a COMPLETE SENTENCE when read together
2. Pattern: **Topic + question emoji + Answer**
3. Max 10 characters per tag, 4-5 tags per title
4. NO keyword lists - must flow naturally
</rules>

<bad_examples>
NEVER do this:
- "Design" -> "System" -> "Team" (just keywords)
- "React" -> "Performance" -> "Optimization" (no flow)
- "TypeScript" -> "Type" -> "Error" (meaningless)
</bad_examples>

<good_examples>
DO this:
- "Design System" -> "how to build?" -> "Guide"
- "React Performance" -> "why slow?" -> "Optimization Tips"
- "Type Error" -> "why not working?" -> "Solution"
</good_examples>

<json_examples>
Topic: "How to efficiently build a design system"

```json
{"titles":[{"tags":[{"text":"Design System","type":"text"},{"text":"how to build?","type":"text"},{"text":"Guide","type":"text"}]},{"tags":[{"text":"UI Components","type":"text"},{"text":"where to start?","type":"text"},{"text":"Getting Started","type":"text"}]},{"tags":[{"text":"Consistent Design","type":"text"},{"text":"what's the secret?","type":"text"}]}],"language":"ko"}
```

Topic: "Comparing React state management libraries"

```json
{"titles":[{"tags":[{"text":"State Management","type":"text"},{"text":"which one?","type":"text"},{"text":"Full Comparison","type":"text"}]},{"tags":[{"text":"Redux vs Zustand","type":"text"},{"text":"which is better?","type":"text"}]},{"tags":[{"text":"State Management","type":"text"},{"text":"confused?","type":"text"},{"text":"Check This","type":"text"}]}],"language":"ko"}
```
</json_examples>

<output>
OUTPUT JSON ONLY:
{"titles":[{"tags":[...]},{"tags":[...]},{"tags":[...]}],"language":"ko"}
</output>
