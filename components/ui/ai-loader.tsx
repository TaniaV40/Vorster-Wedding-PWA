import * as React from "react";

interface LoaderProps {
  size?: number; 
}

export const AiLoader: React.FC<LoaderProps> = ({ size = 150 }) => {
  return (
    <div
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full animate-[loaderCircle_5s_linear_infinite]"
      ></div>

      <style>{`
        @keyframes loaderCircle {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 4px 8px 0 rgba(225, 179, 130, 0.4) inset,
              0 8px 12px 0 rgba(212, 175, 55, 0.4) inset,
              0 24px 24px 0 rgba(197, 160, 89, 0.3) inset,
              0 0 2px 1px rgba(225, 179, 130, 0.2),
              0 0 4px 1.5px rgba(212, 175, 55, 0.1);
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 4px 8px 0 rgba(249, 226, 156, 0.6) inset,
              0 8px 4px 0 rgba(225, 179, 130, 0.6) inset,
              0 16px 24px 0 rgba(212, 175, 55, 0.5) inset,
              0 0 2px 1px rgba(249, 226, 156, 0.2),
              0 0 4px 1.5px rgba(225, 179, 130, 0.1);
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 4px 8px 0 rgba(225, 179, 130, 0.4) inset,
              0 8px 12px 0 rgba(212, 175, 55, 0.4) inset,
              0 24px 24px 0 rgba(197, 160, 89, 0.3) inset,
              0 0 2px 1px rgba(225, 179, 130, 0.2),
              0 0 4px 1.5px rgba(212, 175, 55, 0.1);
          }
        }
      `}</style>
    </div>
  );
};
