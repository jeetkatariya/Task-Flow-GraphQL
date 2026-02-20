import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
      id
      title
      description
      priority
      status
      dueDate
      category {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $updateTaskInput: UpdateTaskInput!) {
    updateTask(id: $id, updateTaskInput: $updateTaskInput) {
      id
      title
      description
      priority
      status
      dueDate
      completedAt
    }
  }
`;

export const COMPLETE_TASK = gql`
  mutation CompleteTask($id: ID!) {
    completeTask(id: $id) {
      id
      status
      completedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation RemoveTask($id: ID!) {
    removeTask(id: $id)
  }
`;

export const BULK_UPDATE_TASKS = gql`
  mutation BulkUpdateTasks($taskIds: [ID!]!, $updateData: UpdateTaskInput!) {
    bulkUpdateTasks(taskIds: $taskIds, updateData: $updateData) {
      id
      status
    }
  }
`;
