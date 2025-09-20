import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { type MockEvent } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

type EventCardProps = {
  event: MockEvent;
};

export default function EventCard({ event }: EventCardProps) {
  const image = PlaceHolderImages.find(img => img.id === event.imageId);

  return (
    <Card className="overflow-hidden flex flex-col group">
      <CardHeader className="p-0 relative h-40">
        {image && (
          <Image
            src={image.imageUrl}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={image.imageHint}
          />
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm font-semibold text-primary">{event.category.toUpperCase()}</p>
        <h3 className="text-lg font-headline font-bold mt-1 leading-tight">{event.title}</h3>
        <div className="mt-2 text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Prices from</p>
          <p className="text-lg font-bold text-foreground">${event.priceRange.min.toFixed(2)}</p>
        </div>
        <Link href={`/event/${event.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
