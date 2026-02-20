import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($published: Boolean) {
    posts(published: $published) {
      id
      title
      content
      published
      createdAt
      updatedAt
      author {
        id
        username
        email
        firstName
        lastName
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
        }
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      published
      createdAt
      updatedAt
      author {
        id
        username
        email
        firstName
        lastName
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
          email
          firstName
          lastName
        }
      }
    }
  }
`;
