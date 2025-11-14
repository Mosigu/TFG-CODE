"use client";

import { Card, Flex, Text, Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "New Project",
      color: "iris" as const,
      onClick: () => router.push("/projects?action=create"),
    },
    {
      label: "New Task",
      color: "blue" as const,
      onClick: () => router.push("/userTasks?action=create"),
    },
    {
      label: "View Activity",
      color: "green" as const,
      onClick: () => router.push("/activity"),
    },
    {
      label: "My Profile",
      color: "purple" as const,
      onClick: () => router.push("/profile"),
    },
  ];

  return (
    <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
      <Flex direction="column" gap="3" p="4">
        <Text size="4" weight="bold">
          Quick Actions
        </Text>

        <Flex gap="2" wrap="wrap">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="soft"
              color={action.color}
              onClick={action.onClick}
              className="flex-1 min-w-[140px] cursor-pointer hover:scale-105 transition-transform"
            >
              <Text size="2" weight="medium">
                {action.label}
              </Text>
            </Button>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}
