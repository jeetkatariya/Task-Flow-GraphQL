import { gql } from '@apollo/client';

export const CREATE_REMINDER = gql`
  mutation CreateReminder($createReminderInput: CreateReminderInput!) {
    createReminder(createReminderInput: $createReminderInput) {
      id
      title
      description
      reminderTime
      timezone
      isRecurring
    }
  }
`;

export const UPDATE_REMINDER = gql`
  mutation UpdateReminder($id: ID!, $updateReminderInput: UpdateReminderInput!) {
    updateReminder(id: $id, updateReminderInput: $updateReminderInput) {
      id
      title
      description
      reminderTime
      timezone
      isRecurring
    }
  }
`;

export const SNOOZE_REMINDER = gql`
  mutation SnoozeReminder($id: ID!, $minutes: Float!) {
    snoozeReminder(id: $id, minutes: $minutes) {
      id
      reminderTime
    }
  }
`;

export const COMPLETE_REMINDER = gql`
  mutation CompleteReminder($id: ID!) {
    completeReminder(id: $id) {
      id
      isCompleted
    }
  }
`;

export const DELETE_REMINDER = gql`
  mutation RemoveReminder($id: ID!) {
    removeReminder(id: $id)
  }
`;
