import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
export const get = query({
  args: {},
  async handler(ctx, args) {
    return await ctx.db.query("messages").collect();
  },
});

export const post = internalMutation({
  args: {
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("model")),
  },
  async handler({ db }, { content, role }) {
    await db.insert("messages", {
      content,
      role,
    });
  },
});
