'use client';

interface RingProps {
  value: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
}

export function NutritionRing({ value, max, color, size = 120, strokeWidth = 10, label, unit = 'g' }: RingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  const displayValue = Math.round(value);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{displayValue}</span>
          <span className="text-[10px] text-white/40">{unit}</span>
        </div>
      </div>
      {label && <span className="text-xs text-white/50 font-medium">{label}</span>}
    </div>
  );
}

interface MacroBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

export function MacroBar({ label, value, max, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-white/60 font-medium">{label}</span>
        <span className="text-white/80">
          <span className="font-semibold" style={{ color }}>{Math.round(value)}</span>
          <span className="text-white/40">/{max}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
