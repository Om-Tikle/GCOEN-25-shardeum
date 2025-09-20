import { PlaceHolderImages } from './placeholder-images';

export type MockUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  campusCredits: number;
  reputationScore: number;
  nftTickets: MockNftTicket[];
};

export type MockEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  imageId: string;
};

export type MockTicket = {
  id: string;
  eventId: string;
  name: string;
  quantity: number;
  price: number;
};

export type MockResaleTicket = {
  id: string;
  eventId: string;
  sellerName: string;
  originalPrice: number;
  resalePrice: number;
};

export type MockReview = {
  id: string;
  eventId: string;
  name: string;
  avatarUrl: string;
  rating: number;
  comment: string;
};

export type MockTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
};

export type MockNftTicket = {
    id: string;
    eventId: string;
    eventName: string;
    ticketType: string;
    eventDate: string;
    location: string;
    imageId: string;
}

export const mockNftTickets: MockNftTicket[] = [
    {
        id: 'nft-1',
        eventId: 'event-1',
        eventName: "Annual Summer Music Fest",
        ticketType: "VIP Pass",
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Main Campus Quad',
        imageId: 'ticket-nft-1'
    },
    {
        id: 'nft-2',
        eventId: 'event-4',
        eventName: "Homecoming Football Game",
        ticketType: "Student Section",
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'University Stadium',
        imageId: 'ticket-nft-2'
    }
];


export const mockUser: MockUser = {
  id: 'user-1',
  name: 'Jane Doe',
  email: 'jane.doe@campus.edu',
  avatarUrl: PlaceHolderImages.find(img => img.id === 'profile-1')?.imageUrl || '',
  campusCredits: 1250,
  reputationScore: 4.8,
  nftTickets: mockNftTickets,
};

export const mockEvents: MockEvent[] = [
  {
    id: 'event-1',
    title: 'Annual Summer Music Fest',
    description: 'Join us for the biggest music festival on campus! Featuring live bands, food trucks, and amazing vibes. This year\'s headliners include The Scholars, Library Quiet, and DJ Bookworm. Don\'t miss out on the event of the year!',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Main Campus Quad',
    category: 'Music',
    priceRange: { min: 25, max: 75 },
    imageId: 'event-1',
  },
  {
    id: 'event-2',
    title: 'InnovateTech Conference 2024',
    description: 'A full-day conference on the future of technology. Hear from industry leaders, participate in hands-on workshops, and network with fellow innovators. Topics include AI, blockchain, and sustainable tech.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Engineering Hall Auditorium',
    category: 'Tech',
    priceRange: { min: 15, max: 50 },
    imageId: 'event-2',
  },
  {
    id: 'event-3',
    title: 'Senior Art Exhibition',
    description: 'Celebrate the works of our talented senior art students. The exhibition showcases a diverse range of mediums including painting, sculpture, and digital art. Opening night includes a reception with the artists.',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Fine Arts Gallery',
    category: 'Arts',
    priceRange: { min: 0, max: 10 },
    imageId: 'event-3',
  },
  {
    id: 'event-4',
    title: 'Homecoming Football Game',
    description: 'Cheer on the home team in the final game of the season! Expect a thrilling match, halftime shows, and a roaring crowd. Go Team!',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'University Stadium',
    category: 'Sports',
    priceRange: { min: 20, max: 100 },
    imageId: 'event-4',
  },
];

export const mockTickets: MockTicket[] = [
  { id: 'ticket-1', eventId: 'event-1', name: 'General Admission', quantity: 85, price: 25 },
  { id: 'ticket-2', eventId: 'event-1', name: 'VIP Pass', quantity: 12, price: 75 },
];

export const mockResaleTickets: MockResaleTicket[] = [
  { id: 'resale-1', eventId: 'event-1', sellerName: 'Alex R.', originalPrice: 25, resalePrice: 35 },
  { id: 'resale-2', eventId: 'event-1', sellerName: 'Sam K.', originalPrice: 25, resalePrice: 40 },
];

export const mockReviews: MockReview[] = [
    {
        id: 'review-1',
        eventId: 'event-1',
        name: 'Mark P.',
        avatarUrl: 'https://picsum.photos/seed/p1/40/40',
        rating: 5,
        comment: 'Absolutely incredible event! The energy was insane and the lineup was top-notch. Can\'t wait for next year!',
    },
    {
        id: 'review-2',
        eventId: 'event-1',
        name: 'Chloe G.',
        avatarUrl: 'https://picsum.photos/seed/p2/40/40',
        rating: 4,
        comment: 'Well organized and a lot of fun. The food trucks were a great addition. Sound could have been a bit better at times.',
    },
];

export const mockTransactions: MockTransaction[] = [
    {
        id: 'tx-1',
        date: new Date().toISOString(),
        description: 'Ticket Purchase: Music Fest',
        amount: 25.00,
        type: 'debit',
    },
    {
        id: 'tx-2',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Campus Credits Deposit',
        amount: 50.00,
        type: 'credit',
    },
    {
        id: 'tx-3',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Ticket Sale: Art Show',
        amount: 10.00,
        type: 'credit',
    }
];
