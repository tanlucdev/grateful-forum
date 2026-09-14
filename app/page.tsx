import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { LandingClient } from "./_components/landing/LandingClient";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/feed");

  return <LandingClient />;
}
