import { ApiLogin } from "./api-login";
import { ApiLogout } from "./api-logout";
import { ApiProtected } from "./api-protected";
import ServerLogin from "./server-login";
import { ServerLogout } from "./server-logout";
import { getSession } from "./session";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col gap-6 items-center p-24">
      <h1>fastify-iron-session Demo</h1>
      <p>Current session: {JSON.stringify(session, undefined, 4)}</p>
      <ServerLogin />
      <ServerLogout />
      <ApiProtected />
      <ApiLogin />
      <ApiLogout />
    </main>
  );
}
