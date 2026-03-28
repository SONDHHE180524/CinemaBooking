import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { ApiService } from './api.service';
import { Region, City, Cinema, Movie, UserAdmin, Auditorium } from '../../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiService: ApiService) { }

  // --- Regions ---
  getRegions(): Observable<Region[]> {
    return this.apiService.get<Region[]>('/admin/regions').pipe(retry(1));
  }
  createRegion(data: Partial<Region>): Observable<Region> {
    return this.apiService.post<Region>('/admin/regions', data);
  }
  updateRegion(id: number, data: Partial<Region>): Observable<Region> {
    return this.apiService.put<Region>(`/admin/regions/${id}`, data);
  }
  deleteRegion(id: number): Observable<any> {
    return this.apiService.delete<any>(`/admin/regions/${id}`);
  }

  // --- Cities ---
  getCities(): Observable<City[]> {
    return this.apiService.get<City[]>('/admin/cities');
  }
  createCity(data: Partial<City>): Observable<City> {
    return this.apiService.post<City>('/admin/cities', data);
  }
  updateCity(id: number, data: Partial<City>): Observable<City> {
    return this.apiService.put<City>(`/admin/cities/${id}`, data);
  }
  deleteCity(id: number): Observable<any> {
    return this.apiService.delete<any>(`/admin/cities/${id}`);
  }

  // --- Cinemas ---
  getCinemas(): Observable<Cinema[]> {
    return this.apiService.get<Cinema[]>('/admin/cinemas');
  }
  createCinema(data: Partial<Cinema>): Observable<Cinema> {
    return this.apiService.post<Cinema>('/admin/cinemas', data);
  }
  updateCinema(id: number, data: Partial<Cinema>): Observable<Cinema> {
    return this.apiService.put<Cinema>(`/admin/cinemas/${id}`, data);
  }
  deleteCinema(id: number): Observable<any> {
    return this.apiService.delete<any>(`/admin/cinemas/${id}`);
  }

  // --- Auditoriums ---
  getAuditoriums(cinemaId?: number): Observable<Auditorium[]> {
    const path = cinemaId ? `/admin/auditoriums?cinemaId=${cinemaId}` : '/admin/auditoriums';
    return this.apiService.get<Auditorium[]>(path);
  }
  createAuditorium(data: Partial<Auditorium>): Observable<Auditorium> {
    return this.apiService.post<Auditorium>('/admin/auditoriums', data);
  }
  updateAuditorium(id: number, data: Partial<Auditorium>): Observable<Auditorium> {
    return this.apiService.put<Auditorium>(`/admin/auditoriums/${id}`, data);
  }
  deleteAuditorium(id: number): Observable<any> {
    return this.apiService.delete<any>(`/admin/auditoriums/${id}`);
  }

  // --- Movies ---
  getMovies(): Observable<Movie[]> {
    return this.apiService.get<Movie[]>('/admin/movies');
  }
  createMovie(data: Partial<Movie>): Observable<Movie> {
    return this.apiService.post<Movie>('/admin/movies', data);
  }
  updateMovie(id: number, data: Partial<Movie>): Observable<Movie> {
    return this.apiService.put<Movie>(`/admin/movies/${id}`, data);
  }
  deleteMovie(id: number): Observable<any> {
    return this.apiService.delete<any>(`/admin/movies/${id}`);
  }

  // --- Users ---
  getUsers(): Observable<UserAdmin[]> {
    return this.apiService.get<UserAdmin[]>('/admin/users');
  }
  createUser(data: Partial<UserAdmin>): Observable<UserAdmin> {
    return this.apiService.post<UserAdmin>('/admin/users', data);
  }
  updateUser(id: number, data: Partial<UserAdmin>): Observable<UserAdmin> {
    return this.apiService.put<UserAdmin>(`/admin/users/${id}`, data);
  }
  deleteUser(id: number): Observable<any> {
    return this.apiService.delete<any>(`/admin/users/${id}`);
  }
}
