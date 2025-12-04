"use client";

import { useState } from "react";
import { Heading, Flex, Box, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { MainMenu } from "../components/MainMenu";
import { PageContainer } from "../components/PageContainer";
import { ProjectsTable } from "../components/ProjectsTable";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { createProject } from "../utils/work-element-utils";

export default function ProjectsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateProject = async (data: any) => {
    try {
      await createProject(data);
      setCreateModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      alert(`Failed to create project: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <Flex gap="5">
      <MainMenu />
      <PageContainer>
        <Flex gap="6" direction="column">
          <Flex justify="between" align="center" wrap="wrap" gap="4">
            <Heading as="h1" size="8" weight="bold" highContrast>
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
      </PageContainer>

      <CreateProjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateProject}
      />
    </Flex>
  );
}
