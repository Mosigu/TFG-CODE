"use client";

import { useEffect, useState } from "react";
import { Text, Heading, Flex, Box } from "@radix-ui/themes";
import { MainMenu } from "../components/MainMenu";
import { TaskCategory } from "../components/TaskCategory";
import { TaskCard } from "../components/TaskCard";
import { getMyTasks } from "../utils/work-element-utils";

// Usuario por defecto (mismo que usas en el backend)
const DEFAULT_USER_ID = "default-user";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  project?: {
    id: string;
    title: string;
  };
}

export default function UserTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getMyTasks(DEFAULT_USER_ID);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filtrar tareas por estado
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress" || task.status === "in-progress"
  );
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const pausedTasks = tasks.filter((task) => task.status === "paused");

  if (loading) {
    return (
      <Flex gap="5">
        <MainMenu />
        <Box width="100%" p="6">
          <Text>Loading tasks...</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%" p="6">
        <Flex gap="9" direction="column">
          <Heading as="h1" size="8" weight="bold" highContrast>
            My Tasks
          </Heading>

          {/* Task categories */}
          <Flex gap="4">
            <TaskCategory title="Pending" count={pendingTasks.length}>
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority || "medium"}
                  startDate={
                    task.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : "-"
                  }
                  endDate={
                    task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : "-"
                  }
                  projectTitle={task.project?.title}
                />
              ))}
            </TaskCategory>

            <TaskCategory title="In Progress" count={inProgressTasks.length}>
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority || "medium"}
                  startDate={
                    task.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : "-"
                  }
                  endDate={
                    task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : "-"
                  }
                  projectTitle={task.project?.title}
                />
              ))}
            </TaskCategory>

            <TaskCategory title="Completed" count={completedTasks.length}>
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority || "medium"}
                  startDate={
                    task.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : "-"
                  }
                  endDate={
                    task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : "-"
                  }
                  projectTitle={task.project?.title}
                />
              ))}
            </TaskCategory>

            <TaskCategory title="Paused" count={pausedTasks.length}>
              {pausedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority || "medium"}
                  startDate={
                    task.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : "-"
                  }
                  endDate={
                    task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : "-"
                  }
                  projectTitle={task.project?.title}
                />
              ))}
            </TaskCategory>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
