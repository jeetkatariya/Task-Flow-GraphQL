import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Operation: ${operation.operationName}, Message: ${message}, Path: ${path}`,
        { locations, variables: operation.variables },
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError.message}`, { operation: operation.operationName });
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tasks: { merge: true },
          habits: { merge: false },
          reminders: { merge: false },
          notes: { merge: false },
          pinnedNotes: { merge: false },
        },
      },
      Task: { keyFields: ['id'] },
      Note: { keyFields: ['id'] },
      Habit: { keyFields: ['id'] },
      HabitLog: { keyFields: ['id'] },
      Reminder: { keyFields: ['id'] },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  },
});
