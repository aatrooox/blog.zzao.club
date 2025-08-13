import { relations } from 'drizzle-orm'
import {
  boolean,
  datetime,
  decimal,
  int,
  mediumtext,
  mysqlTable,
  primaryKey,
  text,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core'

// 用户表
export const users = mysqlTable('blog_user', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 255 }),
  username: varchar('username', { length: 255 }).notNull().unique(),
  nickname: varchar('nickname', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  website: varchar('website', { length: 255 }),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  status: int('status').notNull().default(1),
})

// 用户配置表
export const userConfigs = mysqlTable('blog_user_config', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  userId: varchar('userId', { length: 255 }).notNull().unique(),
  allowEmailNotify: int('allowEmailNotify').default(0),
  createdAt: datetime('createdAt').notNull().default(new Date()),
  updatedAt: datetime('updatedAt').notNull().default(new Date()).$onUpdate(() => new Date()),
})

// 访问令牌表
export const accessTokens = mysqlTable('blog_access_token', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  userId: varchar('userId', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  roles: varchar('roles', { length: 255 }).notNull().default('user'),
  status: int('status').notNull().default(1),
  scope: varchar('scope', { length: 255 }).notNull().default('all'),
  isRevoked: boolean('isRevoked').notNull().default(false),
  ip: varchar('ip', { length: 255 }),
  expiresAt: datetime('expiresAt').notNull(),
  createdAt: datetime('createdAt').notNull().default(new Date()),
  updatedAt: datetime('updatedAt').notNull().default(new Date()).$onUpdate(() => new Date()),
})

// 第三方登录表
export const oauths = mysqlTable('blog_oauth', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  userId: varchar('userId', { length: 255 }),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerId: varchar('providerId', { length: 255 }).notNull(),
  providerUnionId: varchar('providerUnionId', { length: 255 }),
  providerToken: varchar('providerToken', { length: 255 }),
  providerRefreshToken: varchar('providerRefreshToken', { length: 255 }),
  createdAt: datetime('createdAt').notNull().default(new Date()),
  updatedAt: datetime('updatedAt').notNull().default(new Date()).$onUpdate(() => new Date()),
}, table => ({
  providerUnique: unique().on(table.provider, table.providerId),
}))

// 博客评论表
export const blogComments = mysqlTable('blog_comment', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  content: mediumtext('content').notNull(),
  createTs: datetime('create_ts').notNull().default(new Date()),
  updatedTs: datetime('updated_ts').notNull().default(new Date()).$onUpdate(() => new Date()),
  type: varchar('type', { length: 50 }).notNull().default('article'),
  quoteContent: text('quoteContent'),
  articleId: varchar('article_id', { length: 255 }),
  userId: varchar('user_id', { length: 255 }),
  visitorName: varchar('visitorName', { length: 255 }),
  memoId: varchar('memo_id', { length: 255 }),
})

// 博客解释表
export const blogExplains = mysqlTable('blog_explain', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  createTs: datetime('create_ts').notNull().default(new Date()),
  updatedTs: datetime('updated_ts').notNull().default(new Date()).$onUpdate(() => new Date()),
  text: mediumtext('text').notNull(),
  content: mediumtext('content').notNull(),
  articleId: varchar('article_id', { length: 255 }).notNull(),
})

// 博客子评论表
export const blogSubComments = mysqlTable('blog_sub_comment', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  content: mediumtext('content').notNull(),
  createTs: datetime('create_ts').notNull().default(new Date()),
  updatedTs: datetime('updated_ts').notNull().default(new Date()).$onUpdate(() => new Date()),
  commentId: varchar('comment_id', { length: 255 }).notNull(),
  replySubCommentId: varchar('reply_sub_comment_id', { length: 255 }),
  userId: varchar('user_id', { length: 255 }),
})

// 博客点赞表
export const blogLikes = mysqlTable('blog_like', {
  id: int('id').primaryKey().autoincrement(),
  createTs: datetime('create_ts').notNull().default(new Date()),
  updatedTs: datetime('updated_ts').notNull().default(new Date()).$onUpdate(() => new Date()),
  target: varchar('target', { length: 50 }).notNull().default('article'),
  articleId: varchar('article_id', { length: 255 }),
  subCommentId: varchar('sub_comment_id', { length: 255 }),
  commentId: varchar('comment_id', { length: 255 }),
  userId: varchar('user_id', { length: 255 }).notNull(),
  blogMemoId: varchar('blogMemoId', { length: 255 }),
})

// 博客备忘录表
export const blogMemos = mysqlTable('blog_memos', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  content: mediumtext('content'),
  createTs: datetime('create_ts').notNull().default(new Date()),
  updatedTs: datetime('updated_ts').notNull().default(new Date()).$onUpdate(() => new Date()),
  visible: varchar('visible', { length: 50 }).notNull().default('public'),
  defaltFloded: boolean('defalt_floded').notNull().default(false),
  flodTip: varchar('flod_tip', { length: 255 }),
  userId: varchar('user_id', { length: 255 }).notNull(),
  from: varchar('from', { length: 255 }),
  courier: varchar('courier', { length: 255 }),
})

// 备忘录标签表
export const memoTags = mysqlTable('blog_memo_tag', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  tagName: varchar('tag_name', { length: 255 }).notNull().unique(),
  createTs: datetime('create_ts').notNull().default(new Date()),
  updatedTs: datetime('updated_ts').notNull().default(new Date()).$onUpdate(() => new Date()),
  userId: varchar('user_id', { length: 255 }).notNull(),
})

