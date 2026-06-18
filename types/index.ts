export interface Car {
  id: number;
  name: string;
  description?: string | null;
  model?: string | null;
  brandName: string;
  price: number;
  imageUrl?: string | null;
  createdAt?: string;
}

export interface CarImage {
  id: number;
  carId: number;
  imageUrl: string;
}

export interface Booking {
  id: number;
  carId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  pickupLocation?: string | null;
  pickupDate?: string | null;
  dropoffDate?: string | null;
  totalPrice?: number | null;
  notes?: string | null;
  status: string;
  createdAt?: string;
  car?: { name: string; brandName: string; price: number };
}

export interface CreateBookingRequest {
  carId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  pickupLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
  totalPrice?: number;
  notes?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Extended Car with availability info
export interface CarWithAvailability extends Car {
  isAvailable: boolean;
  activeBookings: {
    id: number;
    pickupDate: string | null;
    dropoffDate: string | null;
    status: string;
  }[];
}