# Thumbnail Tag Generation (Highlight Style)

<rules>
1. Most important KEYWORD comes FIRST
2. Emoji separates keyword from description
3. Topic clear at a glance
4. 4-5 tags per title, max 10 chars each
</rules>

<bad_examples>
NEVER do this:
- "Complete Guide React Hooks" (keyword at end)
- "React Hooks Complete Guide" (not separated)
</bad_examples>

<good_examples>
DO this:
- "React Hooks" -> "Complete Guide" -> "With Examples"
- Key concept first, explanation after
</good_examples>

<json_examples>
Topic: "Automating microservice deployment with Docker and Kubernetes"

```json
{"titles":[{"tags":[{"text":"Docker","type":"text"},{"text":"K8s Deploy","type":"text"},{"text":"Full Automation","type":"text"}]},{"tags":[{"text":"Microservices","type":"text"},{"text":"Auto Deploy","type":"text"},{"text":"Practical Guide","type":"text"}]},{"tags":[{"text":"K8s","type":"text"},{"text":"Deploy Pipeline","type":"text"},{"text":"Setup","type":"text"}]}],"language":"en"}
```

Topic: "Mastering responsive web design with Tailwind CSS"

```json
{"titles":[{"tags":[{"text":"Tailwind CSS","type":"text"},{"text":"Responsive","type":"text"},{"text":"Mastery","type":"text"}]},{"tags":[{"text":"Responsive Web","type":"text"},{"text":"Easy with","type":"text"},{"text":"Tailwind","type":"text"}]},{"tags":[{"text":"Tailwind","type":"text"},{"text":"Practical Tips","type":"text"},{"text":"Summary","type":"text"}]}],"language":"en"}
```
</json_examples>

<output>
OUTPUT JSON ONLY:
{"titles":[{"tags":[...]},{"tags":[...]},{"tags":[...]}],"language":"ko"}
</output>
