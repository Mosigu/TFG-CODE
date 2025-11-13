"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Heading, Flex, Box } from "@radix-ui/themes";
import { MainMenu } from "./components/MainMenu";
import { CirclesWidget } from "./components/CirclesWidget";
import {
  getProjects,
  getAllTasks,
  getAllIncidences,
  isAuthenticated,
} from "./utils/work-element-utils";

interface Project {
  id: string;
  status: string;
}

interface Task {
  id: string;
  status: string;
  incidences?: any[];
}

interface Incidence {
  id: string;
  status: string;
}

export default function Home() {
  const [activeProjects, setActiveProjects] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [openIncidences, setOpenIncidences] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [projectsData, tasksData, incidencesData] = await Promise.all([
          getProjects(),
          getAllTasks(),
          getAllIncidences(),
        ]);

        // Count active projects (status: active)
        const activeProjectsCount = (projectsData as Project[]).filter(
          (project) => project.status === "active"
        ).length;

        // Count pending tasks (status: pending or in_progress)
        const pendingTasksCount = (tasksData as Task[]).filter(
          (task) =>
            task.status === "pending" ||
            task.status === "in_progress" ||
            task.status === "in-progress"
        ).length;

        // Count open incidences (status not resolved/closed)
        const openIncidencesCount = (incidencesData as Incidence[]).filter(
          (incidence) =>
            incidence.status !== "resolved" && incidence.status !== "closed"
        ).length;

        setActiveProjects(activeProjectsCount);
        setPendingTasks(pendingTasksCount);
        setOpenIncidences(openIncidencesCount);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%" p="6">
        <Flex gap="9" direction="column">
          <Heading as="h1" size="8" weight="bold" highContrast>
            Home
          </Heading>
          <Heading as="h1" size="7" weight="bold" highContrast align="center">
            {loading ? "Loading..." : "You have"}
          </Heading>
        </Flex>
        {!loading && (
          <CirclesWidget
            activeProjects={activeProjects}
            pendingTasks={pendingTasks}
            openIncidences={openIncidences}
          />
        )}
      </Box>
    </Flex>
  );
}