// 备忘录标签关系表
export const memoTagRelations = mysqlTable('blog_memo_tag_relations', {
  tagId: varchar('tagId', { length: 255 }).notNull(),
  memoId: varchar('memoId', { length: 255 }).notNull(),
  createTs: datetime('create_ts').notNull().default(new Date()),
  updatedTs: datetime('updated_ts').notNull().default(new Date()).$onUpdate(() => new Date()),
}, table => ({
  pk: primaryKey({ columns: [table.tagId, table.memoId] }),
}))

// Garmin 活动表
export const garminActivities = mysqlTable('blog_garmin_activity', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID().slice(0, 7)),
  activityType: varchar('activity_type', { length: 255 }).notNull(),
  date: datetime('date').notNull(),
  isFavorite: boolean('is_favorite').notNull(),
  title: varchar('title', { length: 255 }),
  distance: decimal('distance', { precision: 8, scale: 2 }),
  calories: int('calories').notNull(),
  duration: decimal('duration', { precision: 10, scale: 2 }).notNull(),
  movingTime: decimal('moving_time', { precision: 10, scale: 2 }),
  elapsedTime: decimal('elapsed_time', { precision: 10, scale: 2 }),
  avgHr: int('avg_hr'),
  maxHr: int('max_hr'),
  aerobicEffect: decimal('aerobic_effect', { precision: 3, scale: 1 }),
  trainingStressScore: decimal('training_stress_score', { precision: 5, scale: 1 }),
  avgPace: decimal('avg_pace', { precision: 5, scale: 2 }),
  bestPace: decimal('best_pace', { precision: 5, scale: 2 }),
  totalStrokes: int('total_strokes'),
  avgSwolf: int('avg_swolf'),
  avgStrokeRate: int('avg_stroke_rate'),
  steps: int('steps'),
  totalReps: int('total_reps'),
  totalSets: int('total_sets'),
  isGrit: boolean('is_grit'),
  bestLapTime: decimal('best_lap_time', { precision: 8, scale: 2 }),
  lapCount: int('lap_count'),
  createdAt: datetime('created_at').notNull().default(new Date()),
  updatedAt: datetime('updated_at').notNull().default(new Date()).$onUpdate(() => new Date()),
}, table => ({
  dateActivityUnique: unique().on(table.date, table.activityType),
}))

// 关系定义
export const usersRelations = relations(users, ({ one, many }) => ({
  userConfig: one(userConfigs, {
    fields: [users.id],
    references: [userConfigs.userId],
  }),
  comments: many(blogComments),
  subComments: many(blogSubComments),
  likes: many(blogLikes),
  oauths: many(oauths),
  tokens: many(accessTokens),
  memos: many(blogMemos),
  tags: many(memoTags),
}))

export const userConfigsRelations = relations(userConfigs, ({ one }) => ({
  user: one(users, {
    fields: [userConfigs.userId],
    references: [users.id],
  }),
}))

export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  user: one(users, {
    fields: [accessTokens.userId],
    references: [users.id],
  }),
}))

export const oauthsRelations = relations(oauths, ({ one }) => ({
  user: one(users, {
    fields: [oauths.userId],
    references: [users.id],
  }),
}))

export const blogCommentsRelations = relations(blogComments, ({ one, many }) => ({
  user: one(users, {
    fields: [blogComments.userId],
    references: [users.id],
  }),
  memo: one(blogMemos, {
    fields: [blogComments.memoId],
    references: [blogMemos.id],
  }),
  subComments: many(blogSubComments),
  likes: many(blogLikes),
}))

export const blogSubCommentsRelations = relations(blogSubComments, ({ one, many }) => ({
  comment: one(blogComments, {
    fields: [blogSubComments.commentId],
    references: [blogComments.id],
  }),
  user: one(users, {
    fields: [blogSubComments.userId],
    references: [users.id],
  }),
  likes: many(blogLikes),
}))

export const blogLikesRelations = relations(blogLikes, ({ one }) => ({
  user: one(users, {
    fields: [blogLikes.userId],
    references: [users.id],
  }),
  comment: one(blogComments, {
    fields: [blogLikes.commentId],
    references: [blogComments.id],
  }),
  subComment: one(blogSubComments, {
    fields: [blogLikes.subCommentId],
    references: [blogSubComments.id],
  }),
  memo: one(blogMemos, {
    fields: [blogLikes.blogMemoId],
    references: [blogMemos.id],
  }),
}))

export const blogMemosRelations = relations(blogMemos, ({ one, many }) => ({
  user: one(users, {
    fields: [blogMemos.userId],
    references: [users.id],
  }),
  tags: many(memoTagRelations),
  comments: many(blogComments),
  likes: many(blogLikes),
}))

export const memoTagsRelations = relations(memoTags, ({ one, many }) => ({
  user: one(users, {
    fields: [memoTags.userId],
    references: [users.id],
  }),
  memos: many(memoTagRelations),
}))

export const memoTagRelationsRelations = relations(memoTagRelations, ({ one }) => ({
  tag: one(memoTags, {
    fields: [memoTagRelations.tagId],
    references: [memoTags.id],
  }),
  memo: one(blogMemos, {
    fields: [memoTagRelations.memoId],
    references: [blogMemos.id],
  }),
}))
