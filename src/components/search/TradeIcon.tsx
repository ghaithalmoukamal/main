import { classNames } from "@/lib/utils";

const ICONS: Record<string, string> = {
  hammer: "🔨",
  anvil: "⚒️",
  zap: "⚡",
  wrench: "🔧",
  paintbrush: "🎨",
  grid: "🔲",
  flame: "🔥",
  layers: "🪟",
  mountain: "⛰️",
  settings: "⚙️",
  disc: "💿",
  square: "🪞",
};

export default function TradeIcon({
  icon,
  className,
}: {
  icon: string | null;
  className?: string;
}) {
  return (
    <span
      className={classNames("inline-block", className)}
      role="img"
      aria-hidden
    >
      {(icon && ICONS[icon]) || "🛠️"}
    </span>
  );
}
