"use server";

import { z } from "zod";

const IMGBB_API_KEY = "eaba1bc0300ab3681e35e1eef62d2503";

const ImgBBResponseSchema = z.object({
  data: z.object({
    url: z.string().url(),
    display_url: z.string().url(),
    delete_url: z.string().url(),
  }),
  success: z.literal(true),
});

/**
 * Uploads an image (as base64) to ImgBB and returns the hosted URL.
 * Runs server-side so the API key is never exposed to the client.
 */
export async function uploadToImgBB(
  base64Image: string,
  fileName?: string
): Promise<{ url: string; deleteUrl: string } | { error: string }> {
  try {
    // Strip the data URI prefix if present (e.g. "data:image/png;base64,")
    const cleanBase64 = base64Image.includes(",")
      ? (base64Image.split(",")[1] ?? base64Image)
      : base64Image;

    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", cleanBase64);
    if (fileName) {
      formData.append("name", fileName);
    }

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ImgBB upload failed:", text);
      return { error: `Upload failed (HTTP ${res.status})` };
    }

    const json = await res.json();
    const parsed = ImgBBResponseSchema.safeParse(json);

    if (!parsed.success) {
      console.error("ImgBB response validation failed:", parsed.error);
      return { error: "Invalid response from image host" };
    }

    return {
      url: parsed.data.data.display_url,
      deleteUrl: parsed.data.data.delete_url,
    };
  } catch (err) {
    console.error("ImgBB upload error:", err);
    return { error: "Network error during upload" };
  }
}
