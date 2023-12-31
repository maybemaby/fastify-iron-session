import fastify from "fastify";
import ironSession from "./plugin";
import { bench, describe } from "vitest";

describe("benchmarks", () => {
  const benchAppWithPlugin = fastify();
  const benchAppWithoutPlugin = fastify();

  benchAppWithPlugin.register(ironSession, {
    cookieName: "test",
    password: "at-least-32-characters-long-secret",
  });

  benchAppWithPlugin.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  benchAppWithoutPlugin.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  benchAppWithPlugin.get("/save", async (request, reply) => {
    const session = await request.session();

    session.id = "123";

    await session.save();

    return { hello: "world" };
  });

  benchAppWithPlugin.get("/read", async (request, reply) => {
    const session = await request.session();

    return { hello: "world", id: session.id };
  });

  bench("request with plugin", async () => {
    await benchAppWithPlugin.inject({
      method: "GET",
      url: "/",
    });
  });

  bench("request without plugin", async () => {
    await benchAppWithoutPlugin.inject({
      method: "GET",
      url: "/",
    });
  });

  bench("request with plugin and save session", async () => {
    await benchAppWithPlugin.inject({
      method: "GET",
      url: "/save",
    });
  });

  bench("request with plugin and read session", async () => {
    await benchAppWithPlugin.inject({
      method: "GET",
      url: "/read",
    });
  });
});
