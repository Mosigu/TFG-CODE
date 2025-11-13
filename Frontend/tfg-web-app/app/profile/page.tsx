"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Text,
  Heading,
  Flex,
  Box,
  Card,
  Button,
  Avatar,
} from "@radix-ui/themes";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { MainMenu } from "../components/MainMenu";
import {
  getCurrentUser,
  logoutUser,
  isAuthenticated,
} from "../utils/work-element-utils";

interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  profilePictureURL?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  if (loading) {
    return (
      <Flex gap="5">
        <MainMenu />
        <Box width="100%" p="6">
          <Text>Loading...</Text>
        </Box>
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex gap="5">
        <MainMenu />
        <Box width="100%" p="6">
          <Text>No user data available</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%" p="6">
        <Flex direction="column" gap="6">
          <Heading as="h1" size="8" weight="bold" highContrast>
            Profile
          </Heading>

          <Card size="4" style={{ maxWidth: "600px" }}>
            <Flex direction="column" gap="6">
              {/* Avatar section */}
              <Flex align="center" gap="4">
                <Avatar
                  size="7"
                  src={user.profilePictureURL}
                  fallback={
                    user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()
                  }
                  color="blue"
                />
                <Flex direction="column">
                  <Heading size="6">
                    {user.name || user.surname
                      ? `${user.name || ""} ${user.surname || ""}`.trim()
                      : "User"}
                  </Heading>
                  <Text size="3" color="gray">
                    {user.email}
                  </Text>
                </Flex>
              </Flex>

              {/* User info */}
              <Flex direction="column" gap="4">
                <Box>
                  <Text size="2" weight="bold" color="gray" mb="1">
                    User ID
                  </Text>
                  <Text size="3">{user.id}</Text>
                </Box>

                <Box>
                  <Text size="2" weight="bold" color="gray" mb="1">
                    Email
                  </Text>
                  <Text size="3">{user.email}</Text>
                </Box>

                {user.name && (
                  <Box>
                    <Text size="2" weight="bold" color="gray" mb="1">
                      Name
                    </Text>
                    <Text size="3">{user.name}</Text>
                  </Box>
                )}

                {user.surname && (
                  <Box>
                    <Text size="2" weight="bold" color="gray" mb="1">
                      Surname
                    </Text>
                    <Text size="3">{user.surname}</Text>
                  </Box>
                )}
              </Flex>

              {/* Logout button */}
              <Button
                size="3"
                color="red"
                onClick={handleLogout}
                style={{ width: "100%" }}
              >
                <ExitIcon /> Logout
              </Button>
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Flex>
  );
}
