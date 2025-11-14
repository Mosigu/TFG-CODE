"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Flex,
  Card,
  Button,
  Badge,
  Separator,
  Container,
  Progress,
  Avatar,
  AlertDialog,
} from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  CalendarIcon,
  PersonIcon,
  LockClosedIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  EyeOpenIcon,
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { MainMenu } from "../../components/MainMenu";
import { EditProjectModal } from "../../components/EditProjectModal";
import { CreateTaskModal } from "../../components/CreateTaskModal";
import { AddCollaboratorModal } from "../../components/AddCollaboratorModal";
import { SimpleTasksTable } from "../../components/TasksTable";
import {
  getProjectById,
  updateProject,
  deleteProject,
  getProjectUsers,
  getProjectTasks,
  createTask,
  addUserToProject,
  removeUserFromProject,
} from "../../utils/work-element-utils";

interface Project {
  id: string;
  title: string;
  description?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Participant {
  id: string;
  userId: string;
  role: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface Task {
  id: string;
  title: string;
  status: string;
  completed: boolean;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addCollaboratorModalOpen, setAddCollaboratorModalOpen] =
    useState(false);

  const fetchProjectData = async () => {
    try {
      const [projectData, usersData] = await Promise.all([
        getProjectById(params.id as string),
        getProjectUsers(params.id as string),
      ]);

      setProject(projectData);
      setParticipants(usersData);

      try {
        const tasksData = await getProjectTasks(params.id as string);
        setTasks(tasksData);
      } catch {
        setTasks([
          {
            id: "1",
            title: "Setup project",
            status: "completed",
            completed: true,
          },
          {
            id: "2",
            title: "Design phase",
            status: "completed",
            completed: true,
          },
          {
            id: "3",
            title: "Development",
            status: "in-progress",
            completed: false,
          },
          { id: "4", title: "Testing", status: "pending", completed: false },
          { id: "5", title: "Deployment", status: "pending", completed: false },
        ]);
      }
    } catch (err: any) {
      setError(err.message || "Error loading project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProjectData();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push("/projects");
  };

  const handleEdit = async (data: any) => {
    try {
      await updateProject(params.id as string, data);
      await fetchProjectData(); // Refresh data
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const newTask = await createTask(data);
      setCreateTaskModalOpen(false);
      router.push(`/tasks/${newTask.id}`);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(params.id as string);
      setDeleteDialogOpen(false);
      router.push("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddCollaborator = async (userId: string, role: string) => {
    try {
      await addUserToProject(params.id as string, userId, role);
      await fetchProjectData(); // Refresh data
    } catch (error) {
      console.error("Error adding collaborator:", error);
      throw error;
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    try {
      await removeUserFromProject(params.id as string, userId);
      await fetchProjectData(); // Refresh data
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "manager":
        return <Pencil1Icon className="w-4 h-4" />;
      case "collaborator":
        return <PersonIcon className="w-4 h-4" />;
      case "viewer":
        return <EyeOpenIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager":
        return "red";
      case "collaborator":
        return "blue";
      case "viewer":
        return "gray";
      default:
        return "gray";
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length; // ✅
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (loading) {
    return (
      <Flex gap="5">
        <MainMenu />
        <Box width="100%">
          <Container size="3">
            <Text>Loading project details...</Text>
          </Container>
        </Box>
      </Flex>
    );
  }

  if (!project) {
    return (
      <Flex gap="5">
        <MainMenu />
        <Box width="100%">
          <Container size="3">
            <Text color="red">Project has been deleted.</Text>
            <Button onClick={() => router.push("/projects")} mt="4">
              Back to Projects
            </Button>
          </Container>
        </Box>
      </Flex>
    );
  }

  const progress = calculateProgress();

  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%">
        <Container size="3">
          {/* Header */}
          <Flex direction="column" gap="6">
            <Flex justify="between" align="center">
              <Button onClick={handleBack} variant="soft">
                <ArrowLeftIcon />
                Back to Projects
              </Button>
              <Flex gap="2">
                <Button
                  variant="outline"
                  onClick={() => setEditModalOpen(true)}
                >
                  Edit
                </Button>
                <AlertDialog.Root
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialog.Trigger>
                    <Button color="red" variant="soft">
                      Delete
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Delete Project</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Are you sure you want to delete this project? This action
                      cannot be undone.
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          variant="solid"
                          color="red"
                          onClick={handleDelete}
                        >
                          Delete Project
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </Flex>
            </Flex>

            {/* Project Title and Status */}
            <Box>
              <Flex align="center" gap="3" mb="2">
                <Heading size="8" weight="bold">
                  {project.title}
                </Heading>
                {project.status && (
                  <Badge
                    color={project.status === "active" ? "green" : "gray"}
                    size="2"
                  >
                    {project.status === "active" ? (
                      <CheckCircledIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <CrossCircledIcon className="w-3 h-3 mr-1" />
                    )}
                    {project.status}
                  </Badge>
                )}
              </Flex>
            </Box>

            {/* Progress Card */}
            <Card size="2">
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Text size="2" weight="bold">
                    Project Progress
                  </Text>
                  <Text size="2" color="gray">
                    {progress}%
                  </Text>
                </Flex>
                <Progress value={progress} size="3" />
                <Text size="1" color="gray">
                  {tasks.filter((t) => t.status === "completed").length} of{" "}
                  {tasks.length} tasks completed
                </Text>
              </Flex>
            </Card>

            {/* Main Content Card */}
            <Card size="3">
              <Flex direction="column" gap="4">
                {/* Description */}
                {project.description && (
                  <Box>
                    <Heading size="3" mb="2" color="gray">
                      Description
                    </Heading>
                    <Text>{project.description}</Text>
                  </Box>
                )}

                <Separator size="4" />

                {/* Project Details Grid */}
                <Box>
                  <Heading size="3" mb="3" color="gray">
                    Project Details
                  </Heading>
                  <Flex direction="column" gap="3">
                    {/* Type */}
                    <Flex align="center" gap="2">
                      <Text weight="medium" color="gray">
                        Type:
                      </Text>
                      <Flex align="center" gap="1">
                        {project.type === "internal" ? (
                          <>
                            <LockClosedIcon className="w-4 h-4" />
                            <Text>Internal</Text>
                          </>
                        ) : (
                          <>
                            <PersonIcon className="w-4 h-4" />
                            <PersonIcon className="w-4 h-4" />
                            <Text>External</Text>
                          </>
                        )}
                      </Flex>
                    </Flex>

                    {/* Start Date */}
                    {project.startDate && (
                      <Flex align="center" gap="2">
                        <Text weight="medium" color="gray">
                          Start Date:
                        </Text>
                        <Flex align="center" gap="1">
                          <CalendarIcon className="w-4 h-4" />
                          <Text>
                            {new Date(project.startDate).toLocaleDateString()}
                          </Text>
                        </Flex>
                      </Flex>
                    )}

                    {/* End Date */}
                    {project.endDate && (
                      <Flex align="center" gap="2">
                        <Text weight="medium" color="gray">
                          End Date:
                        </Text>
                        <Flex align="center" gap="1">
                          <CalendarIcon className="w-4 h-4" />
                          <Text>
                            {new Date(project.endDate).toLocaleDateString()}
                          </Text>
                        </Flex>
                      </Flex>
                    )}

                    {/* Duration */}
                    {project.startDate && project.endDate && (
                      <Flex align="center" gap="2">
                        <Text weight="medium" color="gray">
                          Duration:
                        </Text>
                        <Text>
                          {Math.ceil(
                            (new Date(project.endDate).getTime() -
                              new Date(project.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Card>

            {/* Participants Section */}
            <Card size="3">
              <Flex justify="between" align="center" mb="3">
                <Heading size="4">Participants</Heading>
                <Button
                  size="2"
                  onClick={() => setAddCollaboratorModalOpen(true)}
                >
                  <PlusIcon />
                  Add Collaborator
                </Button>
              </Flex>
              {participants.length > 0 ? (
                <Flex direction="column" gap="3">
                  {participants.map((participant) => (
                    <Flex key={participant.id} align="center" justify="between">
                      <Flex align="center" gap="3">
                        <Avatar
                          size="2"
                          fallback={participant.user?.name?.[0] || "U"}
                          radius="full"
                        />
                        <Flex direction="column" gap="1">
                          <Text size="2" weight="medium">
                            {participant.user?.name || "Unknown User"}
                          </Text>
                          <Text size="1" color="gray">
                            {participant.user?.email}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex gap="2" align="center">
                        <Badge color={getRoleBadgeColor(participant.role)}>
                          {getRoleIcon(participant.role)}
                          {participant.role}
                        </Badge>
                        <Button
                          size="1"
                          variant="soft"
                          color="red"
                          onClick={() =>
                            handleRemoveCollaborator(participant.userId)
                          }
                        >
                          <TrashIcon />
                        </Button>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Text color="gray">No participants assigned yet</Text>
              )}
            </Card>

            {/* Tasks Section */}
            <Card size="3">
              <Flex justify="between" align="center" mb="3">
                <Heading size="4">Tasks</Heading>
                <Button size="2" onClick={() => setCreateTaskModalOpen(true)}>
                  <PlusIcon />
                  Add Task
                </Button>
              </Flex>
              <SimpleTasksTable tasks={tasks} />
            </Card>
          </Flex>
        </Container>
      </Box>

      {/* Edit Modal */}
      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={project}
        onSave={handleEdit}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onSave={handleCreateTask}
        projectId={params.id as string}
      />

      {/* Add Collaborator Modal */}
      <AddCollaboratorModal
        open={addCollaboratorModalOpen}
        onClose={() => setAddCollaboratorModalOpen(false)}
        onAdd={handleAddCollaborator}
        type="project"
        currentUserIds={participants.map((p) => p.userId)}
      />
    </Flex>
  );
}
