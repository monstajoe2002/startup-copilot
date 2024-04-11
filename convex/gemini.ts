"use node";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export const generate = action({
  args: {
    prompt: v.string(),
  },
  async handler(ctx, { prompt }) {
    await ctx.runMutation(internal.messages.post, {
      content: prompt,
      role: "user",
    });
    const model = genAi.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7, // the "randomness" of the response
      },
    });
    const result = await model.generateContent(`
      You are an AI assistant that helps users with startups. 
      Your job is to ask users what idea they have for their next billion-dollar business.
      For example, if the user provides you with: "${prompt}", then you must provide the follwing:
      - starter tips
      - how to validate the idea
      - marketing
      - scaling to millions
      - how to keep growing
      If the idea is a SaaS product, mention ways to implent it and what parts of the stack a developer may need.
      Remember this is not a one-size-fits-all approach, so be creative!  
      Also, expect any follow-up questions about the same idea.
    `);
    const response = result.response;
    const text = response.text();
    await ctx.runMutation(internal.messages.post, {
      content: text,
      role: "model",
    });
  },
});
