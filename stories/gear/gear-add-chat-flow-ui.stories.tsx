import type { Meta, StoryObj } from "@storybook/react";
import {
  TypeSelectionChips,
  FollowupChips,
  SummaryView,
  ProcessingIndicator,
} from "@/components/gear/organisms/gear-add-chat-flow-ui";
import { INITIAL_MESSAGE, COMMON_ATTRIBUTES } from "@/components/gear/organisms/gear-add-chat-flow-content";
import type { ExtractedFields, ExtractionConfidences } from "@/components/gear/organisms/gear-add-chat-flow-types";
import { useState } from "react";

const meta: Meta = {
  title: "Gear/Add Chat Flow UI",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const TypeSelection: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-start px-6 py-10">
      <TypeSelectionChips onSelect={(categoryId, typeName) => {
        console.log("Type selected", { categoryId, typeName });
      }} />
    </div>
  ),
};

export const FollowupBrands: Story = {
  render: () => {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex flex-col gap-4 px-6 py-10">
        <FollowupChips
          question="brand"
          categoryId={1}
          onSelect={(value) => console.log("Brand selected", value)}
          onAddMessage={(message) => setMessages((prev) => [...prev, message])}
        />
        <div className="text-xs text-white/50">
          Messages logged: {messages.length}
        </div>
      </div>
    );
  },
};

export const Processing: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center px-6 py-10">
      <ProcessingIndicator text="Thinking..." />
    </div>
  ),
};

export const Summary: Story = {
  render: () => {
    const extractedFields: ExtractedFields = {
      brand: "Fender",
      model: "Telecaster",
      color: "White",
      color_hex: "#f8f9fb",
      manufactured_year: 1997,
      serial_number: "SN-12345",
      purchase_price: 1200,
      condition: "Excellent",
    };

    const confidences: ExtractionConfidences = {
      brand: 0.92,
      model: 0.88,
      color: 0.76,
      year: 0.63,
      overall: 0.7,
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-start px-6 py-10">
        <SummaryView
          extractedFields={extractedFields}
          confidences={confidences}
          error={null}
          isSaving={false}
          onStartOver={() => console.log("Start over")}
          onTryAgain={() => console.log("Try again")}
          onSkipAI={() => console.log("Skip AI")}
          onConfirm={() => console.log("Confirm")}
          onAddAttribute={(attr) => console.log("Add attribute", attr)}
        />
      </div>
    );
  },
};
