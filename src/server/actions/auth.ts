"use server";

import { signUpSchema, signInSchema } from "@/validators/auth";

const API_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export async function actionSignUp(data: unknown) {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_URL,
      },
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
        role: "customer",
        phone: parsed.data.phone,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || "Gagal mendaftar" };
    }

    return { ok: true };
  } catch (err) {
    return { error: String(err) };
  }
}

export async function actionSignIn(data: unknown) {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": API_URL,
      },
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });

    if (!response.ok) {
      return { error: "Email atau password salah" };
    }

    return { ok: true };
  } catch (err) {
    return { error: String(err) };
  }
}
