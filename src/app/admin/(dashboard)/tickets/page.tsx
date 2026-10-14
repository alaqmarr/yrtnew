import { ticketRepository } from "@/modules/account/repository/ticket.repository";
import AdminTicketsManager from "@/modules/account/components/AdminTicketsManager";

export const metadata = {
  title: "Support Tickets & Requests | YR Admin",
};

export default async function AdminTicketsPage() {
  const tickets = await ticketRepository.findAll();
  return <AdminTicketsManager initialTickets={tickets} />;
}
