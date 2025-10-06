import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreditorService } from '../../../services';

@Component({
  selector: 'app-creditor-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="creditor-list-container">
      <div class="page-header">
        <h2>Gestión de Acreedores</h2>
        <button class="btn-primary" (click)="create()">
          <span class="btn-icon">➕</span>
          Nuevo Acreedor
        </button>
      </div>

      @if (loading) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando acreedores...</p>
        </div>
      } @else {
        @if (creditors.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>No hay acreedores registrados</h3>
            <p>Comienza agregando tu primer acreedor</p>
            <button class="btn-primary" (click)="create()">
              Crear Acreedor
            </button>
          </div>
        } @else {
          <div class="creditors-grid">
            @for (creditor of creditors; track creditor.id) {
              <div class="creditor-card">
                <div class="creditor-header">
                  <div class="creditor-avatar">
                    {{ creditor.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="creditor-info">
                    <h3>{{ creditor.name }}</h3>
                    <p class="creditor-status" [class]="'status-' + creditor.recordStatus.toLowerCase()">
                      {{ creditor.recordStatus }}
                    </p>
                  </div>
                </div>
                
                <div class="creditor-details">
                  <div class="detail-item">
                    <span class="detail-icon">🆔</span>
                    <span>{{ creditor.document }}</span>
                  </div>
                  @if (creditor.email) {
                    <div class="detail-item">
                      <span class="detail-icon">📧</span>
                      <span>{{ creditor.email }}</span>
                    </div>
                  }
                  @if (creditor.phone) {
                    <div class="detail-item">
                      <span class="detail-icon">📞</span>
                      <span>{{ creditor.phone }}</span>
                    </div>
                  }
                  @if (creditor.address) {
                    <div class="detail-item">
                      <span class="detail-icon">📍</span>
                      <span>{{ creditor.address }}</span>
                    </div>
                  }
                </div>
                
                <div class="creditor-actions">
                  <button class="btn-edit" (click)="edit(creditor.id)">
                    ✏️ Editar
                  </button>
                  <button class="btn-delete" (click)="delete(creditor.id)">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .creditor-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e1e5e9;
    }

    .page-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 28px;
      font-weight: 600;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-icon {
      font-size: 16px;
    }

    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 24px;
    }

    .empty-state p {
      margin: 0 0 30px 0;
      color: #7f8c8d;
      font-size: 16px;
    }

    .creditors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .creditor-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .creditor-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .creditor-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .creditor-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 18px;
    }

    .creditor-info h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 18px;
      font-weight: 600;
    }

    .creditor-status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .creditor-details {
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #555;
    }

    .detail-icon {
      font-size: 16px;
      width: 20px;
    }

    .creditor-actions {
      display: flex;
      gap: 10px;
    }

    .btn-edit, .btn-delete {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-edit {
      background: #e3f2fd;
      color: #1976d2;
    }

    .btn-edit:hover {
      background: #bbdefb;
    }

    .btn-delete {
      background: #ffebee;
      color: #d32f2f;
    }

    .btn-delete:hover {
      background: #ffcdd2;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }
      
      .creditors-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreditorListComponent {
  creditorService = inject(CreditorService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  
  creditors: any[] = [];
  loading = true;

  constructor() {
    this.loadData();
  }

  loadData() {
    this.creditorService.getAll().subscribe({
      next: (data) => {
        this.creditors = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  create() {
    this.router.navigate(['/creditors/new']);
  }

  edit(id: number) {
    this.router.navigate(['/creditors/edit', id]);
  }

  delete(id: number) {
    if (confirm('¿Eliminar?')) {
      this.creditorService.delete(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}