"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  Select,
  Box,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { getAllUsers } from "../utils/work-element-utils";

interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
}

interface AddCollaboratorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (userId: string, role: string) => Promise<void>;
  type: "project" | "task";
  currentUserIds?: string[];
}

const PROJECT_ROLES = [
  { value: "manager", label: "Manager - Can manage project and tasks" },
  { value: "contributor", label: "Contributor - Can update tasks and create issues" },
  { value: "viewer", label: "Viewer - Read-only access" },
];

const TASK_ROLES = [
  { value: "assigned", label: "Assigned - Can update task status" },
  { value: "reviewer", label: "Reviewer - Can review and comment" },
];

export function AddCollaboratorModal({
  open,
  onClose,
  onAdd,
  type,
  currentUserIds = [],
}: AddCollaboratorModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState(
    type === "project" ? "contributor" : "assigned"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      // Filter out users that are already collaborators
      const availableUsers = allUsers.filter(
        (user: User) => !currentUserIds.includes(user.id)
      );
      setUsers(availableUsers);
      if (availableUsers.length > 0) {
        setSelectedUserId(availableUsers[0].id);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    }
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAdd(selectedUserId, selectedRole);
      handleClose();
    } catch (err: any) {
      console.error("Error adding collaborator:", err);
      setError(err.message || "Failed to add collaborator");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUserId("");
    setSelectedRole(type === "project" ? "contributor" : "assigned");
    setError(null);
    onClose();
  };

  const roles = type === "project" ? PROJECT_ROLES : TASK_ROLES;

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Add Collaborator</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new collaborator to this {type}
        </Dialog.Description>

        <Flex direction="column" gap="3">
          {/* User Selection */}
          <Box>
            <Text as="label" size="2" mb="1" weight="bold">
              User
            </Text>
            <Select.Root
              value={selectedUserId}
              onValueChange={setSelectedUserId}
            >
              <Select.Trigger placeholder="Select user..." />
              <Select.Content>
                {users.length === 0 ? (
                  <Select.Item value="no-users" disabled>
                    No available users
                  </Select.Item>
                ) : (
                  users.map((user) => (
                    <Select.Item key={user.id} value={user.id}>
                      {user.name || user.surname
                        ? `${user.name || ""} ${user.surname || ""}`.trim()
                        : user.email}
                    </Select.Item>
                  ))
                )}
              </Select.Content>
            </Select.Root>
          </Box>

          {/* Role Selection */}
          <Box>
            <Text as="label" size="2" mb="1" weight="bold">
              Role
            </Text>
            <Select.Root value={selectedRole} onValueChange={setSelectedRole}>
              <Select.Trigger />
              <Select.Content>
                {roles.map((role) => (
                  <Select.Item key={role.value} value={role.value}>
                    {role.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

          {/* Error Message */}
          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}

          {/* Actions */}
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={loading}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleSubmit}
              disabled={loading || users.length === 0}
            >
              <PlusIcon />
              {loading ? "Adding..." : "Add Collaborator"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
