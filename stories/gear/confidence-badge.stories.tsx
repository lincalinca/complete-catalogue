import type { Meta, StoryObj } from "@storybook/react";
import { ConfidenceBadge } from "@/components/gear/molecules/confidence-badge";

const meta: Meta<typeof ConfidenceBadge> = {
  title: "Gear/ConfidenceBadge",
  component: ConfidenceBadge,
  args: {
    confidence: 0.42,
  },
};

export default meta;
type Story = StoryObj<typeof ConfidenceBadge>;

export const Low: Story = {
  args: { confidence: 0.12 },
};

export const Medium: Story = {
  args: { confidence: 0.58 },
};

export const High: Story = {
  args: { confidence: 0.93 },
};

