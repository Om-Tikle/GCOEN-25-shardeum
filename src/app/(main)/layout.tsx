import BottomNav from "@/components/BottomNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { EventProvider } from "@/context/EventContext";
import { UserProvider } from "@/context/UserContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <EventProvider>
        <div className="relative min-h-screen bg-background text-foreground">
          <DesktopSidebar />
          <main className="transition-all md:ml-64">
            {children}
            <div className="h-24 md:hidden"></div> {/* Spacer for bottom nav */}
          </main>
          <BottomNav />
        </div>
      </EventProvider>
    </UserProvider>
  );
}
