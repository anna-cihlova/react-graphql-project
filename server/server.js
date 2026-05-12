import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";

const users = [
  { id: "1", name: "Padmé Amidala", age: 27, isMarried: true },
  { id: "2", name: "Luke Skywalker", age: 23, isMarried: false },
  { id: "3", name: "Han Solo", age: 32, isMarried: true },
];

const typeDefs = gql`
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, age: Int!, isMarried: Boolean!): User
  }

  type User {
    id: ID!
    name: String
    age: Int
    isMarried: Boolean
  }
`;

// Tell our API how to deal with our typeDefs
const resolvers = {
  Query: {
    getUsers: () => users,
    getUserById: (parent, args) => users.find((user) => user.id === args.id),
  },
  Mutation: {
    createUser: (parent, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isMarried,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`Server running at ${url}`);
}

startApolloServer();
