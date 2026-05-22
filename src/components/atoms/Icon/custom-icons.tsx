import React from "react";

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ZaloIcon = ({ size = 24, className, ...props }: CustomIconProps) => (
  <svg
    viewBox="0 0 40 40"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20 2C10.059 2 2 8.761 2 17.1C2 21.6 4.7 25.6 9 28.3C8.4 30.5 7.1 33.6 7 33.8C6.9 34 6.9 34.3 7 34.5C7.1 34.7 7.3 34.9 7.6 34.9C7.8 34.9 12.2 33.7 15.5 31.5C17 31.9 18.5 32.2 20 32.2C29.941 32.2 38 25.439 38 17.1C38 8.761 29.941 2.0 20 2.0ZM15 13H25C25.6 13 26 13.4 26 14C26 14.6 25.6 15 25 15H17.4L26 23.6V24.5C26 25.1 25.6 25.5 25 25.5C24.4 25.5 24 25.1 24 24.5V24.3L15.7 16H15C14.4 16 14 15.6 14 15C14 14.4 14.4 14 15 14H15.0ZM24.5 13.0C25.1 13.0 25.5 13.4 25.5 14C25.5 14.6 25.1 15 24.5 15C23.9 15 23.5 14.6 23.5 14C23.5 13.4 23.9 13.0 24.5 13.0Z" />
  </svg>
);

export const BdsLogo = ({ size = 32, className, ...props }: CustomIconProps) => (
  <div className={`flex items-center gap-1 group cursor-pointer ${className}`}>
    <div
      style={{ width: size, height: size }}
      className="bg-[#E03C31] text-white rounded-sm flex items-center justify-center font-bold text-xl tracking-tight leading-none group-hover:bg-[#c42c23] transition-colors"
    >
      BĐS
    </div>
    <span className="text-[#E03C31] font-bold text-base tracking-tight leading-none group-hover:text-[#c42c23] transition-colors">
      .com.vn
    </span>
  </div>
);
