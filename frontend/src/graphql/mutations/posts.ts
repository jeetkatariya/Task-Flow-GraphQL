import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
      title
      content
      published
      createdAt
      author {
        id
        username
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $updatePostInput: UpdatePostInput!) {
    updatePost(id: $id, updatePostInput: $updatePostInput) {
      id
      title
      content
      published
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    removePost(id: $id)
  }
`;
