"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Box,
  Heading,
  Text,
  TextField,
  Button,
  Card,
} from "@radix-ui/themes";
import { loginUser } from "../utils/work-element-utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}
    >
      <Card size="4" style={{ width: "400px" }}>
        <Flex direction="column" gap="4">
          <Heading as="h1" size="8" weight="bold" align="center">
            Login
          </Heading>

          <Text size="3" color="gray" align="center">
            Enter your credentials to access your account
          </Text>

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Box>
                <Text size="2" weight="bold" mb="2" as="label">
                  Email
                </Text>
                <TextField.Root
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="3"
                />
              </Box>

              <Box>
                <Text size="2" weight="bold" mb="2" as="label">
                  Password
                </Text>
                <TextField.Root
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="3"
                />
              </Box>

              {error && (
                <Text size="2" color="red">
                  {error}
                </Text>
              )}

              <Button
                type="submit"
                size="3"
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
}
