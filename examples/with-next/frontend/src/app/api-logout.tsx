"use client";

import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

export function ApiLogout() {
  const router = useRouter();
  const logout = async () => {
    const loginRes = await fetch("/api/logout", {
      method: "POST",
    });

    router.refresh();
  };

  return (
    <div>
      <button onClick={logout}>Logout with API</button>
    </div>
  );
}
