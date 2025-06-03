import { BarChart3, TrendingUp, Users } from "lucide-react";

interface FAQStatsProps {
  totalQuestions: number;
  totalViews: number;
  helpfulResponses: number;
}

export function FAQStats({ totalQuestions, totalViews, helpfulResponses }: FAQStatsProps) {
  const stats = [
    {
      icon: <BarChart3 className="h-6 w-6 text-[#02488C]" />,
      label: "Total de Perguntas",
      value: totalQuestions
    },
    {
      icon: <Users className="h-6 w-6 text-[#02488C]" />,
      label: "Visualizações",
      value: totalViews.toLocaleString()
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#02488C]" />,
      label: "Respostas Úteis",
      value: `${Math.round((helpfulResponses / totalViews) * 100)}%`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4"
        >
          <div className="p-3 bg-[#e2f0ff] rounded-lg">
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-[#414141]">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 