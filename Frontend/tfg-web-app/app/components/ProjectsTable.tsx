"use client";

import { useEffect, useState } from "react";
import { Box, Table, Text, Select, Flex, Button } from "@radix-ui/themes";
import { getProjects } from "../utils/work-element-utils";
import {
  LockClosedIcon,
  PersonIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export const ProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err: any) {
        setError(err.message || "Error loading projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const sortByEndDate = (order: "asc" | "desc") => {
    const sorted = [...filteredProjects].sort((a, b) => {
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      const dateA = new Date(a.endDate).getTime();
      const dateB = new Date(b.endDate).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
    setFilteredProjects(sorted);
    setSortOrder(order);
  };

  useEffect(() => {
    let filtered = [...projects];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.status?.toLowerCase() === statusFilter
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((project) => project.type === typeFilter);
    }

    // Apply current sort
    filtered.sort((a, b) => {
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      const dateA = new Date(a.endDate).getTime();
      const dateB = new Date(b.endDate).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredProjects(filtered);
  }, [statusFilter, typeFilter, projects, sortOrder]);

  const toggleSort = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    sortByEndDate(newOrder);
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (loading) return <Text>Loading projects...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Box>
      {/* Controls Bar */}
      <Flex justify="between" align="center" mb="4">
        {/* Filters on the left */}
        <Flex gap="3">
          <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger placeholder="Filter by status" />
            <Select.Content>
              <Select.Item value="all">All Status</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="finished">Finished</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
            <Select.Trigger placeholder="Filter by type" />
            <Select.Content>
              <Select.Item value="all">All Types</Select.Item>
              <Select.Item value="internal">Internal</Select.Item>
              <Select.Item value="external">External</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        {/* Sort button on the right */}
        <Button onClick={toggleSort} variant="surface" color="gray">
          Sort by End Date
          {sortOrder === "desc" ? (
            <ArrowDownIcon className="ml-1" />
          ) : (
            <ArrowUpIcon className="ml-1" />
          )}
        </Button>
      </Flex>

      <Table.Root variant="surface" size="2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Project Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Start Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>End Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredProjects.map((project: any) => (
            <Table.Row key={project.id}>
              <Table.RowHeaderCell>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <Text
                    as="span"
                    color="gray"
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    {project.title}
                  </Text>
                  <ExternalLinkIcon
                    className="w-4 h-4"
                    style={{ color: "var(--gray-9)" }}
                  />
                </Box>
              </Table.RowHeaderCell>
              <Table.Cell>{project.status || "-"}</Table.Cell>

              <Table.Cell>
                <div className="flex items-center gap-2 min-w-[90px]">
                  {project.type === "internal" ? (
                    <Box
                      as="div"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span>Internal</span>
                      <LockClosedIcon className="w-4 h-4 text-gray-600" />
                    </Box>
                  ) : project.type === "external" ? (
                    <Box
                      as="div"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span>External</span>
                      <PersonIcon className="w-4 h-4 text-gray-600" />
                      <PersonIcon className="w-4 h-4 text-gray-600" />
                    </Box>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </Table.Cell>

              <Table.Cell>
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "-"}
              </Table.Cell>
              <Table.Cell>
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "-"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
