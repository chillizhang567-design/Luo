import AppShell from "@/components/AppShell";
import DriftExperience from "@/components/DriftExperience";
import "../recorder.css";
import "../reference-overrides.css";

export const metadata = {
  title: "Drift — The Recorder",
  description: "An AI-directed interactive documentary experience.",
};

export default function RecorderPage() {
  return (
    <AppShell>
      <DriftExperience />
    </AppShell>
  );
}
