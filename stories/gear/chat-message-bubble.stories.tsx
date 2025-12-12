import type { Meta, StoryObj } from "@storybook/react";
import { ChatMessageBubble } from "@/components/gear/molecules/chat-message-bubble";

const meta: Meta<typeof ChatMessageBubble> = {
  title: "Gear/ChatMessageBubble",
  component: ChatMessageBubble,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ChatMessageBubble>;

export const Assistant: Story = {
  args: {
    sender: "assistant",
    text: "Hi! I'm here to help you add your gear.\n\nTell me the brand and model, and I'll handle the details.",
  },
  render: (args) => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6">
      <ChatMessageBubble {...args} />
    </div>
  ),
};

export const User: Story = {
  args: {
    sender: "user",
    text: "Adding a Fender Telecaster, white, 1997. Might have a maple neck.",
  },
  render: (args) => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6">
      <ChatMessageBubble {...args} />
    </div>
  ),
};

export const Conversation: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 space-y-3">
      <ChatMessageBubble
        sender="assistant"
        text="Hi! Let's add your gear. What's the brand and model?"
      />
      <ChatMessageBubble
        sender="user"
        text="It's a Fender Telecaster, 1997, in white."
      />
      <ChatMessageBubble
        sender="assistant"
        text="Got it. Any other details—like condition, serial number, or pickup type?"
      />
    </div>
  ),
};

