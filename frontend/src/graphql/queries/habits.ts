import { gql } from '@apollo/client';

export const GET_HABITS = gql`
  query GetHabits {
    habits {
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
      createdAt
    }
  }
`;

export const GET_HABIT = gql`
  query GetHabit($id: ID!) {
    habit(id: $id) {
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
    }
  }
`;

export const GET_HABIT_STREAK = gql`
  query GetHabitStreak($habitId: ID!) {
    habitStreak(habitId: $habitId) {
      currentStreak
      longestStreak
    }
  }
`;

export const GET_HABIT_STATS = gql`
  query GetHabitStats($habitId: ID!, $periodDays: Int) {
    habitStats(habitId: $habitId, periodDays: $periodDays) {
      totalDays
      completedDays
      completionRate
      currentStreak
      longestStreak
      weeklyCompletion
    }
  }
`;
