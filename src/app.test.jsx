import { test, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

// Flexible AuthContext mock
const mockUseAuth = vi.fn();
vi.mock("./context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }) => children,
}));

beforeEach(() => {
  mockUseAuth.mockReturnValue({ user: null, login: vi.fn(), logout: vi.fn() });
});

test("1. Renders App component without crashing", () => {
  const { container } = render(<App />);
  expect(container).toBeDefined();
});

test("2. Mounts main wrapper container into the DOM", () => {
  const { container } = render(<App />);
  expect(container.childElementCount).toBeGreaterThan(0);
});

test("3. Renders correctly for unauthenticated users", () => {
  mockUseAuth.mockReturnValue({ user: null });
  const { container } = render(<App />);
  expect(container.querySelector("div")).toBeTruthy();
});

test("4. Renders correctly for authenticated users", () => {
  mockUseAuth.mockReturnValue({ user: { id: 1, name: "Abdinasir" } });
  const { container } = render(<App />);
  expect(container.querySelector("div")).toBeTruthy();
});

test("5. Executes layout render without throwing errors", () => {
  expect(() => render(<App />)).not.toThrow();
});