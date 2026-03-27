"use client";

export function ZeratypeWordmark({ className = "", color = "white" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 200 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="100"
        y="22"
        textAnchor="middle"
        fill={color}
        fontFamily="var(--font-inter), Inter, sans-serif"
        fontWeight="700"
        fontSize="24"
        letterSpacing="-0.5"
      >
        Zeratype
      </text>
    </svg>
  );
}

export function ZIcon({ className = "", color = "black" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 27 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M26.3066 20.5293L0 27.1387V21.7383L5.64844 17.0693L8.58496 19.6396L26.3066 15.1875V20.5293ZM22.71 14.4287L9.44141 17.8105L3.5957 12.6846L16.8896 9.32715L22.71 14.4287ZM26.3066 5.40039L20.665 10.0615L17.7539 7.49805L0 11.959V6.6084L26.3066 0V5.40039Z"
        fill={color}
        stroke={color}
      />
    </svg>
  );
}
