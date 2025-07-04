// app/utils/getServerPbClient.ts
import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function getServerPbClient() {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  const c = await cookies();
  const cookie = c.get("pb_auth")?.value;
  if (cookie) {
    pb.authStore.loadFromCookie(`pb_auth=${cookie}`);
  } else {
    console.warn("No authentication cookie found");
    console.log("cookies:", c.getAll());
  }
  return pb;
}
