import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

type RouteState = "loaded" | "empty" | "error" | "loading" | "permission-denied";

type RoutePlaceholderProps = {
  route: string;
  description: string;
  state: RouteState;
};

const badgeColor: Record<RouteState, string> = {
  loaded: "#10b981",
  empty: "#a78bfa",
  error: "#ef4444",
  loading: "#f59e0b",
  "permission-denied": "#f97316",
};

function RoutePlaceholder({ route, description, state }: RoutePlaceholderProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #0b1224 100%)",
        color: "white",
        padding: "32px",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 14px",
          borderRadius: "14px",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "18px",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "90px",
            padding: "6px 10px",
            borderRadius: "10px",
            backgroundColor: badgeColor[state],
            color: "#0b1224",
            fontWeight: 700,
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {state}
        </span>
        <code
          style={{
            fontSize: "13px",
            background: "rgba(255,255,255,0.08)",
            padding: "6px 10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {route}
        </code>
      </div>

      <div
        style={{
          maxWidth: "860px",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "rgba(255,255,255,0.04)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "10px", fontWeight: 700 }}>
          {route}
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.5, color: "rgba(255,255,255,0.82)" }}>
          {description}
        </p>
        <p style={{ fontSize: "14px", marginTop: "12px", color: "rgba(255,255,255,0.7)" }}>
          Replace this placeholder with mocked data and real UI components for this route.
        </p>
      </div>
    </div>
  );
}

const meta: Meta<typeof RoutePlaceholder> = {
  title: "Routes/Primary",
  component: RoutePlaceholder,
  args: {
    state: "loaded" as RouteState,
  },
  argTypes: {
    state: {
      control: "select",
      options: ["loaded", "empty", "error", "loading", "permission-denied"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RoutePlaceholder>;

export const HomeDashboard: Story = {
  args: {
    route: "/",
    description: "Personalized home/dashboard view with cards for gear, songs, money, bands, notifications, and quick actions.",
  },
};

export const AuthSignin: Story = {
  args: {
    route: "/auth/signin",
    description: "User sign-in form with validation, error states, and passwordless options.",
  },
};

export const AuthSignup: Story = {
  args: {
    route: "/auth/signup",
    description: "User sign-up flow with validation, consent, and post-signup routing.",
  },
};

export const AuthForgotReset: Story = {
  args: {
    route: "/auth/forgot-password / reset-password",
    description: "Reset password flow: request, email sent, reset form, and confirmation.",
  },
};

export const OnboardingCreateProfile: Story = {
  args: {
    route: "/auth/create-profile / onboarding",
    description: "Profile creation with role/skill selection and initial preferences.",
  },
};

export const GearList: Story = {
  args: {
    route: "/gear",
    description: "Gear list with filters, sorting, empty state, and error handling.",
  },
};

export const GearDetail: Story = {
  args: {
    route: "/gear/[id]",
    description: "Gear detail view with images, specs, maintenance, and enrichment status.",
  },
};

export const GearNew: Story = {
  args: {
    route: "/gear/new",
    description: "New gear creation flow with validation, brand/model assists, and save states.",
  },
};

export const SongsLibrary: Story = {
  args: {
    route: "/songs",
    description: "Song library browser with filters, search, empty/error states.",
  },
};

export const SongEdit: Story = {
  args: {
    route: "/songs/[id]/edit",
    description: "Song edit page with metadata, links, and validation.",
  },
};

export const SetlistsList: Story = {
  args: {
    route: "/setlists",
    description: "Setlists overview with creation CTA, empty/loaded/error states.",
  },
};

export const SetlistsWizard: Story = {
  args: {
    route: "/setlists/wizard",
    description: "Guided setlist creation wizard with step validation and success/error.",
  },
};

export const CalendarEvents: Story = {
  args: {
    route: "/calendar/events",
    description: "Calendar events list/agenda with filters, empty/error states.",
  },
};

export const CalendarEventDetail: Story = {
  args: {
    route: "/calendar/events/[id]",
    description: "Event detail/edit view with attendees, conflicts, and recurrence.",
  },
};

export const PracticeDashboard: Story = {
  args: {
    route: "/practice",
    description: "Practice dashboard with summaries, prompts, and quick actions.",
  },
};

export const PracticeNew: Story = {
  args: {
    route: "/practice/new",
    description: "Start a practice session; timer, notes, save success/error.",
  },
};

export const ChildrenDetail: Story = {
  args: {
    route: "/children/[username]",
    description: "Child detail page with assignments, goals, instruments, and practice summaries.",
  },
};

export const Family: Story = {
  args: {
    route: "/family",
    description: "Family management: members list, invites, and permissions.",
  },
};

export const BandsOverview: Story = {
  args: {
    route: "/bands/[id]",
    description: "Band overview with tabs for members, setlists, events, gear, and finances.",
  },
};

export const MoneyBills: Story = {
  args: {
    route: "/money/bills",
    description: "Bills list with status filters, empty/error states.",
  },
};

export const MoneyBillDetail: Story = {
  args: {
    route: "/money/bills/[id]",
    description: "Bill detail with payments, attachments, and status changes.",
  },
};

export const TransactionsList: Story = {
  args: {
    route: "/transactions",
    description: "Transactions list with filters (date/category) and empty/error states.",
  },
};

export const TransactionsNew: Story = {
  args: {
    route: "/transactions/new",
    description: "New transaction form with validation and save success/error.",
  },
};

export const ReceiptsCapture: Story = {
  args: {
    route: "/receipts/capture",
    description: "Receipt capture/upload flow with uploading/success/error states.",
  },
};

export const ReceiptsDetail: Story = {
  args: {
    route: "/receipts/[id]",
    description: "Receipt detail view with processing status and linked items.",
  },
};

export const NotificationsInbox: Story = {
  args: {
    route: "/notifications",
    description: "Notifications inbox with unread/read, empty, and error states.",
  },
};

export const NotificationsSettings: Story = {
  args: {
    route: "/notifications/settings",
    description: "Notification preferences toggles; save success/error.",
  },
};

export const SettingsAccount: Story = {
  args: {
    route: "/settings/account",
    description: "Account/profile settings with editable fields and validation.",
  },
};

export const SettingsConnections: Story = {
  args: {
    route: "/settings/connections",
    description: "Connections (Spotify/Google Calendar) connected/disconnected/error states.",
  },
};

export const SettingsPreferences: Story = {
  args: {
    route: "/settings/preferences",
    description: "Preferences for roles/skills/language; validation and save states.",
  },
};

export const TeacherStudents: Story = {
  args: {
    route: "/teacher/students",
    description: "Teacher students list with invite modal; empty/error states.",
  },
};

export const TeacherStudentDetail: Story = {
  args: {
    route: "/teacher/students/[id]",
    description: "Student detail with assignments, progress, and notes.",
  },
};

export const AssignmentsList: Story = {
  args: {
    route: "/assignments",
    description: "Assignments list (student view) with empty/error states.",
  },
};

export const AssignmentWork: Story = {
  args: {
    route: "/assignments/[id]/work",
    description: "Assignment work view: not started, in progress, submitted, error.",
  },
};

export const ParentOverview: Story = {
  args: {
    route: "/parent",
    description: "Parent overview with events, children summaries, and quick actions.",
  },
};

export const PublicProfile: Story = {
  args: {
    route: "/u/[username]",
    description: "Public profile page: found/not-found, social links, and content.",
  },
};

