"use client";

import { useState } from "react";
import { Heading, Flex, Box, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { MainMenu } from "../components/MainMenu";
import { ProjectsTable } from "../components/ProjectsTable";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { createProject } from "../utils/work-element-utils";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleCreateProject = async (data: any) => {
    try {
      console.log("Creating project with data:", data);
      const newProject = await createProject(data);
      console.log("Project created successfully:", newProject);
      setCreateModalOpen(false);

      // Refresh the projects table
      setRefreshKey((prev) => prev + 1);

      // Optional: Navigate to the new project
      // router.push(`/projects/${newProject.id}`);
    } catch (error: any) {
      console.error("Error creating project:", error);
      alert(`Failed to create project: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%" p="6">
        <Flex gap="6" direction="column">
          <Flex justify="between" align="center">
            <Heading as="h1" size="8" weight="bold">
              Projects
            </Heading>
            <Button
              onClick={() => setCreateModalOpen(true)}
              size="3"
              style={{ cursor: "pointer" }}
            >
              <PlusIcon width="16" height="16" />
              New Project
            </Button>
          </Flex>
          <ProjectsTable key={refreshKey} />
        </Flex>
      </Box>

      <CreateProjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateProject}
      />
    </Flex>
  );
}
