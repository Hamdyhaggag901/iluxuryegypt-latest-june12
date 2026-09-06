export default function ZigzagDivider({ reverse = false }: { reverse?: boolean }) {
  const patternId = reverse ? "zigzag-divider-reverse" : "zigzag-divider-default";
  const triangleColor = reverse ? "#1F2B44" : "#C8A76C";
  const backgroundColor = reverse ? "#C8A76C" : "#1F2B44";
  return (
    <div
      className="w-full h-6 md:h-9"
      aria-hidden="true"
      data-testid={`zigzag-divider-${reverse ? "reverse" : "default"}`}
    >
      <svg viewBox="0 0 40 10" preserveAspectRatio="none" className="w-full h-full block">
        <defs>
          <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
            <polygon points="0,10 5,0 10,10" fill={triangleColor} />
          </pattern>
        </defs>
        <rect width="40" height="10" fill={backgroundColor} />
        <rect width="40" height="10" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
