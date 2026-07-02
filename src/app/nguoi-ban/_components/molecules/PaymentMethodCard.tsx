import React from "react";
import Link from "next/link";
import { ChevronRight, QrCode, Building2, CreditCard, Globe, Wallet, CheckCircle2 } from "lucide-react";
import type { PaymentMethod } from "@/services/wallet";

const methodConfig: Record<string, { icon: React.ReactNode; popular?: boolean }> = {
  vnpay: {
    icon: <QrCode className="w-8 h-8 text-[#009ba1]" strokeWidth={1.5} />,
    popular: true,
  },
  qr: {
    icon: <QrCode className="w-8 h-8 text-[#009ba1]" strokeWidth={1.5} />,
    popular: true,
  },
  bank: {
    icon: <Building2 className="w-8 h-8 text-blue-600" strokeWidth={1.5} />,
    popular: false,
  },
  atm: {
    icon: <CreditCard className="w-8 h-8 text-gray-700" strokeWidth={1.5} />,
    popular: false,
  },
  international: {
    icon: <Globe className="w-8 h-8 text-indigo-600" strokeWidth={1.5} />,
    popular: false,
  },
  momo: {
    icon: <Wallet className="w-8 h-8 text-pink-600" strokeWidth={1.5} />,
    popular: false,
  },
  installment: {
    icon: <CheckCircle2 className="w-8 h-8 text-orange-500" strokeWidth={1.5} />,
    popular: false,
  },
};

function getMethodDetails(code: string, type: string) {
  const normalized = code.toLowerCase();
  const config = methodConfig[normalized];
  if (config) return config;

  if (type === "gateway") {
    return {
      icon: <QrCode className="w-8 h-8 text-[#009ba1]" strokeWidth={1.5} />,
      popular: false,
    };
  }
  return {
    icon: <Wallet className="w-8 h-8 text-gray-600" strokeWidth={1.5} />,
    popular: false,
  };
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
}

export function PaymentMethodCard({ method }: PaymentMethodCardProps) {
  const details = getMethodDetails(method.code, method.type);
  const title = method.name.toLowerCase().startsWith("thanh toán")
    ? method.name
    : `Thanh toán bằng ${method.name}`;

  return (
    <Link
      href={`/nguoi-ban/nap-tien/${method.code}`}
      className="group flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-primary hover:shadow-[0_4px_20px_rgba(224,60,49,0.1)] transition-all cursor-pointer bg-white"
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {details.icon}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-gray-900 text-[17px] group-hover:text-primary transition-colors">
              {title}
            </h3>
            {details.popular && (
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Phổ biến
              </span>
            )}
          </div>
          {method.description && (
            <p className="text-gray-500 text-sm">{method.description}</p>
          )}
        </div>
      </div>
      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
