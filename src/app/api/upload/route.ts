import { NextResponse, type NextRequest } from "next/server";
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
 * POST /api/upload
 * Accepts multipart form data with an "image" file field.
 * Uploads the file to ImgBB and returns the hosted URL.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    // Send to ImgBB
    const imgbbForm = new FormData();
    imgbbForm.append("key", IMGBB_API_KEY);
    imgbbForm.append("image", base64);
    imgbbForm.append("name", file.name);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbForm,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ImgBB upload failed:", text);
      return NextResponse.json(
        { error: `Upload failed (HTTP ${res.status})` },
        { status: 502 }
      );
    }

    const json = await res.json();
    const parsed = ImgBBResponseSchema.safeParse(json);

    if (!parsed.success) {
      console.error("ImgBB response validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Invalid response from image host" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      url: parsed.data.data.display_url,
      deleteUrl: parsed.data.data.delete_url,
    });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
