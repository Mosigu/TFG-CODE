"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Checkbox,
} from "@radix-ui/themes";
import { PlusIcon, Pencil1Icon } from "@radix-ui/react-icons";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}

interface AddMilestoneModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  taskId: string;
  milestone?: Milestone | null;
}

export function AddMilestoneModal({
  open,
  onClose,
  onSave,
  taskId,
  milestone = null,
}: AddMilestoneModalProps) {
  const isEditMode = !!milestone;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    isCompleted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (milestone) {
        setFormData({
          title: milestone.title || "",
          description: milestone.description || "",
          dueDate: milestone.dueDate
            ? new Date(milestone.dueDate).toISOString().split("T")[0]
            : "",
          isCompleted: milestone.isCompleted || false,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          isCompleted: false,
        });
      }
      setErrors({});
    }
  }, [open, milestone]);

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

    if (isEditMode && milestone) {
      const dataToSend: any = {
        title: formData.title,
        isCompleted: formData.isCompleted,
      };

      if (formData.description.trim()) {
        dataToSend.description = formData.description;
      }

      if (formData.dueDate) {
        dataToSend.dueDate = new Date(formData.dueDate).toISOString();
      }

      onSave({ id: milestone.id, ...dataToSend });
    } else {
      const dataToSend: any = {
        title: formData.title,
        taskId: taskId,
        isCompleted: formData.isCompleted,
      };

      if (formData.description.trim()) {
        dataToSend.description = formData.description;
      }

      if (formData.dueDate) {
        dataToSend.dueDate = new Date(formData.dueDate).toISOString();
      }

      onSave(dataToSend);
    }
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      isCompleted: false,
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      isCompleted: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>
          {isEditMode ? "Edit Milestone" : "Add Milestone"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEditMode
            ? "Update the milestone details."
            : "Create a new milestone for this task."}
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
              placeholder="Enter milestone title"
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
              placeholder="Enter milestone description"
              rows={3}
            />
          </label>

          <label>
            <Flex align="center" gap="2">
              <Checkbox
                checked={formData.isCompleted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isCompleted: checked === true })
                }
              />
              <Text size="2">Mark as completed</Text>
            </Flex>
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit}>
            {isEditMode ? <Pencil1Icon /> : <PlusIcon />}
            {isEditMode ? "Update Milestone" : "Add Milestone"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
