"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Heading, Flex, Box, Grid } from "@radix-ui/themes";
import { MainMenu } from "./components/MainMenu";
import { PageContainer } from "./components/PageContainer";
import { StatCard } from "./components/StatCard";
import { ActivityFeed } from "./components/ActivityFeed";
import { ProjectsGrid } from "./components/ProjectsGrid";
import {
  getProjects,
  getAllTasks,
  getAllIncidences,
  getAllActivities,
  getCurrentUser,
  isAuthenticated,
} from "./utils/work-element-utils";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  tasks?: any[];
  users?: any[];
}

interface Task {
  id: string;
  status: string;
  createdAt?: string;
}

interface Incidence {
  id: string;
  status: string;
}

interface Activity {
  id: string;
  action: string;
  workElementType: string;
  workElementTitle: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export default function Home() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingTasks: 0,
    completedToday: 0,
    openIncidences: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = getCurrentUser();
    setCurrentUser(user);

    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [projectsData, tasksData, incidencesData, activitiesData] =
          await Promise.all([
            getProjects(),
            getAllTasks(),
            getAllIncidences(),
            getAllActivities(10), // Get last 10 activities
          ]);

        // Count active projects
        const activeProjectsCount = (projectsData as Project[]).filter(
          (project) => project.status === "active"
        ).length;

        // Get active projects
        const activeProjects = (projectsData as Project[]).filter(
          (project) => project.status === "active"
        );

        // Count pending tasks
        const pendingTasksCount = (tasksData as Task[]).filter(
          (task) =>
            task.status === "pending" ||
            task.status === "in_progress" ||
            task.status === "in-progress"
        ).length;

        // Count tasks completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const completedTodayCount = (tasksData as Task[]).filter((task) => {
          if (task.status !== "completed" && task.status !== "done")
            return false;
          if (!task.createdAt) return false;
          const taskDate = new Date(task.createdAt);
          return taskDate >= today;
        }).length;

        // Count open incidences
        const openIncidencesCount = (incidencesData as Incidence[]).filter(
          (incidence) =>
            incidence.status !== "resolved" && incidence.status !== "closed"
        ).length;

        setStats({
          activeProjects: activeProjectsCount,
          pendingTasks: pendingTasksCount,
          completedToday: completedTodayCount,
          openIncidences: openIncidencesCount,
        });

        setProjects(activeProjects);
        setActivities(activitiesData as Activity[]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  return (
    <Flex gap="5">
      <MainMenu />
      <PageContainer maxWidth="1400px">
        <Flex direction="column" gap="6">
          {/* Header Section */}
          <Box>
            <Flex direction="column" gap="2">
              <Heading as="h1" size="8" weight="bold" highContrast>
                {getGreeting()}
                {currentUser && `, ${currentUser.name}`}
              </Heading>
              <Text size="3" className="text-gray-400">
                {getFormattedDate()}
              </Text>
            </Flex>
          </Box>

          {/* Stats Grid */}
          <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4">
            <StatCard
              title="Active Projects"
              value={loading ? "..." : stats.activeProjects}
              color="iris"
            />
            <StatCard
              title="Pending Tasks"
              value={loading ? "..." : stats.pendingTasks}
              color="orange"
            />
            <StatCard
              title="Completed Today"
              value={loading ? "..." : stats.completedToday}
              color="green"
            />
            <StatCard
              title="Open Incidents"
              value={loading ? "..." : stats.openIncidences}
              color="red"
            />
          </Grid>

          {/* Main Content Grid */}
          <Grid
            columns={{ initial: "1", lg: "2" }}
            gap="4"
            style={{ alignItems: "start" }}
          >
            {/* Projects Grid */}
            <ProjectsGrid projects={projects} loading={loading} />

            {/* Activity Feed */}
            <ActivityFeed activities={activities} loading={loading} />
          </Grid>
        </Flex>
      </PageContainer>
    </Flex>
  );
}
