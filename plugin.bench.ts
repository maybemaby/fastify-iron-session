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
    request.session.id = "123";

    await request.session.save();

    return { hello: "world" };
  });

  benchAppWithPlugin.get("/read", async (request, reply) => {
    console.log(request.session.id);

    return { hello: "world" };
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
