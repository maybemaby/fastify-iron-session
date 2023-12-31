import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export interface SessionData {
  id: string;
  username: string;
  isLoggedIn: boolean;
}

export async function getSession() {
  return getIronSession<SessionData>(cookies(), {
    cookieName: "example",
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
    },
  });
}
