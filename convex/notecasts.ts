import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// create notecast mutation
export const createNotecast = mutation({
  args: {
    audioStorageId: v.id("_storage"),
    notecastTitle: v.string(),
    notecastDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("notecasts", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      notecastTitle: args.notecastTitle,
      notecastDescription: args.notecastDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// this query will get all the notecasts based on the voiceType of the notecast , which we are showing in the Similar notecasts section.
export const getnotecastByVoiceType = query({
  args: {
    notecastId: v.id("notecasts"),
  },
  handler: async (ctx, args) => {
    const notecast = await ctx.db.get(args.notecastId);

    return await ctx.db
      .query("notecasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), notecast?.voiceType),
          q.neq(q.field("_id"), args.notecastId)
        )
      )
      .collect();
  },
});

// this query will get all the notecasts.
export const getAllnotecasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("notecasts").order("desc").collect();
  },
});

// this query will get the notecast by the notecastId.
export const getnotecastById = query({
  args: {
    notecastId: v.id("notecasts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.notecastId);
  },
});

// this query will get the notecasts based on the views of the notecast , which we are showing in the Trending notecasts section.
export const getTrendingNotecasts = query({
  handler: async (ctx) => {
    const notecast = await ctx.db.query("notecasts").collect();

    return notecast.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// this query will get the notecast by the authorId.
export const getnotecastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const notecasts = await ctx.db
      .query("notecasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = notecasts.reduce(
      (sum, notecast) => sum + notecast.views,
      0
    );

    return { notecasts, listeners: totalListeners };
  },
});

// this query will get the notecast by the search query.
export const getnotecastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("notecasts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("notecasts")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("notecasts")
      .withSearchIndex("search_title", (q) =>
        q.search("notecastTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("notecasts")
      .withSearchIndex("search_body", (q) =>
        q.search("notecastDescription" || "notecastTitle", args.search)
      )
      .take(10);
  },
});

// this mutation will update the views of the notecast.
export const updatenotecastViews = mutation({
  args: {
    notecastId: v.id("notecasts"),
  },
  handler: async (ctx, args) => {
    const notecast = await ctx.db.get(args.notecastId);

    if (!notecast) {
      throw new ConvexError("notecast not found");
    }

    return await ctx.db.patch(args.notecastId, {
      views: notecast.views + 1,
    });
  },
});

// this mutation will delete the notecast.
export const deletenotecast = mutation({
  args: {
    notecastId: v.id("notecasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const notecast = await ctx.db.get(args.notecastId);

    if (!notecast) {
      throw new ConvexError("notecast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.notecastId);
  },
});
