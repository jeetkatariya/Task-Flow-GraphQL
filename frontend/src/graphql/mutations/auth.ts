import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($signupInput: SignupInput!) {
    signup(signupInput: $signupInput) {
      access_token
      user {
        id
        email
        username
        firstName
        lastName
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        email
        username
        firstName
        lastName
      }
    }
  }
`;
