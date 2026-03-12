import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { expect, test } from "vitest";

test("renders button with text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeDefined();
});
