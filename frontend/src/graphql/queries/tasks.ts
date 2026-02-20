import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($filter: TaskFilterInput, $sort: TaskSortInput, $pagination: PaginationInput) {
    tasks(filter: $filter, sort: $sort, pagination: $pagination) {
      tasks {
        id
        title
        description
        priority
        status
        dueDate
        completedAt
        isOverdue
        daysUntilDue
        completionPercentage
        priorityScore
        category {
          id
          name
          color
        }
        tags {
          id
          name
        }
        createdAt
        updatedAt
      }
      meta {
        total
        page
        limit
        totalPages
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      priority
      status
      dueDate
      completedAt
      isOverdue
      daysUntilDue
      completionPercentage
      category {
        id
        name
        color
      }
      tags {
        id
        name
      }
      dependencies {
        id
        dependsOn {
          id
          title
          status
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_OVERDUE_TASKS = gql`
  query GetOverdueTasks {
    overdueTasks {
      id
      title
      priority
      status
      dueDate
      isOverdue
      daysUntilDue
    }
  }
`;

export const GET_UPCOMING_TASKS = gql`
  query GetUpcomingTasks($days: Int) {
    upcomingTasks(days: $days) {
      id
      title
      priority
      status
      dueDate
      daysUntilDue
    }
  }
`;
