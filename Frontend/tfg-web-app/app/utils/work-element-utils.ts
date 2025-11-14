import axios from "axios";
import apiClient from "./api-client";

export async function getProjects() {
  try {
    const response = await apiClient.get("/work-elements/projects");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching projects: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching projects");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching projects");
    }
  }
}

export async function getProjectById(id: string) {
  try {
    const response = await apiClient.get(`/work-elements/projects/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching project: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching project");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching project");
    }
  }
}

export async function createProject(data: any) {
  try {
    const response = await apiClient.post("/work-elements/projects", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error creating project: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error creating project");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error creating project");
    }
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const response = await apiClient.patch(
      `/work-elements/projects/${id}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error updating project: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error updating project");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error updating project");
    }
  }
}

export async function deleteProject(id: string) {
  try {
    const response = await apiClient.delete(`/work-elements/projects/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error deleting project: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error deleting project");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error deleting project");
    }
  }
}

export async function getProjectUsers(projectId: string) {
  try {
    const response = await apiClient.get(
      `/work-elements/projects/${projectId}/users`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching project users: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching project users");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching project users");
    }
  }
}

export async function getProjectTasks(projectId: string) {
  try {
    const response = await apiClient.get(
      `/work-elements/tasks?projectId=${projectId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching project tasks: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching project tasks");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching project tasks");
    }
  }
}

export async function createTask(data: any) {
  try {
    const response = await apiClient.post("/work-elements/tasks", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error creating task: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error creating task");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error creating task");
    }
  }
}

export async function getTaskById(id: string) {
  try {
    const response = await apiClient.get(`/work-elements/tasks/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching task: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching task");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching task");
    }
  }
}

export async function updateTask(id: string, data: any) {
  try {
    const response = await apiClient.patch(`/work-elements/tasks/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error updating task: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error updating task");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error updating task");
    }
  }
}

export async function deleteTask(id: string) {
  try {
    const response = await apiClient.delete(`/work-elements/tasks/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error deleting task: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error deleting task");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error deleting task");
    }
  }
}

export async function getTaskUsers(taskId: string) {
  try {
    const response = await apiClient.get(
      `/work-elements/tasks/${taskId}/users`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching task users: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching task users");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching task users");
    }
  }
}

export async function createComment(data: any) {
  try {
    const response = await apiClient.post("/work-elements/comments", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error creating comment: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error creating comment");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error creating comment");
    }
  }
}

export async function createMilestone(data: any) {
  try {
    const response = await apiClient.post("/work-elements/milestones", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error creating milestone: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error creating milestone");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error creating milestone");
    }
  }
}

export async function createIncidence(data: any) {
  try {
    const response = await apiClient.post("/work-elements/incidents", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error creating incidence: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error creating incidence");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error creating incidence");
    }
  }
}

export async function updateMilestone(id: string, data: any) {
  try {
    const response = await apiClient.patch(
      `/work-elements/milestones/${id}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error updating milestone: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error updating milestone");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error updating milestone");
    }
  }
}

export async function updateIncidence(id: string, data: any) {
  try {
    const response = await apiClient.patch(
      `/work-elements/incidents/${id}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error updating incidence: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error updating incidence");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error updating incidence");
    }
  }
}

export async function deleteMilestone(id: string) {
  try {
    const response = await apiClient.delete(`/work-elements/milestones/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error deleting milestone: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error deleting milestone");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error deleting milestone");
    }
  }
}

