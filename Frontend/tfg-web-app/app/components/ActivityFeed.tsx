import { Card, Flex, Text, Box, ScrollArea, Badge } from "@radix-ui/themes";

interface Activity {
  id: string;
  action: string;
  workElementType: string;
  workElementTitle: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
}

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  const getActionColor = (action: string) => {
    if (!action) return "gray";
    const actionLower = action.toLowerCase();
    if (actionLower.includes("created")) return "green";
    if (actionLower.includes("updated") || actionLower.includes("changed")) return "blue";
    if (actionLower.includes("deleted") || actionLower.includes("removed")) return "red";
    if (actionLower.includes("completed")) return "purple";
    if (actionLower.includes("assigned")) return "iris";
    return "gray";
  };

  const getActionText = (action: string) => {
    if (!action) return "Activity";
    const actionLower = action.toLowerCase();
    if (actionLower === "created") return "Created";
    if (actionLower === "updated") return "Updated";
    if (actionLower === "deleted") return "Deleted";
    if (actionLower === "completed") return "Completed";
    if (actionLower === "status_changed") return "Status changed";
    if (actionLower === "user_assigned") return "User assigned";
    if (actionLower === "user_removed") return "User removed";
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTypeBadge = (type: string) => {
    if (!type) return "Activity";
    const typeLower = type.toLowerCase();
    if (typeLower.includes("project")) return "Project";
    if (typeLower.includes("task")) return "Task";
    if (typeLower.includes("incident")) return "Incident";
    if (typeLower.includes("milestone")) return "Milestone";
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
        <Flex direction="column" gap="3" p="4">
          <Text size="4" weight="bold">
            Recent Activity
          </Text>
          <Text size="2" className="text-gray-400">
            Loading...
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
      <Flex direction="column" gap="3" p="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            Recent Activity
          </Text>
          <Badge color="gray" variant="soft">
            {activities.length}
          </Badge>
        </Flex>

        <ScrollArea style={{ maxHeight: "400px" }}>
          <Flex direction="column" gap="3">
            {activities.length === 0 ? (
              <Text size="2" className="text-gray-400 text-center py-8">
                No recent activity
              </Text>
            ) : (
              activities.map((activity) => (
                <Box
                  key={activity.id}
                  className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700/50"
                >
                  <Flex gap="3" align="center">
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Flex gap="2" align="center" wrap="wrap">
                        <Badge
                          color={getActionColor(activity.action)}
                          variant="soft"
                          size="2"
                        >
                          {getActionText(activity.action)}
                        </Badge>
                        <Badge color="gray" variant="surface" size="2">
                          {getTypeBadge(activity.workElementType)}
                        </Badge>
                      </Flex>
                      <Text size="2" weight="medium">
                        {activity.workElementTitle}
                      </Text>
                      {activity.user && (
                        <Text size="1" className="text-gray-500">
                          by {activity.user.name}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              ))
            )}
          </Flex>
        </ScrollArea>
      </Flex>
    </Card>
  );
}
