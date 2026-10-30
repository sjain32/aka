/* The "jump cut" A mark (Akash logo system): the letter is sliced at the
   crossbar and its legs have slipped sideways — the final frame of the
   Jump Cut loader. The top follows `color` (currentColor); legs are accented. */

export const MARK_TOP_PATH = 'M50 6 L77 60 L53 60 L50 54 L47 60 L23 60 Z';
export const MARK_LEG_PATHS = [
  'M56 66 L80 66 L94 94 L70 94 Z',
  'M20 66 L44 66 L30 94 L6 94 Z',
];
/** How far the legs sit slipped to the right once the cut has landed */
export const LEG_SLIP = 5;

interface AkashMarkProps {
  size?: number;
  accentColor?: string;
  className?: string;
  title?: string;
}

export default function AkashMark({
  size = 28,
  accentColor = 'var(--accent)',
  className,
  title,
}: AkashMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g transform="translate(-2.5 0)">
        <path d={MARK_TOP_PATH} fill="currentColor" />
        <g transform={`translate(${LEG_SLIP} 0)`} fill={accentColor}>
          {MARK_LEG_PATHS.map(d => <path key={d} d={d} />)}
        </g>
      </g>
    </svg>
  );
}
