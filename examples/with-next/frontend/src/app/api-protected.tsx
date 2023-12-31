"use client";

import { useEffect, useState } from "react";

export function ApiProtected() {
  const [res, setRes] = useState<unknown>();

  const fetchApiProtected = async () => {
    const protectedRes = await fetch("/api/protected");

    setRes(await protectedRes.json());
  };

  useEffect(() => {
    (async () => {
      await fetchApiProtected();
    })();
  }, []);

  return (
    <div>
      <h2>API /protected</h2>
      <p>{JSON.stringify(res)}</p>
    </div>
  );
}
