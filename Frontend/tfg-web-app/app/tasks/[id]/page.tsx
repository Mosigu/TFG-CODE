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
  Avatar,
  AlertDialog,
  TextArea,
  ScrollArea,
  IconButton,
} from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  ChatBubbleIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { MainMenu } from "../../components/MainMenu";
import { EditTaskModal } from "../../components/EditTaskModal";
import { AddMilestoneModal } from "../../components/AddMilestoneModal";
import { AddIncidenceModal } from "../../components/AddIncidenceModal";
import { AddCollaboratorModal } from "../../components/AddCollaboratorModal";
import {
  getTaskById,
  updateTask,
  deleteTask,
  createComment,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  createIncidence,
  updateIncidence,
  deleteIncidence,
  addUserToTask,
  removeUserFromTask,
} from "../../utils/work-element-utils";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface UserTask {
  id: string;
  userId: string;
  role: string;
  user: User;
}

interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}

interface Incidence {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  project?: {
    id: string;
    title: string;
  };
  createdBy?: User;
  users?: UserTask[];
  milestones?: Milestone[];
  incidences?: Incidence[];
  comments?: Comment[];
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [incidenceModalOpen, setIncidenceModalOpen] = useState(false);
  const [editingIncidence, setEditingIncidence] = useState<Incidence | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [addCollaboratorModalOpen, setAddCollaboratorModalOpen] =
    useState(false);

  const fetchTaskData = async () => {
    try {
      const taskData = await getTaskById(params.id as string);
      setTask(taskData);
    } catch (err: any) {
      console.error("Error loading task:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTaskData();
    }
  }, [params.id]);

  const handleBack = () => {
    if (task?.project?.id) {
      router.push(`/projects/${task.project.id}`);
    } else {
      router.push("/tasks");
    }
  };

