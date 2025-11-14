"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Flex,
  Box,
  Card,
  Text,
  Avatar,
  Separator,
  Badge,
} from "@radix-ui/themes";
import { MainMenu } from "../components/MainMenu";
import { PageContainer } from "../components/PageContainer";
import {
  getAllActivities,
  getAllUsers,
  isAuthenticated,
} from "../utils/work-element-utils";

interface Activity {
  id: string;
  agentId: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  profilePictureURL?: string;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch activities and users
        const [activitiesData, usersData] = await Promise.all([
          getAllActivities(100), // Get last 100 activities
          getAllUsers(),
        ]);

        // Create a map of users by ID for quick lookup
        const usersMap = (usersData as User[]).reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as { [key: string]: User });

        setActivities(activitiesData as Activity[]);
        setUsers(usersMap);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getActionColor = (action: string) => {
    if (action.includes("CREATED")) return "green";
    if (action.includes("UPDATED") || action.includes("CHANGED"))
      return "blue";
    if (action.includes("DELETED")) return "red";
    if (action.includes("ASSIGNED")) return "purple";
    if (action.includes("COMPLETED") || action.includes("RESOLVED"))
      return "teal";
    return "gray";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Flex gap="5">
      <MainMenu />
      <PageContainer maxWidth="1000px">
        <Flex direction="column" gap="6">
          <Heading as="h1" size="8" weight="bold" highContrast>
            Activity Feed
          </Heading>

          {loading ? (
            <Text size="3">Loading activities...</Text>
          ) : activities.length === 0 ? (
            <Card size="3">
              <Text size="3" color="gray">
                No activities found
              </Text>
            </Card>
          ) : (
            <Flex direction="column" gap="3">
              {activities.map((activity) => {
                const user = users[activity.agentId];
                const userName = user
                  ? `${user.name || ""} ${user.surname || ""}`.trim() ||
                    user.email
                  : "Unknown User";
                const userInitial = user
                  ? (user.name || user.email).charAt(0).toUpperCase()
                  : "?";

                return (
                  <Card key={activity.id} size="3">
                    <Flex direction="column" gap="3">
                      <Flex align="center" justify="between" wrap="wrap" gap="3">
                        <Flex gap="3" align="center">
                          <Avatar
                            size="3"
                            src={user?.profilePictureURL}
                            radius="full"
                            fallback={userInitial}
                            color="blue"
                          />
                          <Flex direction="column" gap="1">
                            <Text size="3" weight="bold">
                              {userName}
                            </Text>
                            <Flex gap="2" align="center" wrap="wrap">
                              <Badge
                                color={getActionColor(activity.action)}
                                size="2"
                              >
                                {activity.action}
                              </Badge>
                              <Text size="2" color="gray">
                                {activity.entityType}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Text size="2" color="gray">
                          {formatDate(activity.createdAt)}
                        </Text>
                      </Flex>

                      <Text size="3">{activity.description}</Text>

                      {activity.relatedEntityType && (
                        <Text size="2" color="gray">
                          Related: {activity.relatedEntityType} (ID:{" "}
                          {activity.relatedEntityId})
                        </Text>
                      )}
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          )}
        </Flex>
      </PageContainer>
    </Flex>
  );
}
