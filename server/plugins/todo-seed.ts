import { count } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoTags } from '~~/lib/drizzle/schema'

const PRESET_TAGS = [
  { name: 'bug', color: 'error' },
  { name: 'feature', color: 'primary' },
  { name: 'enhancement', color: 'secondary' },
  { name: 'question', color: 'warning' },
  { name: 'documentation', color: 'neutral' },
  { name: 'design', color: 'info' },
  { name: 'performance', color: 'success' },
  { name: 'security', color: 'error' },
  { name: 'urgent', color: 'error' },
  { name: 'wontfix', color: 'neutral' },
]

export default defineNitroPlugin(async () => {
  try {
    const [{ value: existingCount }] = await db.select({ value: count() }).from(todoTags)
    if (existingCount === 0) {
      for (const tag of PRESET_TAGS) {
        await db.insert(todoTags).values({
          id: crypto.randomUUID(),
          name: tag.name,
          color: tag.color,
        }).catch(() => {})
      }
      console.log('[todo-seed] Seeded', PRESET_TAGS.length, 'preset tags')
    }
  }
  catch (e) {
    // DB might not be ready yet or tables might not exist — skip silently
    console.warn('[todo-seed] Skipped seed:', e instanceof Error ? e.message : e)
  }
})
