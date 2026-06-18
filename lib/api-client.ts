// lib/api-client.ts
import type { Car, CarImage, Booking, CreateBookingRequest } from '@/types';

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data as T;
}

export const getCars = () => req<{ success: boolean; cars: Car[] }>('/api/cars');
export const getCar = (id: number | string) => req<{ success: boolean; car: Car }>(`/api/cars/${id}`);
export const createCar = (body: Omit<Car, 'id' | 'createdAt'>) =>
  req<{ success: boolean; message: string }>('/api/cars', { method: 'POST', body: JSON.stringify(body) });
export const updateCar = (id: number, body: Partial<Car>) =>
  req<{ success: boolean; message: string }>(`/api/cars/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteCar = (id: number) =>
  req<{ success: boolean; message: string }>(`/api/cars/${id}`, { method: 'DELETE' });

export const getCarImages = (carId: number | string) =>
  req<{ success: boolean; images: CarImage[] }>(`/api/car-images?carId=${carId}`);
export const addCarImage = (carId: number, imageUrl: string) =>
  req<{ success: boolean; message: string }>('/api/car-images', {
    method: 'POST', body: JSON.stringify({ carId, imageUrl }),
  });
export const deleteCarImage = (imageId: number) =>
  req<{ success: boolean; message: string }>(`/api/car-images/${imageId}`, { method: 'DELETE' });

export const getBookings = () => req<{ success: boolean; bookings: Booking[] }>('/api/bookings');
export const createBooking = (body: CreateBookingRequest) =>
  req<{ success: boolean; message: string }>('/api/bookings', { method: 'POST', body: JSON.stringify(body) });
export const confirmBooking = (id: number) =>
  req<{ success: boolean; message: string }>(`/api/bookings/${id}`, {
    method: 'PATCH', body: JSON.stringify({ status: 'Confirmed' }),
  });
export const cancelBooking = (id: number) =>
  req<{ success: boolean; message: string }>(`/api/bookings/${id}`, {
    method: 'PATCH', body: JSON.stringify({ status: 'Cancelled' }),
  });
export const deleteBooking = (id: number) =>
  req<{ success: boolean; message: string }>(`/api/bookings/${id}`, { method: 'DELETE' });