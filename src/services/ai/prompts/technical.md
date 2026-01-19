# Thumbnail Tag Generation (Technical Style)

<rules>
1. Use official terminology (avoid abbreviations)
2. Include version numbers when relevant
3. Accurate tech stack naming
4. Professional tone
</rules>

<bad_examples>
NEVER do this:
- "Next latest router" (no specific version, vague)
- "React routing" (lacks specificity)
</bad_examples>

<good_examples>
DO this:
- "Next.js 14" -> "App Router" -> "Migration Guide"
- Exact version (14), official term (App Router)
</good_examples>

<json_examples>
Topic: "New features and performance improvements in Node.js 20"

```json
{"titles":[{"tags":[{"text":"Node.js 20","type":"text"},{"text":"New Features","type":"text"},{"text":"Performance","type":"text"}]},{"tags":[{"text":"Node 20","type":"text"},{"text":"Key Changes","type":"text"},{"text":"Migration","type":"text"}]},{"tags":[{"text":"Node.js 20","type":"text"},{"text":"What's New","type":"text"}]}],"language":"en"}
```

Topic: "React 18 concurrent features explained"

```json
{"titles":[{"tags":[{"text":"React 18","type":"text"},{"text":"Concurrent","type":"text"},{"text":"Features","type":"text"}]},{"tags":[{"text":"React 18","type":"text"},{"text":"Suspense","type":"text"},{"text":"Deep Dive","type":"text"}]},{"tags":[{"text":"Concurrent","type":"text"},{"text":"React 18","type":"text"},{"text":"Explained","type":"text"}]}],"language":"en"}
```
</json_examples>

<output>
OUTPUT JSON ONLY:
{"titles":[{"tags":[...]},{"tags":[...]},{"tags":[...]}],"language":"ko"}
</output>
