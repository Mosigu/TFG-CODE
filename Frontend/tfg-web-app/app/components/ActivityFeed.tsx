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
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `hace ${days}d`;
    if (hours > 0) return `hace ${hours}h`;
    if (minutes > 0) return `hace ${minutes}m`;
    return "ahora";
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "created":
        return "green";
      case "updated":
        return "blue";
      case "deleted":
        return "red";
      case "completed":
        return "purple";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "project":
        return "📁";
      case "task":
        return "✓";
      case "incident":
        return "⚠️";
      case "milestone":
        return "🎯";
      default:
        return "📌";
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
        <Flex direction="column" gap="3" p="4">
          <Text size="4" weight="bold">
            Actividad Reciente
          </Text>
          <Text size="2" className="text-gray-400">
            Cargando...
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
            Actividad Reciente
          </Text>
          <Badge color="gray" variant="soft">
            {activities.length}
          </Badge>
        </Flex>

        <ScrollArea style={{ maxHeight: "400px" }}>
          <Flex direction="column" gap="3">
            {activities.length === 0 ? (
              <Text size="2" className="text-gray-400 text-center py-8">
                No hay actividad reciente
              </Text>
            ) : (
              activities.map((activity) => (
                <Box
                  key={activity.id}
                  className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700/50"
                >
                  <Flex gap="3" align="start">
                    <Text size="5">{getTypeIcon(activity.workElementType)}</Text>
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Flex gap="2" align="center">
                        <Badge
                          color={getActionColor(activity.action)}
                          variant="soft"
                          size="1"
                        >
                          {activity.action}
                        </Badge>
                        <Text size="2" className="text-gray-400">
                          {activity.workElementType}
                        </Text>
                      </Flex>
                      <Text size="2" weight="medium">
                        {activity.workElementTitle}
                      </Text>
                      {activity.user && (
                        <Text size="1" className="text-gray-500">
                          por {activity.user.name}
                        </Text>
                      )}
                    </Flex>
                    <Text size="1" className="text-gray-500">
                      {formatTime(activity.createdAt)}
                    </Text>
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
