import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      username
      firstName
      lastName
      createdAt
      posts {
        id
        title
        published
        createdAt
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      firstName
      lastName
      createdAt
    }
  }
`;
