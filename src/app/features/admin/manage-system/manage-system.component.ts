import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRegionsComponent } from '../manage-regions/manage-regions.component';
import { ManageCitiesComponent } from '../manage-cities/manage-cities.component';
import { ManageCinemasComponent } from '../manage-cinemas/manage-cinemas.component';
import { ManageAuditoriumsComponent } from '../manage-auditoriums/manage-auditoriums.component';
import { ManageMoviesComponent } from '../manage-movies/manage-movies.component';

@Component({
  selector: 'app-manage-system',
  standalone: true,
  imports: [CommonModule, ManageRegionsComponent, ManageCitiesComponent, ManageCinemasComponent, ManageAuditoriumsComponent, ManageMoviesComponent],
  template: `
    <div class="system-container">
      <div class="breadcrumb-nav">
        <span class="breadcrumb-item" (click)="resetNav()" [class.active]="currentLevel === 'regions'">Vùng Miền</span>
        <span class="breadcrumb-separator" *ngIf="selectedRegionName">/</span>
        <span class="breadcrumb-item" *ngIf="selectedRegionName" (click)="goToCities()" [class.active]="currentLevel === 'cities'">
          {{ selectedRegionName }}
        </span>
        <span class="breadcrumb-separator" *ngIf="selectedCityName">/</span>
        <span class="breadcrumb-item" *ngIf="selectedCityName" (click)="goToCinemas()" [class.active]="currentLevel === 'cinemas'">
          {{ selectedCityName }}
        </span>
        <span class="breadcrumb-separator" *ngIf="selectedCinemaName">/</span>
        <span class="breadcrumb-item" *ngIf="selectedCinemaName" [class.active]="currentLevel === 'auditoriums'">
          {{ selectedCinemaName }}
        </span>
        
        <div class="spacer"></div>
        
        <div class="tab-movies" [class.active]="currentLevel === 'movies'" (click)="goToMovies()">
           <i class="fas fa-film"></i> Quản lý Phim
        </div>
      </div>
      
      <div class="tab-content">
        <app-manage-regions *ngIf="currentLevel === 'regions'" (onSelect)="selectRegion($event)"></app-manage-regions>
        <app-manage-cities *ngIf="currentLevel === 'cities'" [filterRegionId]="selectedRegionId" (onSelect)="selectCity($event)"></app-manage-cities>
        <app-manage-cinemas *ngIf="currentLevel === 'cinemas'" [filterCityId]="selectedCityId" (onSelect)="selectCinema($event)"></app-manage-cinemas>
        <app-manage-auditoriums *ngIf="currentLevel === 'auditoriums'" [filterCinemaId]="selectedCinemaId"></app-manage-auditoriums>
        <app-manage-movies *ngIf="currentLevel === 'movies'"></app-manage-movies>
      </div>
    </div>
  `,
  styles: [`
    .system-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .breadcrumb-nav {
      display: flex;
      align-items: center;
      background: #fff;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      gap: 10px;
    }
    .breadcrumb-item {
      cursor: pointer;
      font-weight: 600;
      color: #7f8c8d;
      transition: color 0.3s;
    }
    .breadcrumb-item:hover {
      color: #3498db;
    }
    .breadcrumb-item.active {
      color: #2c3e50;
      cursor: default;
    }
    .breadcrumb-separator {
      color: #bdc3c7;
    }
    .spacer { flex: 1; }
    .tab-movies {
      padding: 8px 15px;
      cursor: pointer;
      font-weight: 600;
      color: #7f8c8d;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
    }
    .tab-movies:hover { background: #f8f9fa; color: #34495e; }
    .tab-movies.active {
      background: #3498db;
      color: #fff;
    }
    .tab-content {
      /* child components render their own styling */
    }
  `]
})
export class ManageSystemComponent {
  currentLevel: 'regions' | 'cities' | 'cinemas' | 'auditoriums' | 'movies' = 'regions';
  selectedRegionId?: number;
  selectedRegionName?: string;
  selectedCityId?: number;
  selectedCityName?: string;
  selectedCinemaId?: number;
  selectedCinemaName?: string;

  resetNav() {
    this.currentLevel = 'regions';
    this.selectedRegionId = undefined;
    this.selectedRegionName = undefined;
    this.selectedCityId = undefined;
    this.selectedCityName = undefined;
    this.selectedCinemaId = undefined;
    this.selectedCinemaName = undefined;
  }

  selectRegion(region: any) {
    this.selectedRegionId = region.id;
    this.selectedRegionName = region.name;
    this.currentLevel = 'cities';
    this.selectedCityId = undefined;
    this.selectedCityName = undefined;
    this.selectedCinemaId = undefined;
    this.selectedCinemaName = undefined;
  }

  goToCities() {
    this.currentLevel = 'cities';
    this.selectedCityId = undefined;
    this.selectedCityName = undefined;
    this.selectedCinemaId = undefined;
    this.selectedCinemaName = undefined;
  }

  selectCity(city: any) {
    this.selectedCityId = city.id;
    this.selectedCityName = city.name;
    this.currentLevel = 'cinemas';
    this.selectedCinemaId = undefined;
    this.selectedCinemaName = undefined;
  }

  goToCinemas() {
    this.currentLevel = 'cinemas';
    this.selectedCinemaId = undefined;
    this.selectedCinemaName = undefined;
  }

  selectCinema(cinema: any) {
    this.selectedCinemaId = cinema.id;
    this.selectedCinemaName = cinema.name;
    this.currentLevel = 'auditoriums';
  }

  goToMovies() {
    this.currentLevel = 'movies';
  }
}
