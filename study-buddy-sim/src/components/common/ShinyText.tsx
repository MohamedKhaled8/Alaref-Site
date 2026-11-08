import React from "react";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

/**
 * React Bits inspired ShinyText component
 * Adds a kinetic shimmering light sweep across text.
 */
export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className = "",
  speed = 3.5,
}) => {
  return (
    <span
      className={`inline-block bg-[linear-gradient(110deg,#ed6140,40%,#facc15,50%,#ed6140,60%)] bg-[length:250%_100%] bg-clip-text text-transparent animate-pulse font-bold ${className}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
};

