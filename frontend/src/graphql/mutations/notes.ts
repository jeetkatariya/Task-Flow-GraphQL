import { gql } from '@apollo/client';

export const CREATE_NOTE = gql`
  mutation CreateNote($createNoteInput: CreateNoteInput!) {
    createNote(createNoteInput: $createNoteInput) {
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
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $updateNoteInput: UpdateNoteInput!) {
    updateNote(id: $id, updateNoteInput: $updateNoteInput) {
      id
      title
      content
      isPinned
    }
  }
`;

export const PIN_NOTE = gql`
  mutation PinNote($id: ID!) {
    pinNote(id: $id) {
      id
      isPinned
    }
  }
`;

export const UNPIN_NOTE = gql`
  mutation UnpinNote($id: ID!) {
    unpinNote(id: $id) {
      id
      isPinned
    }
  }
`;

export const ARCHIVE_NOTE = gql`
  mutation ArchiveNote($id: ID!) {
    archiveNote(id: $id) {
      id
      isArchived
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation RemoveNote($id: ID!) {
    removeNote(id: $id)
  }
`;
