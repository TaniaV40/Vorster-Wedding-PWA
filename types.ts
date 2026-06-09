
export enum RSVPStatus {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING'
}

export interface RSVPResponse {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  guestCount: number;
  dietary: {
    vegan: boolean;
    nonDairy: boolean;
    glutenFree: boolean;
    other: string;
  };
  accommodation: 'Yes' | 'No' | 'Please select';
  comments: string;
  status: RSVPStatus;
  editToken: string;
}

export interface GuestbookEntry {
  id: string;
  timestamp: string;
  guestName: string;
  messageText: string;
  likesCount: number;
}

export interface PhotoEntry {
  id: string;
  timestamp: string;
  guestEmail: string;
  imageUrl: string;
  likes: number;
  isApproved: boolean;
}

export interface WeddingConfig {
  weddingDate: Date;
  venueName: string;
  venueAddress: string;
  googleMapsEmbedUrl: string;
}
