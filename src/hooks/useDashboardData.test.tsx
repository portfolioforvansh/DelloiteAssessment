import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { useDashboardData } from "./useDashboardData";

jest.mock("../api/users", () => ({
  fetchUsers: jest.fn(),
}));

const { fetchUsers } = require("../api/users");

function TestComponent() {
  const { users, loadingUsers, errorUsers, apiStates, apiConfigs } = useDashboardData();

  return (
    <div>
      <div data-testid="users-count">{users.length}</div>
      <div data-testid="loading-users">{String(loadingUsers)}</div>
      <div data-testid="error-users">{errorUsers ?? ""}</div>
      <div data-testid="apis">
        {apiConfigs.slice(1).map((cfg: any, i: number) => (
          <div key={cfg.name} data-testid={`api-${i}`}>
            <span data-testid={`api-name-${i}`}>{cfg.name}</span>
            <span data-testid={`api-loading-${i}`}>{String(apiStates[i]?.loading)}</span>
            <span data-testid={`api-error-${i}`}>{apiStates[i]?.error ?? ""}</span>
            <span data-testid={`api-count-${i}`}>
              {Array.isArray(apiStates[i]?.data) ? apiStates[i].data.length : (apiStates[i]?.data ? "1" : "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("useDashboardData", () => {
  it("loads all APIs successfully", async () => {
    const mockUsers = [
      {
        login: { uuid: "1" },
        name: { first: "John", last: "Doe" },
        dob: { age: 30 },
        location: { city: "NY", country: "USA" },
        picture: { thumbnail: "a.jpg" },
      },
    ];
    fetchUsers.mockResolvedValue(mockUsers);

    const posts = Array.from({ length: 10 }, (_, i) => ({ id: i }));
    const comments = Array.from({ length: 20 }, (_, i) => ({ id: i }));
    const todos = Array.from({ length: 5 }, (_, i) => ({ id: i }));

    (global as any).fetch = jest.fn((url: string) => {
      if (url.includes("posts")) return Promise.resolve({ ok: true, json: () => Promise.resolve(posts) });
      if (url.includes("comments")) return Promise.resolve({ ok: true, json: () => Promise.resolve(comments) });
      if (url.includes("todos")) return Promise.resolve({ ok: true, json: () => Promise.resolve(todos) });
      return Promise.reject(new Error("unknown"));
    });

    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId("users-count")).toHaveTextContent("1"));
    expect(screen.getByTestId("loading-users")).toHaveTextContent("false");
    await waitFor(() => expect(screen.getByTestId("api-count-0")).toHaveTextContent("10"));
    expect(screen.getByTestId("api-count-1")).toHaveTextContent("20");
    expect(screen.getByTestId("api-count-2")).toHaveTextContent("5");
  });

  it("handles users API failure", async () => {
    fetchUsers.mockRejectedValue(new Error("users fail"));

    const posts = Array.from({ length: 2 }, (_, i) => ({ id: i }));
    (global as any).fetch = jest.fn((url: string) => {
      if (url.includes("posts")) return Promise.resolve({ ok: true, json: () => Promise.resolve(posts) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId("error-users")).toHaveTextContent("Failed to load users."));
    expect(screen.getByTestId("loading-users")).toHaveTextContent("false");
  });

  it("handles partial failure of other APIs", async () => {
    const mockUsers = [
      {
        login: { uuid: "2" },
        name: { first: "Jane", last: "Smith" },
        dob: { age: 28 },
        location: { city: "LA", country: "USA" },
        picture: { thumbnail: "b.jpg" },
      },
    ];
    fetchUsers.mockResolvedValue(mockUsers);

    (global as any).fetch = jest.fn((url: string) => {
      if (url.includes("posts")) return Promise.resolve({ ok: true, json: () => Promise.resolve([1, 2, 3]) });
      if (url.includes("comments")) return Promise.reject(new Error("comments fail"));
      if (url.includes("todos")) return Promise.resolve({ ok: true, json: () => Promise.resolve([1]) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId("users-count")).toHaveTextContent("1"));
    await waitFor(() => expect(screen.getByTestId("api-count-0")).toHaveTextContent("3"));
    await waitFor(() => expect(screen.getByTestId("api-error-1")).toHaveTextContent("Failed to load."));
    expect(screen.getByTestId("api-count-2")).toHaveTextContent("1");
  });
});
