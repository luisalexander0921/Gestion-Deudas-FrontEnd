import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DebtService } from '../../../services';
import { ToastService } from '../../../shared/services/toast.service';
import { Debt } from '../../../models/debt.model';

@Component({
  selector: 'app-debt-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.css']
})
export class DebtListComponent {
  debtService = inject(DebtService);
  toastService = inject(ToastService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  
  debts: Debt[] = [];
  filteredDebts: Debt[] = [];
  loading = true;
  currentFilter = 'ALL'; // ALL, PENDING, PAID

  constructor() {
    this.loadData();
  }

  loadData() {
    this.debtService.getAll().subscribe({
      next: (data) => {
        this.debts = data || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.debts = [];
        this.filteredDebts = [];
        this.toastService.error('Error al cargar deudas');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter() {
    if (!this.debts) {
      this.filteredDebts = [];
      return;
    }
    
    switch (this.currentFilter) {
      case 'PENDING':
        this.filteredDebts = this.debts.filter(debt => debt.status === 'PENDING');
        break;
      case 'PAID':
        this.filteredDebts = this.debts.filter(debt => debt.status === 'PAID');
        break;
      default:
        this.filteredDebts = this.debts;
    }
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  getTotalCount(): number {
    return this.debts?.length || 0;
  }

  getPendingCount(): number {
    return this.debts?.filter(d => d.status === 'PENDING').length || 0;
  }

  getPaidCount(): number {
    return this.debts?.filter(d => d.status === 'PAID').length || 0;
  }

  create() {
    this.router.navigate(['/debts/new']);
  }

  edit(id: number) {
    this.router.navigate(['/debts/edit', id]);
  }

  delete(id: number) {
    if (confirm('¿Eliminar deuda?')) {
      this.debtService.delete(id).subscribe({
        next: () => {
          this.toastService.success('Deuda eliminada');
          this.loadData();
        },
        error: () => {
          this.toastService.error('Error al eliminar');
        }
      });
    }
  }

  viewDetail(id: number) {
    this.router.navigate(['/debts/detail', id]);
  }

  markAsPaid(id: number) {
    this.debtService.markAsPaid(id).subscribe({
      next: () => {
        this.toastService.success('Deuda marcada como pagada');
        this.loadData();
      },
      error: () => {
        this.toastService.error('Error al marcar como pagada');
      }
    });
  }

  makePayment(debt: any) {
    const amount = prompt(`Ingrese el monto a abonar (Saldo pendiente: $${debt.remainingAmount || debt.amount})`);
    
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      const paymentAmount = Number(amount);
      const remainingAmount = debt.remainingAmount || debt.amount;
      
      if (paymentAmount > remainingAmount) {
        this.toastService.error('El monto no puede ser mayor al saldo pendiente');
        return;
      }
      
      this.debtService.createPayment(debt.id, {
        amount: paymentAmount,
        description: 'Abono realizado'
      }).subscribe({
        next: () => {
          this.toastService.success('Abono registrado exitosamente');
          this.loadData();
        },
        error: () => {
          this.toastService.error('Error al registrar el abono');
        }
      });
    }
  }
}