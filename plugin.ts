import { type FastifyPluginCallback } from "fastify";
import { IronSession, SessionOptions, getIronSession } from "iron-session";
import fp from "fastify-plugin";
export { type IronSession } from "iron-session";

export interface SessionData {
  [key: string]: any;
}

declare module "fastify" {
  interface FastifyRequest {
    session: () => Promise<IronSession<SessionData>>;
  }
}

type IronSessionPluginOptions = SessionOptions & {
  sessionName?: string;
};

const plugin: FastifyPluginCallback<
  IronSessionPluginOptions | IronSessionPluginOptions[]
> = (fastify, opts, done) => {
  const sessionNames = new Map<string, IronSessionPluginOptions>();

  if (Array.isArray(opts)) {
    for (const opt of opts) {
      const sessionName = opt.sessionName || "session";

      sessionNames.set(sessionName, opt);

      fastify.decorateRequest(sessionName, () => null);
    }
  } else {
    const sessionName = opts.sessionName || "session";
    sessionNames.set(sessionName, opts);
    fastify.decorateRequest(sessionName, () => null);
  }

  fastify.addHook("onRequest", async (request, reply) => {
    for (const [sessionName, opts] of sessionNames) {

      // @ts-ignore, end user should be able to create a custom session name and override in declaration
      request[sessionName] = async () => {
        return getIronSession(request.raw, reply.raw, opts);
      };
    }
  });

  done();
};

export default fp(plugin, {
  fastify: "4.x",
  name: "iron-session",
});
