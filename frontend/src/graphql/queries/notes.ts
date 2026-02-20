import { gql } from '@apollo/client';

export const GET_NOTES = gql`
  query GetNotes($search: NoteSearchInput) {
    notes(search: $search) {
      id
      title
      content
      isPinned
      isArchived
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
  }
`;

export const GET_NOTE = gql`
  query GetNote($id: ID!) {
    note(id: $id) {
      id
      title
      content
      isPinned
      isArchived
      category {
        id
        name
        color
      }
      tags {
        id
        name
      }
      attachments {
        id
        fileName
        fileUrl
        fileType
        fileSize
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PINNED_NOTES = gql`
  query GetPinnedNotes {
    pinnedNotes {
      id
      title
      content
      isPinned
      category {
        id
        name
      }
      tags {
        id
        name
      }
      updatedAt
    }
  }
`;

export const GET_RECENT_NOTES = gql`
  query GetRecentNotes($limit: Int) {
    recentNotes(limit: $limit) {
      id
      title
      content
      updatedAt
    }
  }
`;
