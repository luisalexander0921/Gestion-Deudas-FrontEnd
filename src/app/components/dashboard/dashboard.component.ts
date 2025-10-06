import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-content">
      <div class="welcome-card">
        <h2>¡Bienvenido al Sistema!</h2>
        <p>Gestiona tus deudas y acreedores de manera eficiente</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Acreedores</h3>
            <p class="stat-number">0</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🧾</div>
          <div class="stat-info">
            <h3>Deudas</h3>
            <p class="stat-number">0</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>Total Adeudado</h3>
            <p class="stat-number">$0</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 30px;
      text-align: center;
    }
    
    .welcome-card h2 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 28px;
    }
    
    .welcome-card p {
      margin: 0;
      color: #7f8c8d;
      font-size: 16px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .stat-icon {
      font-size: 40px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 12px;
    }
    
    .stat-info h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 16px;
      font-weight: 600;
    }
    
    .stat-number {
      margin: 0;
      color: #3498db;
      font-size: 24px;
      font-weight: 700;
    }
  `]
})
export class DashboardComponent {
  currentUser = inject(AuthService).getCurrentUser();
}