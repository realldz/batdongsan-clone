import React from "react";

interface WalletSummaryProps {
  wallet: {
    total: string;
    main: string;
    promotion: string;
    code?: string;
  };
  variant?: "card" | "flat";
  showCode?: boolean;
  className?: string;
}

export function WalletSummary({
  wallet,
  variant = "card",
  showCode = false,
  className = "",
}: WalletSummaryProps) {
  const containerClasses =
    variant === "card" ? "bg-gray-50 rounded-lg p-3" : "";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số dư</span>
        <span className="font-bold text-primary text-base">{wallet.total}</span>
      </div>
      <div className="space-y-1.5 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <span>Tài khoản chính</span>
          <span className="font-bold text-gray-800">{wallet.main}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Tài khoản khuyến mãi</span>
          <span className="font-bold text-gray-800">{wallet.promotion}</span>
        </div>
      </div>
      {showCode && wallet.code && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          Số tài khoản định danh:{" "}
          <span className="font-bold text-gray-800">{wallet.code}</span>
        </div>
      )}
    </div>
  );
}
