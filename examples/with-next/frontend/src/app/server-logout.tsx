import { getSession } from "./session";

export async function ServerLogout() {
  async function logout() {
    "use server";

    const session = await getSession();
    session.destroy();
  }

  return (
    <form action={logout}>
      <button>Logout with server action</button>
    </form>
  );
}
