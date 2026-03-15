export interface TaskDTO {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    createdAt: string;
}

export interface CreateTaskDTO {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
}

export interface PaginatedResponseDTO<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}