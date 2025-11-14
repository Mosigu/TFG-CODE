"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Heading, Flex, Box, Card, Container, Grid } from "@radix-ui/themes";
import {
  RocketIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { MainMenu } from "./components/MainMenu";
import {
  getProjects,
  getAllTasks,
  getAllIncidences,
  isAuthenticated,
  getCurrentUser,
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
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get current user
    const user = getCurrentUser();
    if (user) {
      setUserName(user.name || user.email.split("@")[0]);
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

  if (loading) {
    return (
      <Flex gap="5">
        <MainMenu />
        <Box width="100%" p="6">
          <Container size="4">
            <Text>Loading...</Text>
          </Container>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%" p="6">
        <Container size="4">
          <Flex direction="column" gap="6">
            {/* Header Section */}
            <Box>
              <Heading size="8" weight="bold" mb="2">
                Welcome back, {userName}! 👋
              </Heading>
              <Text size="4" color="gray">
                Here's what's happening with your projects today
              </Text>
            </Box>

            {/* Stats Cards Grid */}
            <Grid columns={{ initial: "1", sm: "3" }} gap="4" width="100%">
              {/* Active Projects Card */}
              <Card
                size="3"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => router.push("/projects")}
              >
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="center">
                    <Box
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RocketIcon width="24" height="24" color="white" />
                    </Box>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="2" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      Active Projects
                    </Text>
                    <Heading
                      size="8"
                      weight="bold"
                      style={{ color: "white" }}
                    >
                      {activeProjects}
                    </Heading>
                  </Flex>
                </Flex>
              </Card>

              {/* Pending Tasks Card */}
              <Card
                size="3"
                style={{
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => router.push("/userTasks")}
              >
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="center">
                    <Box
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircledIcon width="24" height="24" color="white" />
                    </Box>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="2" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      Pending Tasks
                    </Text>
                    <Heading
                      size="8"
                      weight="bold"
                      style={{ color: "white" }}
                    >
                      {pendingTasks}
                    </Heading>
                  </Flex>
                </Flex>
              </Card>

              {/* Open Incidences Card */}
              <Card
                size="3"
                style={{
                  background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="center">
                    <Box
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ExclamationTriangleIcon
                        width="24"
                        height="24"
                        color="white"
                      />
                    </Box>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="2" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      Open Incidences
                    </Text>
                    <Heading
                      size="8"
                      weight="bold"
                      style={{ color: "white" }}
                    >
                      {openIncidences}
                    </Heading>
                  </Flex>
                </Flex>
              </Card>
            </Grid>

            {/* Quick Stats Overview */}
            <Card size="3">
              <Flex direction="column" gap="3">
                <Heading size="4">Quick Overview</Heading>
                <Flex direction="column" gap="2">
                  <Flex justify="between" align="center">
                    <Text color="gray">Total Active Items</Text>
                    <Text weight="bold" size="4">
                      {activeProjects + pendingTasks + openIncidences}
                    </Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text color="gray">Projects Activity</Text>
                    <Text
                      weight="bold"
                      size="4"
                      color={activeProjects > 0 ? "green" : "gray"}
                    >
                      {activeProjects > 0 ? "Active" : "Inactive"}
                    </Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text color="gray">Issues Status</Text>
                    <Text
                      weight="bold"
                      size="4"
                      color={openIncidences > 0 ? "orange" : "green"}
                    >
                      {openIncidences > 0
                        ? `${openIncidences} Open`
                        : "All Clear"}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
}
