import { getSession } from "./session";

export default async function ServerLogin() {
  async function login() {
    "use server";

    const session = await getSession();
    session.id = "1234";
    session.isLoggedIn = true;
    session.username = "testuser";
    await session.save();
  }

  return (
    <form action={login}>
      <button>Login with server action</button>
    </form>
  );
}
