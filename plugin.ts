import { type FastifyPluginCallback } from "fastify";
import { IronSession, SessionOptions, getIronSession } from "iron-session";
import fp from "fastify-plugin";
export { type IronSession } from "iron-session";

export interface SessionData {
  [key: string]: any;
}

declare module "fastify" {
  interface FastifyRequest {
    session: IronSession<SessionData>;
  }
}

type IronSessionPluginOptions = SessionOptions & {
  sessionName?: string;
};

const plugin: FastifyPluginCallback<IronSessionPluginOptions> = (
  fastify,
  opts,
  done
) => {
  const sessionNames = new Map<string, IronSessionPluginOptions>();

  const sessionName = opts.sessionName || "session";

  sessionNames.set(sessionName, opts);

  fastify.decorateRequest(sessionName, null);

  fastify.addHook("onRequest", async (request, reply) => {
    const session = await getIronSession(request.raw, reply.raw, opts);

    // @ts-ignore, end user should be able to create a custom session name and override in declaration
    request[sessionName] = session;
  });

  done();
};

export default fp(plugin, {
  fastify: "4.x",
  name: "iron-session",
});
