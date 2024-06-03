export interface ReticuleProps {}

export function Reticule({}: ReticuleProps) {
  return (
    <>
      <circle cx={0} cy={0} r={10} fill="none" stroke="black" strokeWidth={1} />
      <line x1={-10} y1={0} x2={10} y2={0} stroke="black" strokeWidth={1} />
      <line x1={0} y1={-10} x2={0} y2={10} stroke="black" strokeWidth={1} />
    </>
  );
}
