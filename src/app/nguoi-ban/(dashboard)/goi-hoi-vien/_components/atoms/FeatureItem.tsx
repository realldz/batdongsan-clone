import { CheckCircle2, X } from "lucide-react";

interface FeatureItemProps {
  label: string;
  included?: boolean;
}

export function FeatureItem({ label, included = true }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-2">
      {included ? (
        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
      ) : (
        <X className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
      )}
      <span className={`text-[13px] ${included ? "text-gray-700 font-medium" : "text-gray-400 line-through"}`}>
        {label}
      </span>
    </div>
  );
}
