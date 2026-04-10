import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";
import { describe, expect, test, vi } from "vitest";

describe("Button", () => {
  // Basic rendering
  test("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  test("renders button with child elements", () => {
    render(
      <Button>
        <span>Icon</span>
        Label
      </Button>
    );
    expect(screen.getByText("Label")).toBeDefined();
    expect(screen.getByText("Icon")).toBeDefined();
  });

  // Props and attributes
  test("passes className to button element", () => {
    const { container } = render(
      <Button className="custom-class">Test</Button>
    );
    const button = container.querySelector("button.custom-class");
    expect(button).toBeDefined();
  });

  test("passes variant prop to button", () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector("button");
    expect(button?.className).toContain("outline");
  });

  test("passes size prop to button", () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector("button");
    expect(button?.className).toContain("lg");
  });

  // Disabled state
  test("disables button when disabled prop is true", () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveProperty("disabled", true);
  });

  test("disables button when isLoading prop is true", () => {
    const { container } = render(
      <Button isLoading={true}>Loading</Button>
    );
    const button = container.querySelector("button");
    expect(button).toHaveProperty("disabled", true);
  });

  test("disables button when both isLoading and disabled are true", () => {
    const { container } = render(
      <Button isLoading={true} disabled>
        Loading
      </Button>
    );
    const button = container.querySelector("button");
    expect(button).toHaveProperty("disabled", true);
  });

  // Loading state
  test("shows loading state with spinner icon", () => {
    const { container } = render(
      <Button isLoading={true}>Submit</Button>
    );
    const loader = container.querySelector("svg.lucide-loader-circle");
    expect(loader).toBeDefined();
    expect(loader?.classList.contains("animate-spin")).toBe(true);
  });

  test("shows loading spinner with data-icon attribute", () => {
    const { container } = render(
      <Button isLoading={true}>Loading</Button>
    );
    const spinner = container.querySelector('[data-icon="inline-start"]');
    expect(spinner).toBeDefined();
  });

  test("shows original children when not loading", () => {
    render(<Button isLoading={false}>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  test("shows loadingLabel when provided and loading", () => {
    render(
      <Button isLoading={true} loadingLabel="Please wait...">
        Submit
      </Button>
    );
    expect(screen.getByText("Please wait...")).toBeDefined();
    expect(screen.queryByText("Submit")).toBeNull();
  });

  test("shows original children when loadingLabel not provided and loading", () => {
    render(
      <Button isLoading={true}>
        Submit
      </Button>
    );
    expect(screen.getByText("Submit")).toBeDefined();
  });

  // Accessibility
  test("sets aria-busy when loading", () => {
    const { container } = render(
      <Button isLoading={true}>Loading</Button>
    );
    const button = container.querySelector("button");
    expect(button?.getAttribute("aria-busy")).toBe("true");
  });

  test("does not set aria-busy when not loading", () => {
    const { container } = render(
      <Button isLoading={false}>Not loading</Button>
    );
    const button = container.querySelector("button");
    expect(button?.getAttribute("aria-busy")).toBeNull();
  });

  // Click handlers
  test("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not call onClick when button is disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByText("Disabled"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("does not call onClick when button is loading", () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading={true} onClick={handleClick}>
        Loading
      </Button>
    );
    const button = screen.getByText("Loading");
    // Note: The button is disabled, so click should not trigger
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Type attribute
  test("accepts type prop", () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    const button = container.querySelector("button");
    expect(button?.getAttribute("type")).toBe("submit");
  });

  test("defaults to button type when not specified", () => {
    const { container } = render(<Button>Default</Button>);
    const button = container.querySelector("button");
    expect(button?.getAttribute("type")).toBe("button");
  });

  // Multiple variants combination
  test("works with variant and size together", () => {
    const { container } = render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    );
    const button = container.querySelector("button");
    expect(button?.className).toContain("destructive");
    // For size "sm", the class includes h-7 (or similar height class)
    const className = button?.className || "";
    expect(className).toMatch(/h-[0-9]/);
  });

  test("works with loading and custom variant", () => {
    render(
      <Button isLoading={true} variant="secondary">
        Loading
      </Button>
    );
    const button = screen.getByText("Loading");
    expect(button).toBeDefined();
    expect(button?.className).toContain("secondary");
  });
});
