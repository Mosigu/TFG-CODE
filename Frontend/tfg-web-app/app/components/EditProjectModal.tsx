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

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: any;
  onSave: (data: any) => void;
}

export function EditProjectModal({
  open,
  onClose,
  project,
  onSave,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        type: project.type || "",
        status: project.status || "",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
      });
    }
  }, [project]);

  const handleSubmit = () => {
    const dataToSend: any = {};

    if (formData.title && formData.title !== project.title)
      dataToSend.title = formData.title;
    if (formData.description && formData.description !== project.description)
      dataToSend.description = formData.description;
    if (formData.type && formData.type !== project.type)
      dataToSend.type = formData.type;
    if (formData.status && formData.status !== project.status)
      dataToSend.status = formData.status;

    // Start Date
    if (formData.startDate) {
      const isoStart = new Date(formData.startDate).toISOString();
      if (isoStart !== project.startDate) dataToSend.startDate = isoStart;
    }

    // End Date
    if (formData.endDate) {
      const isoEnd = new Date(formData.endDate).toISOString();
      if (isoEnd !== project.endDate) dataToSend.endDate = isoEnd;
    }

    console.log("Data to send:", dataToSend);
    onSave(dataToSend);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Edit Project</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Update the project details below.
        </Dialog.Description>

        <Flex direction="column" gap="4">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title
            </Text>
            <TextField.Root
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Project title"
            />
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
              placeholder="Project description"
              rows={4}
            />
          </label>

          <Flex gap="4">
            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Type
              </Text>
              <Select.Root
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <Select.Trigger placeholder="Select type" />
                <Select.Content>
                  <Select.Item value="internal">Internal</Select.Item>
                  <Select.Item value="external">External</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

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
                <Select.Trigger placeholder="Select status" />
                <Select.Content>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="finished">Finished</Select.Item>
                  <Select.Item value="on-hold">On Hold</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>
          </Flex>

          <Flex gap="4">
            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Start Date
              </Text>
              <TextField.Root
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </label>

            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                End Date
              </Text>
              <TextField.Root
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </label>
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit}>Save changes</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
