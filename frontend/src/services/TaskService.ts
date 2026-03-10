import axios from 'axios';

const API_URL = 'http://127.0.0.1:8081/api/v1/tasks';
const LOCAL_STORAGE_KEY = 'offlineTasks';

export interface Task {
    id?: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
    category?: string;
    dueDate?: string;
    timeOfDay?: 'Anytime' | 'Morning' | 'Day' | 'Evening';
    isAllDay?: boolean;
    duration?: string;
    subTasks?: string[];
    startTime?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Helper to get local tasks
const getLocalTasks = (): Task[] => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Helper to save local tasks
const saveLocalTasks = (tasks: Task[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
};

export const checkConnection = async (): Promise<boolean> => {
    try {
        const HEALTH_URL = API_URL.replace('/tasks', '/health');
        await axios.get(HEALTH_URL, { timeout: 2000 });
        return true;
    } catch (error) {
        console.error("Connection check failed:", error);
        return false;
    }
};

export const getAllTasks = async () => {
    try {
        const response = await axios.get<Task[]>(API_URL, { timeout: 5000 });
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable, using local storage", error);
        return getLocalTasks();
    }
};

export const getTaskById = async (id: number) => {
    try {
        const response = await axios.get<Task>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable, checking local storage", error);
        const tasks = getLocalTasks();
        return tasks.find(t => t.id === id);
    }
};

export const createTask = async (task: Task) => {
    try {
        const response = await axios.post<Task>(API_URL, task);
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable, saving locally", error);
        const tasks = getLocalTasks();
        // Generate a temporary ID that doesn't conflict easily (timestamp)
        const newTask: Task = { ...task, id: Date.now() };
        tasks.push(newTask);
        saveLocalTasks(tasks);
        return newTask;
    }
};

export const updateTask = async (id: number, task: Task) => {
    try {
        const response = await axios.put<Task>(`${API_URL}/${id}`, task);
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable, updating locally", error);
        const tasks = getLocalTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...task, id };
        } else {
            tasks.push({ ...task, id });
        }
        saveLocalTasks(tasks);
        return { ...task, id };
    }
};

export const deleteTask = async (id: number) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.warn("Backend unavailable, deleting locally", error);
        const tasks = getLocalTasks();
        const newTasks = tasks.filter(t => t.id !== id);
        saveLocalTasks(newTasks);
    }
};
