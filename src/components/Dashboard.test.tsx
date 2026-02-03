import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import * as useDashboardDataHook from "../hooks/useDashboardData";
import Dashboard from "./Dashboard";

jest.mock("../hooks/useDashboardData");

const mockUsers = [
  {
    login: { uuid: "1" },
    name: { first: "John", last: "Doe" },
    dob: { age: 30 },
    location: { city: "New York", country: "USA" },
    picture: { thumbnail: "avatar.jpg" },
  },
];

const mockApiStates = [
  { loading: false, error: null, data: Array(10).fill({}) },
  { loading: false, error: null, data: Array(20).fill({}) },
  { loading: false, error: null, data: Array(30).fill({}) },
];

const mockApiConfigs = [
  { name: "Users (High Priority)" },
  { name: "Posts" },
  { name: "Comments" },
  { name: "Todos" },
];

describe("Dashboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state for users", () => {
    (useDashboardDataHook.useDashboardData as jest.Mock).mockReturnValue({
      users: [],
      loadingUsers: true,
      errorUsers: null,
      apiStates: [],
      apiConfigs: mockApiConfigs,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Loading users/i)).toBeInTheDocument();
  });

  it("renders error state for users", () => {
    (useDashboardDataHook.useDashboardData as jest.Mock).mockReturnValue({
      users: [],
      loadingUsers: false,
      errorUsers: "Failed to load users.",
      apiStates: [],
      apiConfigs: mockApiConfigs,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Failed to load users/i)).toBeInTheDocument();
  });

  it("renders user list when loaded", async () => {
    (useDashboardDataHook.useDashboardData as jest.Mock).mockReturnValue({
      users: mockUsers,
      loadingUsers: false,
      errorUsers: null,
      apiStates: mockApiStates,
      apiConfigs: mockApiConfigs,
    });

    render(<Dashboard />);
    expect(screen.getByText(/User List/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  it("renders loading and loaded states for other APIs", async () => {
    (useDashboardDataHook.useDashboardData as jest.Mock).mockReturnValue({
      users: mockUsers,
      loadingUsers: false,
      errorUsers: null,
      apiStates: [
        { loading: true, error: null, data: null },
        { loading: false, error: null, data: Array(5).fill({}) },
        { loading: false, error: "Failed to load.", data: null },
      ],
      apiConfigs: [
        { name: "Users (High Priority)" },
        { name: "Posts" },
        { name: "Comments" },
        { name: "Todos" },
      ],
    });

    render(<Dashboard />);
    expect(screen.getByText(/Posts/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.getByText(/Loaded 5 records/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load./i)).toBeInTheDocument();
  });
});
