import Image from "next/image";
import { type MockNftTicket } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, QrCode } from "lucide-react";

type NftTicketCardProps = {
  ticket: MockNftTicket;
};

export default function NftTicketCard({ ticket }: NftTicketCardProps) {
  const image = PlaceHolderImages.find(img => img.id === ticket.imageId);
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`;

  return (
    <Card className="overflow-hidden group relative aspect-[3/4]">
      {image && (
        <Image
          src={image.imageUrl}
          alt={ticket.eventName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          data-ai-hint={image.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        <div className="flex-grow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm bg-black/30 rounded-lg">
           <Image
            src={qrCodeImage}
            alt="QR Code"
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>
        <div>
          <p className="text-sm font-bold opacity-80">{ticket.ticketType}</p>
          <h3 className="text-xl font-headline font-bold leading-tight">{ticket.eventName}</h3>
          <div className="mt-2 text-xs space-y-1 opacity-90">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(ticket.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{ticket.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
