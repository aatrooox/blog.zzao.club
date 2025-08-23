import { relations } from "drizzle-orm/relations";
import { blogUser, blogAccessToken, blogMemos, blogComment, blogLike, blogSubComment, blogMemoTag, blogMemoTagRelations as blogMemoTagRelationsSchema, blogOauth, blogUserConfig } from "./schema";

export const blogAccessTokenRelations = relations(blogAccessToken, ({one}) => ({
	blogUser: one(blogUser, {
		fields: [blogAccessToken.userId],
		references: [blogUser.id]
	}),
}));

export const blogUserRelations = relations(blogUser, ({many}) => ({
	blogAccessTokens: many(blogAccessToken),
	blogComments: many(blogComment),
	blogLikes: many(blogLike),
	blogMemoTags: many(blogMemoTag),
	blogMemos: many(blogMemos),
	blogOauths: many(blogOauth),
	blogSubComments: many(blogSubComment),
	blogUserConfigs: many(blogUserConfig),
}));

export const blogCommentRelations = relations(blogComment, ({one, many}) => ({
	blogMemo: one(blogMemos, {
		fields: [blogComment.memoId],
		references: [blogMemos.id]
	}),
	blogUser: one(blogUser, {
		fields: [blogComment.userId],
		references: [blogUser.id]
	}),
	blogLikes: many(blogLike),
	blogSubComments: many(blogSubComment),
}));

export const blogMemosRelations = relations(blogMemos, ({one, many}) => ({
	blogComments: many(blogComment),
	blogLikes: many(blogLike),
	blogMemoTagRelations: many(blogMemoTagRelationsSchema),
	blogUser: one(blogUser, {
		fields: [blogMemos.userId],
		references: [blogUser.id]
	}),
}));

export const blogLikeRelations = relations(blogLike, ({one}) => ({
	blogMemo: one(blogMemos, {
		fields: [blogLike.blogMemoId],
		references: [blogMemos.id]
	}),
	blogComment: one(blogComment, {
		fields: [blogLike.commentId],
		references: [blogComment.id]
	}),
	blogSubComment: one(blogSubComment, {
		fields: [blogLike.subCommentId],
		references: [blogSubComment.id]
	}),
	blogUser: one(blogUser, {
		fields: [blogLike.userId],
		references: [blogUser.id]
	}),
}));

export const blogSubCommentRelations = relations(blogSubComment, ({one, many}) => ({
	blogLikes: many(blogLike),
	blogComment: one(blogComment, {
		fields: [blogSubComment.commentId],
		references: [blogComment.id]
	}),
	blogUser: one(blogUser, {
		fields: [blogSubComment.userId],
		references: [blogUser.id]
	}),
}));

export const blogMemoTagRelations = relations(blogMemoTag, ({one, many}) => ({
	blogUser: one(blogUser, {
		fields: [blogMemoTag.userId],
		references: [blogUser.id]
	}),
	blogMemoTagRelations: many(blogMemoTagRelationsSchema),
}));

export const blogMemoTagRelationsRelations = relations(blogMemoTagRelationsSchema, ({one}) => ({
	blogMemo: one(blogMemos, {
		fields: [blogMemoTagRelationsSchema.memoId],
		references: [blogMemos.id]
	}),
	blogMemoTag: one(blogMemoTag, {
		fields: [blogMemoTagRelationsSchema.tagId],
		references: [blogMemoTag.id]
	}),
}));

export const blogOauthRelations = relations(blogOauth, ({one}) => ({
	blogUser: one(blogUser, {
		fields: [blogOauth.userId],
		references: [blogUser.id]
	}),
}));

export const blogUserConfigRelations = relations(blogUserConfig, ({one}) => ({
	blogUser: one(blogUser, {
		fields: [blogUserConfig.userId],
		references: [blogUser.id]
	}),
}));