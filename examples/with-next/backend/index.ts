import fastify from "fastify";
import ironSession from "fastify-iron-session";

declare module "fastify-iron-session" {
  interface SessionData {
    id: string;
    username: string;
    isLoggedIn: boolean;
  }
}

const app = fastify({
  logger: true,
});

app.register(ironSession, {
  cookieName: "example",
  password: "complex_password_at_least_32_characters_long",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
  },
});

app.get("/protected", async (request, reply) => {
  const session = await request.session();

  if (!session.isLoggedIn) {
    reply.status(401);

    return { error: "Unauthorized" };
  }

  return { status: "success" };
});

app.post("/login", async (request, reply) => {
  const session = await request.session();

  session.isLoggedIn = true;
  session.id = "123";
  session.username = "test";

  await session.save();

  return { status: "success" };
});

app.post("/logout", async (request, reply) => {
  const session = await request.session();

  session.isLoggedIn = false;
  session.id = "";
  session.username = "";

  session.destroy();

  return { status: "success" };
});

app.listen({
  port: 5000,
});
