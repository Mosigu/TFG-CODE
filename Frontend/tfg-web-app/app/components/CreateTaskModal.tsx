"use client";

import { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  projectId: string;
}

export function CreateTaskModal({
  open,
  onClose,
  onSave,
  projectId,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const dataToSend: any = {
      title: formData.title,
      priority: formData.priority,
      projectId: projectId,
    };

    if (formData.description.trim()) {
      dataToSend.description = formData.description;
    }

    if (formData.startDate) {
      dataToSend.startDate = new Date(formData.startDate).toISOString();
    }

    if (formData.endDate) {
      dataToSend.endDate = new Date(formData.endDate).toISOString();
    }

    onSave(dataToSend);

    setFormData({
      title: "",
      description: "",
      priority: "medium",
      startDate: "",
      endDate: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      startDate: "",
      endDate: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Create New Task</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill in the details to create a new task for this project.
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
              placeholder="Enter task title"
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
              placeholder="Enter task description"
              rows={4}
            />
          </label>

          <label>
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

          <Flex gap="4">
            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Start Date
              </Text>
              <TextField.Root
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  if (errors.endDate) {
                    setErrors({ ...errors, endDate: "" });
                  }
                }}
              />
            </label>

            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                End Date
              </Text>
              <TextField.Root
                type="date"
                value={formData.endDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  if (errors.endDate) {
                    setErrors({ ...errors, endDate: "" });
                  }
                }}
              />
              {errors.endDate && (
                <Text size="1" color="red" mt="1">
                  {errors.endDate}
                </Text>
              )}
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
            <PlusIcon />
            Create Task
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
