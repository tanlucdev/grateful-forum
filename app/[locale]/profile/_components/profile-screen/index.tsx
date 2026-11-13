import { DesktopProfile } from "../profile-desktop";
import { MobileProfile } from "../profile-mobile";
import type { ProfileView } from "../profile-view";

export function ProfileScreen({
  initialTab,
  view,
}: Readonly<{ initialTab: "all" | "public" | "moments" | "saved"; view: ProfileView }>) {
  return (
    <div className="min-h-svh font-[family-name:var(--font-quicksand)] text-foreground">
      <DesktopProfile initialTab={initialTab} view={view} />
      <MobileProfile initialTab={initialTab} view={view} />
    </div>
  );
}
