# fastify-iron-session
![GitHub License](https://img.shields.io/github/license/maybemaby/fastify-iron-session) [![npm](https://img.shields.io/npm/v/fastify-iron-session)](https://www.npmjs.com/package/fastify-iron-session)


Fastify plugin for using encrypted sessions through [iron-session](https://github.com/vvo/iron-session?tab=readme-ov-file).

## Install

```
npm i fastify-iron-session
```

## Usage

Registration
```typescript
import ironSession from "fastify-iron-session";

fastify.register(ironSession, {
  // (Optional) Name of session, will decorate the request with this name. Defaults to 'session'
  sessionName: "customSessionName",
  cookieName: "cookieName",
  // String or array of objects used for signing the session cookie, must be at least 32 characters long. See iron-session docs for more information.
  password: "at-least-32-characters-long-password",
  // See iron-session docs for more information
  ttl: 3600, // Seconds, defaults to 2 weeks,
  // (Optional) Per iron-session docs: Any option available from jshttp/cookie#serialize except for encode which is not a Set-Cookie Attribute. See Mozilla Set-Cookie Attributes and Chrome Cookie Fields. Default to:
  cookieOptions: {
  httpOnly: true,
  secure: true, // set this to false in local (non-HTTPS) development
  sameSite: "lax",// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax
  maxAge: (ttl === 0 ? 2147483647 : ttl) - 60, // Expire cookie before the session expires.
  path: "/",
  }
});
```

Setting session data 
```typescript
fastify.post("/login", async (req, reply) => {
  // ...Some login logic
  req.session.id = "abc123";
  req.session.name = "John Doe";

  await req.session.save();

  // Return a response
});
```

Deleting session data
```typescript
fastify.post("/logout", async (req, reply) => {
  // ...Some logout logic
  req.session.destroy();

  // Return a response
});
```

## Session Type Overrides
To override the default session type:

```typescript
declare module "fastify-iron-session" {
  interface SessionData {
    user: {
      id: string;
      name: string;
    };
  }
}
```

If you have a custom session name, you can do:

```typescript
import type { IronSession } from "fastify-iron-session";

declare module "fastify-iron-session" {
  interface SessionData {
    user: {
      id: string;
      name: string;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    customSessionName: IronSession<SessionData>;
  }
}
```

## Todo:

- [ ] Performance improvements (lazy session decorator?)
- [ ] Nextjs example sharing session