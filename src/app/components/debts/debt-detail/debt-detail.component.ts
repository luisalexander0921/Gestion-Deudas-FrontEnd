import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DebtService } from '../../../services';
import { ToastService } from '../../../shared/services/toast.service';
import { Debt, Payment } from '../../../models/debt.model';

@Component({
  selector: 'app-debt-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debt-detail.component.html',
  styleUrls: ['./debt-detail.component.css']
})
export class DebtDetailComponent implements OnInit {
  private debtService = inject(DebtService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  debt?: Debt;
  payments: Payment[] = [];
  loading = true;
  loadingPayments = false;
  debtId?: number;

  ngOnInit() {
    this.debtId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDebt();
    this.loadPayments();
  }

  loadDebt() {
    if (!this.debtId) return;
    
    this.loading = true;
    this.debtService.getById(this.debtId).subscribe({
      next: (debt) => {
        this.debt = debt;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Error al cargar deuda');
        this.router.navigate(['/debts']);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit() {
    if (this.debt?.status === 'PENDING') {
      this.router.navigate(['/debts/edit', this.debtId]);
    }
  }

  markAsPaid() {
    if (!this.debtId || this.debt?.status !== 'PENDING') return;
    
    this.debtService.markAsPaid(this.debtId).subscribe({
      next: () => {
        this.toastService.success('Deuda marcada como pagada');
        this.loadDebt();
      },
      error: () => {
        this.toastService.error('Error al marcar como pagada');
      }
    });
  }

  delete() {
    if (!this.debtId) return;
    
    if (confirm('¿Estás seguro de eliminar esta deuda?')) {
      this.debtService.delete(this.debtId).subscribe({
        next: () => {
          this.toastService.success('Deuda eliminada');
          this.router.navigate(['/debts']);
        },
        error: () => {
          this.toastService.error('Error al eliminar deuda');
        }
      });
    }
  }

  loadPayments() {
    if (!this.debtId) return;
    
    this.loadingPayments = true;
    this.debtService.getPaymentsByDebt(this.debtId).subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loadingPayments = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingPayments = false;
        this.cdr.detectChanges();
      }
    });
  }

  makePayment() {
    if (!this.debt || this.debt.status !== 'PENDING') return;
    
    const remainingAmount = this.debt.remainingAmount || this.debt.amount;
    const amount = prompt(`Ingrese el monto a abonar (Saldo pendiente: $${remainingAmount})`);
    
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      const paymentAmount = Number(amount);
      
      if (paymentAmount > remainingAmount) {
        this.toastService.error('El monto no puede ser mayor al saldo pendiente');
        return;
      }
      
      this.debtService.createPayment(this.debt.id, {
        amount: paymentAmount,
        description: 'Abono realizado'
      }).subscribe({
        next: () => {
          this.toastService.success('Abono registrado exitosamente');
          this.loadDebt();
          this.loadPayments();
        },
        error: () => {
          this.toastService.error('Error al registrar el abono');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/debts']);
  }
}