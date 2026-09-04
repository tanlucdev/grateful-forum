import { DesktopProfile } from "./ProfileDesktop";
import { MobileProfile } from "./ProfileMobile";
import type { ProfileView } from "./profile-view";

export function ProfileScreen({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <div className="min-h-svh bg-[#f4fbf8] font-[family-name:var(--font-quicksand)] text-[#161d1b]">
      <DesktopProfile view={view} />
      <MobileProfile view={view} />
    </div>
  );
}
