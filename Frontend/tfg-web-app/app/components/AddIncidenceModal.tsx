"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon } from "@radix-ui/react-icons";

interface Incidence {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
}

interface AddIncidenceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  taskId: string;
  incidence?: Incidence | null;
}

export function AddIncidenceModal({
  open,
  onClose,
  onSave,
  taskId,
  incidence = null,
}: AddIncidenceModalProps) {
  const isEditMode = !!incidence;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (incidence) {
        setFormData({
          title: incidence.title || "",
          description: incidence.description || "",
          status: incidence.status || "open",
          priority: incidence.priority || "medium",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          status: "open",
          priority: "medium",
        });
      }
      setErrors({});
    }
  }, [open, incidence]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (isEditMode && incidence) {
      const dataToSend: any = {
        title: formData.title,
        status: formData.status,
        priority: formData.priority,
      };

      if (formData.description.trim()) {
        dataToSend.description = formData.description;
      }

      onSave({ id: incidence.id, ...dataToSend });
    } else {
      const dataToSend: any = {
        title: formData.title,
        taskId: taskId,
        status: formData.status,
        priority: formData.priority,
      };

      if (formData.description.trim()) {
        dataToSend.description = formData.description;
      }

      onSave(dataToSend);
    }
    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>
          {isEditMode ? "Edit Incidence" : "Report Incidence"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEditMode
            ? "Update the incidence details."
            : "Report a new issue or incidence for this task."}
        </Dialog.Description>

        <Flex direction="column" gap="4">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title <Text color="red">*</Text>
            </Text>
            <TextField.Root
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) {
                  setErrors({ ...errors, title: "" });
                }
              }}
              placeholder="Enter incidence title"
            />
            {errors.title && (
              <Text size="1" color="red" mt="1">
                {errors.title}
              </Text>
            )}
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextArea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the issue"
              rows={4}
            />
          </label>

          <Flex gap="4">
            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              <Select.Root
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="open">Open</Select.Item>
                  <Select.Item value="in_progress">In Progress</Select.Item>
                  <Select.Item value="resolved">Resolved</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Priority
              </Text>
              <Select.Root
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="low">Low</Select.Item>
                  <Select.Item value="medium">Medium</Select.Item>
                  <Select.Item value="high">High</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit}>
            {isEditMode ? <Pencil1Icon /> : <PlusIcon />}
            {isEditMode ? "Update Incidence" : "Report Incidence"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
