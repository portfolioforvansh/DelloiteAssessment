import { useEffect, useRef, useState } from "react";
import { fetchUsers } from "../api/users";

type User = {
  login: { uuid: string };
  name: { first: string; last: string };
  dob: { age: number };
  location: { city: string; country: string };
  picture: { thumbnail: string };
};

type ApiState = {
  loading: boolean;
  error: string | null;
  data: any;
};

const apiConfigs = [
  {
    name: "Users (High Priority)",
    fetch: fetchUsers,
  },
  {
    name: "Posts",
    fetch: () => fetch("https://jsonplaceholder.typicode.com/posts").then(res => res.json()),
  },
  {
    name: "Comments",
    fetch: () => fetch("https://jsonplaceholder.typicode.com/comments").then(res => res.json()),
  },
  {
    name: "Todos",
    fetch: () => fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json()),
  },
];

export function useDashboardData() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [apiStates, setApiStates] = useState<ApiState[]>(
    Array(apiConfigs.length - 1).fill({ loading: true, error: null, data: null })
  );
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    setLoadingUsers(true);
    setErrorUsers(null);

    Promise.allSettled([
      apiConfigs[0].fetch(),
      ...apiConfigs.slice(1).map(api => api.fetch()),
    ]).then(results => {
      const usersResult = results[0];
      if (usersResult.status === "fulfilled") {
        setUsers(usersResult.value);
        setLoadingUsers(false);
      } else {
        setErrorUsers("Failed to load users.");
        setLoadingUsers(false);
      }
      setApiStates(
        results.slice(1).map(result => ({
          loading: false,
          error: result.status === "fulfilled" ? null : "Failed to load.",
          data: result.status === "fulfilled" ? result.value : null,
        }))
      );
    });
  }, []);

  return {
    users,
    loadingUsers,
    errorUsers,
    apiStates,
    apiConfigs,
  };
}
