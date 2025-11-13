"use client";

import { useRouter } from "next/navigation";
import { Table, Badge, Flex, Text, Box } from "@radix-ui/themes";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  UpdateIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  completed?: boolean;
}

interface SimpleTasksTableProps {
  tasks: Task[];
}

export function SimpleTasksTable({ tasks }: SimpleTasksTableProps) {
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-progress":
      case "in_progress":
        return <UpdateIcon className="w-3 h-3" />;
      case "pending":
        return <ClockIcon className="w-3 h-3" />;
      case "completed":
        return <CheckCircledIcon className="w-3 h-3" />;
      default:
        return <ClockIcon className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-progress":
      case "in_progress":
        return "blue";
      case "pending":
        return "orange";
      case "completed":
        return "green";
      default:
        return "gray";
    }
  };

  const handleRowClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <Box p="4">
        <Text color="gray">No tasks assigned yet</Text>
      </Box>
    );
  }

  return (
    <Table.Root variant="surface" size="2">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Task Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tasks.map((task) => (
          <Table.Row
            key={task.id}
            onClick={() => handleRowClick(task.id)}
            style={{ cursor: "pointer" }}
          >
            {/* Task Name Column */}
            <Table.RowHeaderCell>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Flex direction="column" gap="1" style={{ flex: 1 }}>
                  <Flex align="center" gap="2">
                    {task.completed ? (
                      <CheckCircledIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <CrossCircledIcon className="w-4 h-4 text-gray-400" />
                    )}
                    <Text
                      as="span"
                      color="gray"
                      weight="medium"
                      style={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "underline",
                      }}
                    >
                      {task.title}
                    </Text>
                  </Flex>
                  {task.description && (
                    <Text size="1" color="gray" ml="6">
                      {task.description.length > 80
                        ? `${task.description.substring(0, 80)}...`
                        : task.description}
                    </Text>
                  )}
                </Flex>
                <ExternalLinkIcon
                  className="w-4 h-4"
                  style={{ color: "var(--gray-9)" }}
                />
              </Box>
            </Table.RowHeaderCell>

            {/* Status Column */}
            <Table.Cell>
              <Badge color={getStatusColor(task.status)} size="2">
                {getStatusIcon(task.status)}
                {task.status.replace("_", " ").replace("-", " ")}
              </Badge>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
