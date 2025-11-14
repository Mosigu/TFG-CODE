"use client";

import { Card, Flex, Text, Box, Badge, Progress } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  tasks?: any[];
  users?: any[];
}

interface ProjectsGridProps {
  projects: Project[];
  loading?: boolean;
}

export function ProjectsGrid({ projects, loading }: ProjectsGridProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "on-hold":
        return "orange";
      case "archived":
        return "gray";
      default:
        return "iris";
    }
  };

  const calculateProgress = (project: Project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(
      (task) => task.status === "completed" || task.status === "done"
    ).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
        <Flex direction="column" gap="3" p="4">
          <Text size="4" weight="bold">
            Proyectos Activos
          </Text>
          <Text size="2" className="text-gray-400">
            Cargando...
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
      <Flex direction="column" gap="3" p="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            Proyectos Activos
          </Text>
          <Badge color="iris" variant="soft">
            {projects.length}
          </Badge>
        </Flex>

        {projects.length === 0 ? (
          <Text size="2" className="text-gray-400 text-center py-8">
            No tienes proyectos activos
          </Text>
        ) : (
          <Flex direction="column" gap="3">
            {projects.slice(0, 6).map((project) => {
              const progress = calculateProgress(project);
              return (
                <Box
                  key={project.id}
                  className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all cursor-pointer border border-gray-700/50 hover:border-iris-500/50"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="start">
                      <Flex direction="column" gap="1" style={{ flex: 1 }}>
                        <Text size="3" weight="bold">
                          {project.title}
                        </Text>
                        {project.description && (
                          <Text size="2" className="text-gray-400 line-clamp-1">
                            {project.description}
                          </Text>
                        )}
                      </Flex>
                      <Badge
                        color={getStatusColor(project.status)}
                        variant="soft"
                      >
                        {project.status}
                      </Badge>
                    </Flex>

                    <Flex direction="column" gap="2">
                      <Flex justify="between" align="center">
                        <Text size="1" className="text-gray-500">
                          Progreso
                        </Text>
                        <Text size="1" className="text-gray-400">
                          {progress}%
                        </Text>
                      </Flex>
                      <Progress value={progress} color="iris" />
                    </Flex>

                    <Flex gap="4">
                      {project.tasks && (
                        <Flex gap="1" align="center">
                          <Text size="1" className="text-gray-500">
                            ✓
                          </Text>
                          <Text size="2" className="text-gray-400">
                            {project.tasks.length} tareas
                          </Text>
                        </Flex>
                      )}
                      {project.users && project.users.length > 0 && (
                        <Flex gap="1" align="center">
                          <Text size="1" className="text-gray-500">
                            👥
                          </Text>
                          <Text size="2" className="text-gray-400">
                            {project.users.length} miembros
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        )}

        {projects.length > 6 && (
          <Box className="text-center">
            <Text
              size="2"
              className="text-iris-400 cursor-pointer hover:underline"
              onClick={() => router.push("/projects")}
            >
              Ver todos los proyectos →
            </Text>
          </Box>
        )}
      </Flex>
    </Card>
  );
}
