import { gql } from '@apollo/client';

export const CREATE_HABIT = gql`
  mutation CreateHabit($createHabitInput: CreateHabitInput!) {
    createHabit(createHabitInput: $createHabitInput) {
      id
      name
      description
      frequency
      targetDays
      color
      streak {
        currentStreak
        longestStreak
      }
      logs {
        id
        date
        completed
        notes
      }
      createdAt
    }
  }
`;

export const UPDATE_HABIT = gql`
  mutation UpdateHabit($id: ID!, $updateHabitInput: UpdateHabitInput!) {
    updateHabit(id: $id, updateHabitInput: $updateHabitInput) {
      id
      name
      description
      frequency
      targetDays
      color
    }
  }
`;

export const LOG_HABIT = gql`
  mutation LogHabit($habitId: ID!, $date: String!, $completed: Boolean!, $notes: String) {
    logHabit(habitId: $habitId, date: $date, completed: $completed, notes: $notes) {
      id
      date
      completed
      notes
    }
  }
`;

export const DELETE_HABIT = gql`
  mutation RemoveHabit($id: ID!) {
    removeHabit(id: $id)
  }
`;
