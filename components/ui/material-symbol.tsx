import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Brain,
  Bell,
  CalendarDays,
  Check,
  CircleCheck,
  CirclePlus,
  Clock,
  Cloud,
  Copy,
  Crop,
  EllipsisVertical,
  FileText,
  Flame,
  Flower2,
  Globe,
  Grid2x2,
  Grip,
  HandHeart,
  Heart,
  Image,
  Info,
  KeyRound,
  Leaf,
  Lightbulb,
  Link,
  LogIn,
  LogOut,
  List,
  Lock,
  Medal,
  MapPin,
  Pencil,
  Quote,
  Search,
  Settings,
  Share,
  ShieldCheck,
  SlidersHorizontal,
  SmilePlus,
  Smile,
  Sprout,
  SquarePen,
  Sun,
  Trash,
  Trash2,
  RotateCcw,
  User,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  arrow_back: ArrowLeft,
  arrow_back_ios_new: ArrowLeft,
  arrow_forward: ArrowRight,
  auto_stories: BookOpenText,
  calendar_month: CalendarDays,
  calendar_today: CalendarDays,
  check: Check,
  check_circle: CircleCheck,
  add_circle: CirclePlus,
  close: X,
  cloud_done: Cloud,
  content_copy: Copy,
  crop: Crop,
  delete: Trash2,
  delete_sweep: Trash,
  draft: FileText,
  drafts: FileText,
  eco: Leaf,
  edit: Pencil,
  edit_note: SquarePen,
  edit_square: SquarePen,
  emoji_emotions: Smile,
  favorite: Heart,
  format_quote: Quote,
  grid_view: Grid2x2,
  history: RotateCcw,
  info: Info,
  keyboard_arrow_down: ChevronDown,
  keyboard_arrow_up: ChevronUp,
  link: Link,
  local_fire_department: Flame,
  login: LogIn,
  logout: LogOut,
  military_tech: Medal,
  more_vert: EllipsisVertical,
  nest_eco_leaf: Sprout,
  notifications: Bell,
  lock: Lock,
  vpn_key: KeyRound,
  person: User,
  pin_drop: MapPin,
  photo_library: Image,
  potted_plant: Flower2,
  psychiatry: Brain,
  public: Globe,
  schedule: Clock,
  search: Search,
  settings: Settings,
  share: Share,
  shield: ShieldCheck,
  sentiment_satisfied: SmilePlus,
  spa: Sprout,
  stream: List,
  texture: Grip,
  tips_and_updates: Lightbulb,
  tune: SlidersHorizontal,
  verified: CircleCheck,
  verified_user: ShieldCheck,
  volunteer_activism: HandHeart,
  wb_sunny: Sun,
};

export function MaterialSymbol({
  className = "",
  fill = false,
  name,
}: Readonly<{ className?: string; fill?: boolean; name: string }>) {
  const Icon = iconMap[name];

  if (Icon) {
    return (
      <Icon
        aria-hidden="true"
        className={`inline-block shrink-0 leading-none ${className}`}
        fill={fill ? "currentColor" : "none"}
        focusable="false"
        strokeWidth={2.2}
        style={{ height: "1em", width: "1em" }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[1em] w-[1em] shrink-0 select-none leading-none ${className}`}
    />
  );
}
