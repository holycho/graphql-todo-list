import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";

const wsLink = new WebSocketLink({
    uri: `ws://35.189.161.175:8080/v1/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'myadminsecretkey'
            }
        }
    },
});

export default new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache(),
})