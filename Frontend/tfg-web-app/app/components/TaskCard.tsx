"use client";

import { useRouter } from "next/navigation";
import { Card, Box, Flex, Heading, Text, Badge } from "@radix-ui/themes";
import { CalendarIcon } from "@radix-ui/react-icons";

type TaskCardProps = {
  id: string;
  title: string;
  priority: string;
  startDate: string;
  endDate: string;
  projectTitle?: string;
};

export const TaskCard = ({
  id,
  title,
  priority,
  startDate,
  endDate,
  projectTitle,
}: TaskCardProps) => {
  const router = useRouter();

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Card
      variant="surface"
      style={{
        padding: "1rem",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={() => router.push(`/tasks/${id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Flex direction="column" gap="3">
        <Flex justify="between" align="start" gap="2">
          <Heading size="4" weight="medium" style={{ flex: 1 }}>
            {title}
          </Heading>
          <Badge color={getPriorityColor(priority)} size="2">
            {priority}
          </Badge>
        </Flex>

        {projectTitle && (
          <Text size="2" color="gray">
            📁 {projectTitle}
          </Text>
        )}

        <Flex align="center" gap="2">
          <CalendarIcon width="14" height="14" />
          <Text size="2" color="gray">
            {startDate} → {endDate}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
