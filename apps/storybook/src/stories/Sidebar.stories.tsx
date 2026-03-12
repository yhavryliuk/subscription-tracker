import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Sidebar } from "@repo/ui";

const meta = {
  title: "Foundations/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SidebarContent = () => (
  <>
    <Sidebar.Header>Pulse</Sidebar.Header>
    <Sidebar.Nav>
      <Sidebar.NavItem href="/account/dashboard">Overview</Sidebar.NavItem>
      <Sidebar.NavItem href="/account/subscriptions">Subscriptions</Sidebar.NavItem>
      <Sidebar.NavItem href="/account/billing">Billing</Sidebar.NavItem>
      <Sidebar.NavItem href="/account/settings">Settings</Sidebar.NavItem>
    </Sidebar.Nav>
    <Sidebar.Footer>Plan: Pro · Next invoice Oct 12</Sidebar.Footer>
  </>
);

export const DesktopLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-5xl gap-6 p-6">
        <Sidebar isOpen onClose={() => {}}>
          <SidebarContent />
        </Sidebar>
        <main className="flex-1 rounded-2xl bg-white p-6 text-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Review your current plan, payment methods, and upcoming renewals.
          </p>
        </main>
      </div>
    </div>
  ),
};

export const MobileOverlay: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => (
    <div className="relative h-screen bg-slate-100">
      <Sidebar isOpen onClose={() => {}}>
        <SidebarContent />
      </Sidebar>
      <div className="p-6 text-sm text-slate-600">
        Tap outside the panel to close it.
      </div>
    </div>
  ),
};
