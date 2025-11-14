"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Heading, Flex, Box } from "@radix-ui/themes";
import { MainMenu } from "../components/MainMenu";
import { PageContainer } from "../components/PageContainer";
import { TaskCategory } from "../components/TaskCategory";
import { TaskCard } from "../components/TaskCard";
import {
  getMyTasks,
  isAuthenticated,
  getCurrentUser,
} from "../utils/work-element-utils";

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
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const currentUser = getCurrentUser();
        const userId = currentUser?.id || DEFAULT_USER_ID;
        const data = await getMyTasks(userId);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

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
        <PageContainer>
          <Text size="3">Loading tasks...</Text>
        </PageContainer>
      </Flex>
    );
  }

  return (
    <Flex gap="5">
      <MainMenu />
      <PageContainer>
        <Flex gap="6" direction="column">
          <Heading as="h1" size="8" weight="bold" highContrast>
            My Tasks
          </Heading>

          {/* Task categories - responsive grid */}
          <Flex
            gap="4"
            wrap="wrap"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
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
      </PageContainer>
    </Flex>
  );
}
