import { Card, Flex, Text, Box } from "@radix-ui/themes";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "orange" | "red" | "purple" | "iris";
}

export function StatCard({ title, value, icon, trend, color = "iris" }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    green: "from-green-500/10 to-green-600/5 border-green-500/20",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    red: "from-red-500/10 to-red-600/5 border-red-500/20",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
    iris: "from-iris-500/10 to-iris-600/5 border-iris-500/20",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm hover:scale-105 transition-transform duration-200`}
    >
      <Flex direction="column" gap="3" p="4">
        <Flex justify="between" align="start">
          <Text size="2" weight="medium" className="text-gray-400">
            {title}
          </Text>
          {icon && <Box className="opacity-50">{icon}</Box>}
        </Flex>

        <Flex direction="column" gap="1">
          <Text size="8" weight="bold" className="text-white">
            {value}
          </Text>

          {trend && (
            <Text
              size="1"
              className={trend.isPositive ? "text-green-400" : "text-red-400"}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
