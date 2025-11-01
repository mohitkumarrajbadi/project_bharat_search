"use client";

interface FeatureCardProps {
  title: string;
  description: string;
  data: any;
}

export default function FeatureCard({ title, description, data }: FeatureCardProps) {
  const display = JSON.stringify(data, null, 2);
  return (
    <div className="p-5 bg-white rounded-2xl shadow-md border hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-3">{description}</p>
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 overflow-x-auto">
        <pre>{display}</pre>
      </div>
    </div>
  );
}
