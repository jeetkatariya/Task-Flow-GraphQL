import { gql } from '@apollo/client';

export const GET_REMINDERS = gql`
  query GetReminders($upcoming: Boolean) {
    reminders(upcoming: $upcoming) {
      id
      title
      description
      reminderTime
      timezone
      isRecurring
      recurrencePattern {
        frequency
        interval
      }
      isCompleted
      task {
        id
        title
      }
      note {
        id
        title
      }
    }
  }
`;

export const GET_ALL_REMINDERS = gql`
  query GetAllReminders {
    reminders {
      id
      title
      description
      reminderTime
      timezone
      isRecurring
      recurrencePattern {
        frequency
        interval
      }
      isCompleted
      task {
        id
        title
      }
      note {
        id
        title
      }
    }
  }
`;

export const GET_REMINDER = gql`
  query GetReminder($id: ID!) {
    reminder(id: $id) {
      id
      title
      description
      reminderTime
      timezone
      isRecurring
      recurrencePattern {
        frequency
        interval
        byDay
        byMonth
        until
      }
      isCompleted
      task {
        id
        title
      }
      note {
        id
        title
      }
    }
  }
`;

export const GET_REMINDERS_FOR_DATE = gql`
  query GetRemindersForDate($date: String!) {
    remindersForDate(date: $date) {
      id
      title
      reminderTime
      isCompleted
    }
  }
`;
