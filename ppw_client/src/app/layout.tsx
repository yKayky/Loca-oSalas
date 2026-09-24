import './globals.css'; import { ReservaProvider } from '@/components/reservas/reserva-provider'; import { Sidebar } from '@/components/layout/sidebar';
export const metadata = { title: 'Agenda Coworking', description: 'MVP acadêmico de agendamento de reservas' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><ReservaProvider><div className="min-h-screen md:flex"><Sidebar /><main className="w-full p-5 md:p-8">{children}</main></div></ReservaProvider></body></html>; }
