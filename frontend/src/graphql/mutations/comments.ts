import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      content
      createdAt
      author {
        id
        username
        email
      }
      post {
        id
        title
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $updateCommentInput: UpdateCommentInput!) {
    updateComment(id: $id, updateCommentInput: $updateCommentInput) {
      id
      content
      updatedAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    removeComment(id: $id)
  }
`;
