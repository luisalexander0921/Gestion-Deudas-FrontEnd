import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DebtService, CreditorService } from '../../../services';
import { ToastService } from '../../../shared/services/toast.service';
import { Creditor } from '../../../models/creditor.model';

@Component({
  selector: 'app-debt-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './debt-form.component.html',
  styleUrls: ['./debt-form.component.css']
})
export class DebtFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private debtService = inject(DebtService);
  private creditorService = inject(CreditorService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  debtForm: FormGroup;
  creditors: Creditor[] = [];
  isLoading = false;
  isEditMode = false;
  debtId?: number;

  constructor() {
    this.debtForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: [''],
      dueDate: [''],
      creditorId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.debtId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.debtId;
    
    this.loadCreditors();
    
    if (this.isEditMode) {
      this.loadDebt();
    }
  }

  loadCreditors() {
    this.creditorService.getAll().subscribe({
      next: (creditors) => {
        this.creditors = creditors;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Error al cargar acreedores');
      }
    });
  }

  loadDebt() {
    if (!this.debtId) return;
    
    this.isLoading = true;
    this.debtService.getById(this.debtId).subscribe({
      next: (debt) => {
        this.debtForm.patchValue({
          amount: debt.amount,
          description: debt.description,
          dueDate: debt.dueDate ? debt.dueDate.split('T')[0] : '',
          creditorId: debt.creditorId
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Error al cargar deuda');
        this.router.navigate(['/debts']);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.debtForm.valid) {
      this.isLoading = true;
      const formData = {
        ...this.debtForm.value,
        creditorId: Number(this.debtForm.value.creditorId)
      };

      const request = this.isEditMode
        ? this.debtService.update(this.debtId!, formData)
        : this.debtService.create(formData);

      request.subscribe({
        next: () => {
          const message = this.isEditMode 
            ? 'Deuda actualizada exitosamente'
            : 'Deuda creada exitosamente';
          this.toastService.success(message);
          this.router.navigate(['/debts']);
        },
        error: () => {
          const message = this.isEditMode
            ? 'Error al actualizar deuda'
            : 'Error al crear deuda';
          this.toastService.error(message);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/debts']);
  }

  getField(fieldName: string) {
    return this.debtForm.get(fieldName);
  }
}