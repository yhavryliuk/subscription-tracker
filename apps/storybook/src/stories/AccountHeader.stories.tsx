import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AccountHeader } from "@repo/ui";

const meta = {
  title: "Patterns/AccountHeader",
  component: AccountHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    userName: "example@gmail.com",
    handleOpenMenu: () => {},
  },
} satisfies Meta<typeof AccountHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-screen bg-slate-100">
      <AccountHeader {...args} />
      <div className="p-6 text-sm text-slate-600">
        This area represents the account dashboard content.
      </div>
    </div>
  ),
};
