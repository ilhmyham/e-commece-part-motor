import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/masuk");
  }
  return session.user;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return redirect("/");
  }
  return session.user;
}
