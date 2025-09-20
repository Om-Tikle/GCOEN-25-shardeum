import EventCard from "@/components/EventCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockEvents, mockUser } from "@/lib/mock-data";
import { Coins } from "lucide-react";

export default function HomePage() {
  return (
    <div className="p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline text-foreground">
            Hello, {mockUser.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">Welcome back to CampusConnect.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-lg text-primary">{mockUser.campusCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Campus Credits</p>
          </div>
          <Avatar>
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
            <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <section className="sm:hidden mb-6">
          <div className="p-4 rounded-lg border bg-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Campus Credits</p>
              <p className="font-bold text-2xl text-primary">{mockUser.campusCredits.toLocaleString()}</p>
            </div>
            <Coins className="h-8 w-8 text-primary/70" />
          </div>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-headline mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
