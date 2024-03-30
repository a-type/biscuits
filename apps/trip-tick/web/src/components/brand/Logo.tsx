export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img src="/icon.png" className={className ?? 'w-12'} alt="Trip Tick icon" />
  );
}
