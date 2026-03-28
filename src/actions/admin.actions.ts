"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const FIREBASE_URL = "https://wechat-9694d-default-rtdb.firebaseio.com/apps";

// Basic auth check for actions
async function checkAuth() {
  const hasSession = (await cookies()).has('admin_session');
  if (!hasSession) {
    throw new Error("Unauthorized");
  }
}

export async function createProject(data: any) {
  await checkAuth();

  // Validate title is not empty
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) {
    throw new Error("Project title is required");
  }

  // Helper: convert any string to a URL-safe slug
  const toSlug = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  // Always generate a URL-safe slug — even if user typed a custom ID
  const rawId = (typeof data.id === "string" && data.id.trim()) ? data.id.trim() : title;
  const id = toSlug(rawId);

  // Safety: never allow empty id (would overwrite entire /apps node)
  if (!id) {
    throw new Error("Could not generate a valid project ID");
  }
  
  const payload = {
    ...data,
    title, // use the trimmed title
    lastUpdated: Date.now(),
  };

  // Remove the id from the payload so we don't nest it
  const { id: _, ...firebasePayload } = payload;

  const res = await fetch(`${FIREBASE_URL}/${id}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(firebasePayload),
  });

  if (!res.ok) {
    throw new Error("Failed to create project in Firebase");
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: string, data: any) {
  await checkAuth();

  const payload = {
    ...data,
    lastUpdated: Date.now(),
  };

  const { id: _, ...firebasePayload } = payload;

  const res = await fetch(`${FIREBASE_URL}/${id}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(firebasePayload),
  });

  if (!res.ok) {
    throw new Error("Failed to update project in Firebase");
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  await checkAuth();

  const res = await fetch(`${FIREBASE_URL}/${id}.json`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete project");
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
}
