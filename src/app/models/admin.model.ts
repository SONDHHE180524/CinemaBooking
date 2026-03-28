export interface Region {
  id: number;
  name: string;
}

export interface Auditorium {
  id: number;
  name: string;
  roomType: string;
  cinemaId: number;
}

export interface City {
  id: number;
  name: string;
  regionId: number;
  regionName?: string;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  hotline?: string;
  logoUrl?: string;
  isActive: boolean;
  cityId: number;
  cityName?: string;
  managerId?: number;
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  director?: string;
  durationMinutes: number;
  releaseDate?: string;
  posterUrl?: string;
  trailerUrl?: string;
  status: string;
}

export interface UserAdmin {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  password?: string; // only used for creation/update forms
}
