# Thumbnail Tag Generation (Narrative Style)

<rules>
1. Break title into naturally flowing sentence fragments
2. Particles/prepositions attach to preceding word
3. Reading order creates complete meaning
4. 4-5 tags per title, max 10 chars each
</rules>

<bad_examples>
NEVER do this:
- Single long chunk: "Frontend developer's view on separation of concerns"
- Wrong order: "Separation" -> "Frontend" -> "Looking at"
</bad_examples>

<good_examples>
DO this:
- "Frontend" -> "Developer's View" -> "on" -> "Separation of Concerns"
- Flow naturally when read together
</good_examples>

<json_examples>
Topic: "TypeScript generics for type-safe API client"

```json
{"titles":[{"tags":[{"text":"TypeScript","type":"text"},{"text":"with Generics","type":"text"},{"text":"Type-Safe","type":"text"},{"text":"API Client","type":"text"}]},{"tags":[{"text":"Using Generics","type":"text"},{"text":"to Build","type":"text"},{"text":"Safe APIs","type":"text"}]},{"tags":[{"text":"Type-Safe","type":"text"},{"text":"API Client","type":"text"},{"text":"with Generics","type":"text"}]}],"language":"en"}
```

Topic: "What I learned migrating to Next.js 13 App Router"

```json
{"titles":[{"tags":[{"text":"Migrating to","type":"text"},{"text":"Next.js 13","type":"text"},{"text":"Lessons Learned","type":"text"}]},{"tags":[{"text":"App Router","type":"text"},{"text":"Migration","type":"text"},{"text":"Insights","type":"text"}]},{"tags":[{"text":"From Migration","type":"text"},{"text":"What I","type":"text"},{"text":"Discovered","type":"text"}]}],"language":"en"}
```
</json_examples>

<output>
OUTPUT JSON ONLY:
{"titles":[{"tags":[...]},{"tags":[...]},{"tags":[...]}],"language":"ko"}
</output>
