"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  // If ID is not provided, generate a URL-friendly slug from the title
  const id = data.id || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const payload = {
    ...data,
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
