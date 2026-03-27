"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "admin@example.com" && password === "password") {
    // Set a simple cookie
    (await cookies()).set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    redirect("/admin");
  } else {
    return { error: "Invalid credentials" };
  }
}

export async function logout() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}
