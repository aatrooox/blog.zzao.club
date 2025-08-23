import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, serial, text, bigint, varchar, datetime, int, foreignKey, mediumtext, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const drizzleMigrations = mysqlTable("__drizzle_migrations__", {
	id: serial().notNull(),
	hash: text().notNull(),
	createdAt: bigint("created_at", { mode: "number" }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "__drizzle_migrations___id"}),
	unique("id").on(table.id),
]);

export const prismaMigrations = mysqlTable("_prisma_migrations", {
	id: varchar({ length: 36 }).notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: datetime("finished_at", { mode: 'string', fsp: 3 }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: datetime("rolled_back_at", { mode: 'string', fsp: 3 }),
	startedAt: datetime("started_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	appliedStepsCount: int("applied_steps_count", { unsigned: true }).default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "_prisma_migrations_id"}),
]);

export const blogAccessToken = mysqlTable("blog_access_token", {
	id: varchar({ length: 191 }).notNull(),
	userId: varchar({ length: 191 }).notNull().references(() => blogUser.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	token: varchar({ length: 191 }).notNull(),
	roles: varchar({ length: 191 }).default('user').notNull(),
	status: int().default(1).notNull(),
	scope: varchar({ length: 191 }).default('all').notNull(),
	isRevoked: tinyint().default(0).notNull(),
	ip: varchar({ length: 191 }),
	expiresAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_access_token_id"}),
	unique("blog_access_token_token_key").on(table.token),
]);

export const blogComment = mysqlTable("blog_comment", {
	id: varchar({ length: 191 }).notNull(),
	content: mediumtext().notNull(),
	createTs: datetime("create_ts", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedTs: datetime("updated_ts", { mode: 'string', fsp: 3 }).notNull(),
	type: varchar({ length: 191 }).default('article').notNull(),
	userId: varchar("user_id", { length: 191 }).references(() => blogUser.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	articleId: varchar("article_id", { length: 191 }),
	visitorName: varchar({ length: 191 }),
	memoId: varchar("memo_id", { length: 191 }).references(() => blogMemos.id, { onDelete: "set null", onUpdate: "cascade" } ),
	quoteContent: varchar({ length: 191 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_comment_id"}),
]);

export const blogExplain = mysqlTable("blog_explain", {
	id: varchar({ length: 191 }).notNull(),
	createTs: datetime("create_ts", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedTs: datetime("updated_ts", { mode: 'string', fsp: 3 }).notNull(),
	content: mediumtext().notNull(),
	articleId: varchar("article_id", { length: 191 }).notNull(),
	text: mediumtext().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_explain_id"}),
]);

export const blogLike = mysqlTable("blog_like", {
	id: int().autoincrement().notNull(),
	createTs: datetime("create_ts", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedTs: datetime("updated_ts", { mode: 'string', fsp: 3 }).notNull(),
	target: varchar({ length: 191 }).default('article').notNull(),
	subCommentId: varchar("sub_comment_id", { length: 191 }).references(() => blogSubComment.id, { onDelete: "set null", onUpdate: "cascade" } ),
	commentId: varchar("comment_id", { length: 191 }).references(() => blogComment.id, { onDelete: "set null", onUpdate: "cascade" } ),
	userId: varchar("user_id", { length: 191 }).notNull().references(() => blogUser.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	articleId: varchar("article_id", { length: 191 }),
	blogMemoId: varchar({ length: 191 }).references(() => blogMemos.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_like_id"}),
]);

export const blogMemoTag = mysqlTable("blog_memo_tag", {
	id: varchar({ length: 191 }).notNull(),
	tagName: varchar("tag_name", { length: 191 }).notNull(),
	createTs: datetime("create_ts", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedTs: datetime("updated_ts", { mode: 'string', fsp: 3 }).notNull(),
	userId: varchar("user_id", { length: 191 }).notNull().references(() => blogUser.id, { onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_memo_tag_id"}),
	unique("blog_memo_tag_tag_name_key").on(table.tagName),
]);

export const blogMemoTagRelations = mysqlTable("blog_memo_tag_relations", {
	tagId: varchar({ length: 191 }).notNull().references(() => blogMemoTag.id, { onUpdate: "cascade" } ),
	memoId: varchar({ length: 191 }).notNull().references(() => blogMemos.id, { onUpdate: "cascade" } ),
	createTs: datetime("create_ts", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedTs: datetime("updated_ts", { mode: 'string', fsp: 3 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.tagId, table.memoId], name: "blog_memo_tag_relations_tagId_memoId"}),
]);

export const blogMemos = mysqlTable("blog_memos", {
	id: varchar({ length: 191 }).notNull(),
	content: mediumtext(),
	createTs: datetime("create_ts", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedTs: datetime("updated_ts", { mode: 'string', fsp: 3 }).notNull(),
	visible: varchar({ length: 191 }).default('public').notNull(),
	defaltFloded: tinyint("defalt_floded").default(0).notNull(),
	flodTip: varchar("flod_tip", { length: 191 }),
	userId: varchar("user_id", { length: 191 }).notNull().references(() => blogUser.id, { onUpdate: "cascade" } ),
	courier: varchar({ length: 191 }),
	from: varchar({ length: 191 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_memos_id"}),
]);

export const blogOauth = mysqlTable("blog_oauth", {
	id: varchar({ length: 191 }).notNull(),
	userId: varchar({ length: 191 }).references(() => blogUser.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	provider: varchar({ length: 191 }).notNull(),
	providerId: varchar({ length: 191 }).notNull(),
	providerToken: varchar({ length: 191 }),
	providerRefreshToken: varchar({ length: 191 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
	providerUnionId: varchar({ length: 191 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_oauth_id"}),
	unique("blog_oauth_provider_providerId_key").on(table.provider, table.providerId),
]);

export const blogSubComment = mysqlTable("blog_sub_comment", {
	id: varchar({ length: 191 }).notNull(),
	content: mediumtext().notNull(),
	createTs: datetime("create_ts", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedTs: datetime("updated_ts", { mode: 'string', fsp: 3 }).notNull(),
	commentId: varchar("comment_id", { length: 191 }).notNull().references(() => blogComment.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	replySubCommentId: varchar("reply_sub_comment_id", { length: 191 }),
	userId: varchar("user_id", { length: 191 }).references(() => blogUser.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_sub_comment_id"}),
]);

export const blogUser = mysqlTable("blog_user", {
	id: varchar({ length: 191 }).notNull(),
	email: varchar({ length: 191 }),
	phone: varchar({ length: 191 }),
	username: varchar({ length: 191 }).notNull(),
	nickname: varchar({ length: 191 }),
	password: varchar({ length: 191 }).notNull(),
	avatarUrl: varchar("avatar_url", { length: 191 }),
	role: varchar({ length: 191 }).default('user').notNull(),
	website: varchar({ length: 191 }),
	status: int().default(1).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_user_id"}),
	unique("blog_user_nickname_key").on(table.nickname),
	unique("blog_user_username_key").on(table.username),
]);

export const blogUserConfig = mysqlTable("blog_user_config", {
	id: varchar({ length: 191 }).notNull(),
	userId: varchar({ length: 191 }).notNull().references(() => blogUser.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	allowEmailNotify: int().default(0),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_user_config_id"}),
	unique("blog_user_config_userId_key").on(table.userId),
]);
