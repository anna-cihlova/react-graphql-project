import "./App.css";
import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState } from "react";

// Query
const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    }
  }
`;

// Mutation
const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({ name: "", age: "" });
  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);
  const {
    data: getUserByIdData,
    error: getUserByIdError,
    loading: getUserByIdLoading,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: "2" },
  });
  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  if (getUsersLoading || getUserByIdLoading) return <p>Data loading...</p>;
  if (getUsersError || getUserByIdError)
    return <p>Error: {getUsersError?.message || getUserByIdError?.message}</p>;

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.age) return;
    await createUser({
      variables: {
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false,
      },
    });
    setNewUser({});
  };
  return (
    <>
      <div>
        <h1>Add User</h1>
        <input
          placeholder="Name"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
          value={newUser.name || ""}
        />
        <input
          placeholder="Age"
          type="number"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
          value={newUser.age || ""}
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>
      <div>
        <h1>Chosen User</h1>
        <p>{getUserByIdData?.getUserById?.name}</p>
        <p>{getUserByIdData?.getUserById?.age}</p>
      </div>
      <div>
        <h1>Users</h1>
        {getUsersData?.getUsers?.map((user) => (
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Is this user married: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