  const handleEdit = async (data: any) => {
    try {
      await updateTask(params.id as string, data);
      await fetchTaskData();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleAddMilestone = async (data: any) => {
    try {
      if (data.id) {
        // Actualizar milestone existente
        const { id, ...updateData } = data; // Separa el ID del resto de los datos
        await updateMilestone(id, updateData);
      } else {
        // Crear nuevo milestone
        await createMilestone(data);
      }
      await fetchTaskData();
      setMilestoneModalOpen(false);
      setEditingMilestone(null);
    } catch (error) {
      console.error("Error saving milestone:", error);
    }
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setMilestoneModalOpen(true);
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      try {
        await deleteMilestone(milestoneId);
        await fetchTaskData();
      } catch (error) {
        console.error("Error deleting milestone:", error);
      }
    }
  };

  const handleAddIncidence = async (data: any) => {
    try {
      if (data.id) {
        // Actualizar incidence existente
        const { id, ...updateData } = data; // Separa el ID del resto de los datos
        await updateIncidence(id, updateData);
      } else {
        // Crear nueva incidence
        await createIncidence(data);
      }
      await fetchTaskData();
      setIncidenceModalOpen(false);
      setEditingIncidence(null);
    } catch (error) {
      console.error("Error saving incidence:", error);
    }
  };

  const handleEditIncidence = (incidence: Incidence) => {
    setEditingIncidence(incidence);
    setIncidenceModalOpen(true);
  };

  const handleDeleteIncidence = async (incidenceId: string) => {
    if (confirm("Are you sure you want to delete this incidence?")) {
      try {
        await deleteIncidence(incidenceId);
        await fetchTaskData();
      } catch (error) {
        console.error("Error deleting incidence:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(params.id as string);
      setDeleteDialogOpen(false);
      router.push(
        task?.project?.id ? `/projects/${task.project.id}` : "/tasks"
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await createComment({
        content: newComment,
        taskId: params.id as string,
        authorId: "default-user",
      });
      setNewComment("");
      await fetchTaskData();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAddCollaborator = async (userId: string, role: string) => {
    try {
      await addUserToTask(params.id as string, userId, role);
      await fetchTaskData(); // Refresh data
    } catch (error) {
      console.error("Error adding collaborator:", error);
      throw error;
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    try {
      await removeUserFromTask(params.id as string, userId);
      await fetchTaskData(); // Refresh data
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-progress":
      case "in_progress":
        return "blue";
      case "pending":
        return "orange";
      case "completed":
        return "green";
      case "paused":
        return "gray";
      default:
        return "gray";
    }
  };

  const getIncidenceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "red";
      case "in-progress":
      case "in_progress":
        return "orange";
      case "resolved":
        return "green";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <Flex gap="5" style={{ height: "100vh" }}>
        <MainMenu />
        <Box width="100%" p="6">
          <Text>Loading task details...</Text>
        </Box>
      </Flex>
    );
  }

  if (!task) {
    return (
      <Flex gap="5" style={{ height: "100vh" }}>
        <MainMenu />
        <Box width="100%" p="6">
          <Text color="red">Task not found.</Text>
          <Button onClick={handleBack} mt="4">
            Go Back
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex gap="5" style={{ height: "100vh", overflow: "hidden" }}>
      <MainMenu />
      <Box width="100%" style={{ overflow: "hidden" }}>
        <ScrollArea
          type="auto"
          scrollbars="vertical"
          style={{ height: "100vh" }}
        >
          <Box p="6" pr="8">
            <Flex direction="column" gap="6" style={{ maxWidth: "1200px" }}>
              {/* Header */}
              <Flex justify="between" align="center">
                <Button onClick={handleBack} variant="soft">
                  <ArrowLeftIcon />
                  Back
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
                      <AlertDialog.Title>Delete Task</AlertDialog.Title>
                      <AlertDialog.Description size="2">
                        Are you sure you want to delete this task? This action
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
                            Delete Task
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                </Flex>
              </Flex>

              {/* Task Title and Status */}
              <Box>
                <Flex align="center" gap="3" mb="2">
                  <Heading size="8" weight="bold">
                    {task.title}
                  </Heading>
                  <Badge color={getStatusColor(task.status)} size="2">
                    {task.status.replace("_", " ").replace("-", " ")}
                  </Badge>
                  {task.priority && (
                    <Badge color={getPriorityColor(task.priority)} size="2">
                      {task.priority}
                    </Badge>
                  )}
                </Flex>
                {task.project && (
                  <Text size="2" color="gray">
                    Project: {task.project.title}
                  </Text>
                )}
              </Box>

              {/* Description Card */}
              {task.description && (
                <Card size="3">
                  <Heading size="3" mb="2" color="gray">
                    Description
                  </Heading>
                  <Text>{task.description}</Text>
                </Card>
              )}

              {/* Task Details */}
              <Card size="3">
                <Heading size="3" mb="3" color="gray">
                  Task Details
                </Heading>
                <Flex direction="column" gap="3">
                  {task.startDate && (
                    <Flex align="center" gap="2">
                      <Text weight="medium" color="gray">
                        Start Date:
                      </Text>
                      <Flex align="center" gap="1">
                        <CalendarIcon className="w-4 h-4" />
                        <Text>
                          {new Date(task.startDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>
                  )}

                  {task.endDate && (
                    <Flex align="center" gap="2">
                      <Text weight="medium" color="gray">
                        End Date:
                      </Text>
                      <Flex align="center" gap="1">
                        <CalendarIcon className="w-4 h-4" />
                        <Text>
                          {new Date(task.endDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>
                  )}

                  {task.createdBy && (
                    <Flex align="center" gap="2">
                      <Text weight="medium" color="gray">
                        Created By:
                      </Text>
                      <Flex align="center" gap="2">
                        <Avatar
                          size="1"
                          fallback={task.createdBy.name?.[0] || "U"}
                          radius="full"
                        />
                        <Text>
                          {task.createdBy.name} {task.createdBy.surname}
                        </Text>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Card>

              {/* Collaborators Section */}
              <Card size="3">
                <Flex justify="between" align="center" mb="3">
                  <Heading size="4">Collaborators</Heading>
                  <Button
                    size="2"
                    variant="soft"
                    onClick={() => setAddCollaboratorModalOpen(true)}
                  >
                    <PlusIcon />
                    Add Collaborator
                  </Button>
                </Flex>
                {task.users && task.users.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {task.users.map((userTask) => (
                      <Flex key={`${userTask.id}-${userTask.userId}`} align="center" justify="between">
                        <Flex align="center" gap="3">
                          <Avatar
                            size="2"
                            fallback={userTask.user.name?.[0] || "U"}
                            radius="full"
                          />
                          <Flex direction="column" gap="1">
                            <Text size="2" weight="medium">
                              {userTask.user.name} {userTask.user.surname}
                            </Text>
                            <Text size="1" color="gray">
                              {userTask.user.email}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex gap="2" align="center">
                          <Badge color="blue">{userTask.role}</Badge>
                          <IconButton
                            size="1"
                            variant="soft"
                            color="red"
                            onClick={() =>
                              handleRemoveCollaborator(userTask.userId)
                            }
                          >
                            <TrashIcon />
                          </IconButton>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">No collaborators assigned yet</Text>
                )}
              </Card>

              {/* Milestones Section */}
              <Card size="3">
                <Flex justify="between" align="center" mb="3">
                  <Heading size="4">Milestones</Heading>
                  <Button
                    size="2"
                    variant="soft"
                    onClick={() => {
                      setEditingMilestone(null);
                      setMilestoneModalOpen(true);
                    }}
                  >
                    <PlusIcon />
                    Add Milestone
                  </Button>
                </Flex>
                {task.milestones && task.milestones.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {task.milestones.map((milestone) => (
                      <Flex key={milestone.id} align="start" gap="2">
                        {milestone.isCompleted ? (
                          <CheckCircledIcon className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <CrossCircledIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        )}
                        <Box style={{ flex: 1 }}>
                          <Text
                            size="2"
                            weight="medium"
                            style={{
                              textDecoration: milestone.isCompleted
                                ? "line-through"
                                : "none",
                              color: milestone.isCompleted
                                ? "var(--gray-9)"
                                : "inherit",
                            }}
                          >
                            {milestone.title}
                          </Text>
                          {milestone.description && (
                            <Text size="1" color="gray" mt="1">
                              {milestone.description}
                            </Text>
                          )}
                          {milestone.dueDate && (
                            <Flex align="center" gap="1" mt="1">
                              <CalendarIcon className="w-3 h-3" />
                              <Text size="1" color="gray">
                                Due:{" "}
                                {new Date(
                                  milestone.dueDate
                                ).toLocaleDateString()}
                              </Text>
                            </Flex>
                          )}
                        </Box>
                        <Flex gap="1">
                          <IconButton
                            size="1"
                            variant="ghost"
                            onClick={() => handleEditMilestone(milestone)}
                          >
                            <Pencil1Icon />
                          </IconButton>
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="red"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">No milestones yet</Text>
                )}
              </Card>

              {/* Incidences Section */}
              <Card size="3">
                <Flex justify="between" align="center" mb="3">
                  <Heading size="4">Incidences</Heading>
                  <Button
                    size="2"
                    variant="soft"
                    color="orange"
                    onClick={() => {
                      setEditingIncidence(null);
                      setIncidenceModalOpen(true);
                    }}
                  >
                    <PlusIcon />
                    Report Incidence
                  </Button>
                </Flex>
                {task.incidences && task.incidences.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {task.incidences.map((incidence) => (
                      <Card key={incidence.id} variant="surface">
                        <Flex justify="between" align="start" mb="2">
                          <Flex align="center" gap="2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                            <Text size="2" weight="bold">
                              {incidence.title}
                            </Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <Badge
                              color={getIncidenceStatusColor(incidence.status)}
                            >
                              {incidence.status}
                            </Badge>
                            {incidence.priority && (
                              <Badge
                                color={getPriorityColor(incidence.priority)}
                              >
                                {incidence.priority}
                              </Badge>
                            )}
                            <IconButton
                              size="1"
                              variant="ghost"
                              onClick={() => handleEditIncidence(incidence)}
                            >
                              <Pencil1Icon />
                            </IconButton>
                            <IconButton
                              size="1"
                              variant="ghost"
                              color="red"
                              onClick={() =>
                                handleDeleteIncidence(incidence.id)
                              }
                            >
                              <TrashIcon />
                            </IconButton>
                          </Flex>
                        </Flex>
                        {incidence.description && (
                          <Text size="2" color="gray">
                            {incidence.description}
                          </Text>
                        )}
                        <Text size="1" color="gray" mt="2">
                          Created:{" "}
                          {new Date(incidence.createdAt).toLocaleDateString()}
                        </Text>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">No incidences reported</Text>
                )}
              </Card>

              {/* Comments Section */}
              <Card size="3">
                <Heading size="4" mb="3">
                  Comments
                </Heading>

                {/* Add Comment */}
                <Box mb="4">
                  <TextArea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    mb="2"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                  >
                    <ChatBubbleIcon />
                    Add Comment
                  </Button>
                </Box>

                <Separator size="4" mb="4" />

                {/* Comments List */}
                {task.comments && task.comments.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {task.comments.map((comment) => (
                      <Card key={comment.id} variant="surface">
                        <Flex gap="3">
                          <Avatar
                            size="2"
                            fallback={comment.author.name?.[0] || "U"}
                            radius="full"
                          />
                          <Box style={{ flex: 1 }}>
                            <Flex justify="between" align="start" mb="1">
                              <Text size="2" weight="bold">
                                {comment.author.name} {comment.author.surname}
                              </Text>
                              <Text size="1" color="gray">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  comment.createdAt
                                ).toLocaleTimeString()}
                              </Text>
                            </Flex>
                            <Text size="2">{comment.content}</Text>
                          </Box>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">No comments yet</Text>
                )}
              </Card>
            </Flex>
          </Box>
        </ScrollArea>
      </Box>

      {/* Modals */}
      <EditTaskModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={task}
        onSave={handleEdit}
      />

      <AddMilestoneModal
        open={milestoneModalOpen}
        onClose={() => {
          setMilestoneModalOpen(false);
          // Solo limpiar después de un pequeño delay para permitir que el modal cierre
          setTimeout(() => setEditingMilestone(null), 100);
        }}
        onSave={handleAddMilestone}
        taskId={params.id as string}
        milestone={editingMilestone}
      />

      <AddIncidenceModal
        open={incidenceModalOpen}
        onClose={() => {
          setIncidenceModalOpen(false);
          // Solo limpiar después de un pequeño delay para permitir que el modal cierre
          setTimeout(() => setEditingIncidence(null), 100);
        }}
        onSave={handleAddIncidence}
        taskId={params.id as string}
        incidence={editingIncidence}
      />

      {/* Add Collaborator Modal */}
      <AddCollaboratorModal
        open={addCollaboratorModalOpen}
        onClose={() => setAddCollaboratorModalOpen(false)}
        onAdd={handleAddCollaborator}
        type="task"
        currentUserIds={task.users?.map((u) => u.userId) || []}
      />
    </Flex>
  );
}
