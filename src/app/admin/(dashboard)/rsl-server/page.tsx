import AdminRslServerView from "@/modules/rsl-server/components/AdminRslServerView";

export const revalidate = 0;

export const metadata = {
  title: "RSL Server & Telemetry | YR Admin",
};

export default function AdminRslServerPage() {
  return <AdminRslServerView />;
}
