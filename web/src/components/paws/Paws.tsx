import './paws.css';

export interface PawsProps {}

export function Paws({}: PawsProps) {
  return (
    <div className="absolute right-0 top-0 w-full max-w-[2040px] aspect-ratio-16/9 overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-full drift" aria-hidden>
        <img
          src="/animations/paws1.001.png"
          className="absolute right-0 top-0 w-full frame-1"
        />
        <img
          src="/animations/paws1.002.png"
          className="absolute right-0 top-0 w-full frame-2"
        />
      </div>
    </div>
  );
}

export default Paws;
