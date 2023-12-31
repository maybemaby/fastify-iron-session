import { describe, expect, it } from "vitest";
import ironSession from "./plugin";
import fastify from "fastify";
import { unsealData } from "iron-session";

const testCookieName = "test";
const testPassword = "at-least-32-characters-long-secret";

function setupApp() {
  const app = fastify();

  app.register(ironSession, {
    cookieName: testCookieName,
    password: testPassword,
  });

  return app;
}

describe("plugin", () => {
  const testApp = fastify();

  testApp.register(ironSession, {
    cookieName: testCookieName,
    password: testPassword,
  });

  testApp.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  describe("initialization", () => {
    it("should be able to register the plugin", async () => {
      const app = fastify();
      await app.register(ironSession, {
        cookieName: testCookieName,
        password: testPassword,
      });

      expect(app.hasPlugin("iron-session")).toBeTruthy();
    });

    it("should be able to register plugin with different session names", async () => {
      const app = fastify();
      await app.register(ironSession, [
        {
          cookieName: testCookieName,
          password: testPassword,
        },
        {
          sessionName: "another-session",
          cookieName: "another-session",
          password: testPassword,
        },
      ]);

      expect(app.hasPlugin("iron-session")).toBeTruthy();
    });
  });

  describe("requests", () => {
    it("should be able to complete a request", async () => {
      const response = await testApp.inject({
        method: "GET",
        url: "/",
      });

      expect(response.statusCode).toBe(200);
    });

    it("should not have a null session", async () => {
      const _app = setupApp();

      _app.get("/session1", async (req, reply) => {
        expect(req.session).not.toBeNull();

        return { hello: "world" };
      });

      const res = await _app.inject({
        method: "GET",
        url: "/session1",
      });

      expect(res.statusCode).toBe(200);
    });

    it("should be able to set a session value", async () => {
      const _app = setupApp();

      _app.get("/session2", async (req, reply) => {
        req.session.id = "123";

        await req.session.save();

        return { hello: "world" };
      });

      // Will throw an error within the request and return a 500 if the session is not set
      _app.get("/session-check", async (req, reply) => {
        expect(req.session.id).toBe("123");

        return { hello: "world" };
      });

      const res = await _app.inject({
        method: "GET",
        url: "/session2",
      });

      const res2 = await _app.inject({
        method: "GET",
        url: "/session-check",
        // Nede to pass the cookies from the previous request
        cookies: {
          [testCookieName]: res.cookies[0].value,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toHaveProperty("length");
      expect(res2.statusCode).toBe(200);
    });
  });
});
