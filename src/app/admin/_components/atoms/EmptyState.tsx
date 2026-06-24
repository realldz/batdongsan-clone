export interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="py-14 text-center">
      <div className="text-base font-extrabold text-gray-900 mb-2">{title}</div>
      <div className="text-sm font-medium text-gray-500">{description}</div>
    </div>
  );
}
