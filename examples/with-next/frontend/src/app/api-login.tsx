"use client";

import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

export function ApiLogin() {
  const router = useRouter();
  const login = async () => {
    const loginRes = await fetch("/api/login", {
      method: "POST",
    });

    router.refresh();    
  };

  return (
    <div>
      <button onClick={login}>Login with API</button>
    </div>
  );
}