export async function deleteIncidence(id: string) {
  try {
    const response = await apiClient.delete(`/work-elements/incidents/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error deleting incidence: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error deleting incidence");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error deleting incidence");
    }
  }
}

export async function getAllTasks() {
  try {
    const response = await apiClient.get("/work-elements/tasks");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching tasks: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching tasks");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching tasks");
    }
  }
}

export async function getMyTasks(userId: string) {
  try {
    console.log("🔍 [getMyTasks] Starting - userId:", userId);

    // 1. Obtener todos los proyectos
    const projectsResponse = await apiClient.get("/work-elements/projects");
    const allProjects = projectsResponse.data;
    console.log("📁 [getMyTasks] Total projects:", allProjects.length);
    console.log("📁 [getMyTasks] Projects:", allProjects);

    // 2. Filtrar proyectos donde el usuario está asignado
    const myProjects = allProjects.filter((project: any) => {
      const hasUsers = project.users && project.users.length > 0;
      console.log(`  🔍 Project "${project.title}":`, {
        hasUsers,
        users: project.users,
        match: project.users?.some((up: any) => up.userId === userId),
      });
      return project.users?.some(
        (userProject: any) => userProject.userId === userId
      );
    });

    console.log("✅ [getMyTasks] My projects:", myProjects.length);
    console.log(
      "✅ [getMyTasks] My projects details:",
      myProjects.map((p: any) => ({ id: p.id, title: p.title }))
    );

    if (myProjects.length === 0) {
      console.warn("⚠️  [getMyTasks] No projects found for user");
      return [];
    }

    // 3. Obtener tareas de cada proyecto
    console.log("📋 [getMyTasks] Fetching tasks for each project...");
    const allTasksPromises = myProjects.map(async (project: any) => {
      try {
        console.log(
          `  📋 Fetching tasks for project: ${project.title} (${project.id})`
        );
        const tasks = await getProjectTasks(project.id);
        console.log(`  ✅ Got ${tasks.length} tasks for ${project.title}`);
        console.log(`  Tasks:`, tasks);
        return tasks;
      } catch (error) {
        console.error(
          `  ❌ Error fetching tasks for project ${project.id}:`,
          error
        );
        return [];
      }
    });

    const tasksArrays = await Promise.all(allTasksPromises);
    console.log("📊 [getMyTasks] Tasks arrays:", tasksArrays);

    const allTasks = tasksArrays.flat();
    console.log("✅ [getMyTasks] Total tasks:", allTasks.length);
    console.log("✅ [getMyTasks] All tasks:", allTasks);

    return allTasks;
  } catch (error: unknown) {
    console.error("❌ [getMyTasks] Error:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching my tasks: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching my tasks");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching my tasks");
    }
  }
}

// Get all incidences
export async function getAllIncidences() {
  try {
    const response = await apiClient.get("/work-elements/incidents");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching incidences: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching incidences");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching incidences");
    }
  }
}

// Get all activities
export async function getAllActivities(limit?: number) {
  try {
    const url = limit ? `/activity?limit=${limit}` : "/activity";
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching activities: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching activities");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching activities");
    }
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching user: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching user");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching user");
    }
  }
}

// Get all users
export async function getAllUsers() {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error fetching users: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error fetching users");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error fetching users");
    }
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    const response = await apiClient.post("/users/login", { email, password });
    const { access_token, user } = response.data;

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("current_user", JSON.stringify(user));
    }

    return { access_token, user };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error logging in: ${error.response.data.message || error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error logging in");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error logging in");
    }
  }
}

// Logout user
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_user");
  }
}

// Get current user from localStorage
export function getCurrentUser() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("current_user");
    // Check if userStr exists and is not the string "undefined"
    return userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  }
  return null;
}

// Check if user is authenticated
export function isAuthenticated() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("auth_token");
  }
  return false;
}

// Add user to project
export async function addUserToProject(
  projectId: string,
  userId: string,
  role: string = "collaborator"
) {
  try {
    const response = await apiClient.post(
      `/work-elements/projects/${projectId}/users`,
      { userId, role }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(
        `Error adding user to project: ${error.response.status}`
      );
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error adding user to project");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error adding user to project");
    }
  }
}

// Remove user from project
export async function removeUserFromProject(
  projectId: string,
  userId: string
) {
  try {
    const response = await apiClient.delete(
      `/work-elements/projects/${projectId}/users/${userId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(
        `Error removing user from project: ${error.response.status}`
      );
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error removing user from project");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error removing user from project");
    }
  }
}

// Add user to task
export async function addUserToTask(
  taskId: string,
  userId: string,
  role: string = "assigned"
) {
  try {
    const response = await apiClient.post(
      `/work-elements/tasks/${taskId}/users`,
      { userId, role }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Error adding user to task: ${error.response.status}`);
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error adding user to task");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error adding user to task");
    }
  }
}

// Remove user from task
export async function removeUserFromTask(taskId: string, userId: string) {
  try {
    const response = await apiClient.delete(
      `/work-elements/tasks/${taskId}/users/${userId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Backend error:",
        error.response.status,
        error.response.data
      );
      throw new Error(
        `Error removing user from task: ${error.response.status}`
      );
    } else if (error instanceof Error) {
      console.error("Network or Axios error:", error.message);
      throw new Error("Network error removing user from task");
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error removing user from task");
    }
  }
}
