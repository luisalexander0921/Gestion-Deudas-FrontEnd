import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditorService } from '../../../services';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-creditor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creditor-form.component.html',
  styleUrls: ['./creditor-form.component.css']
})
export class CreditorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private creditorService = inject(CreditorService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  creditorForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  creditorId?: number;

  constructor() {
    this.creditorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      document: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.creditorId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.creditorId;

    if (this.isEditMode) {
      this.loadCreditor();
    }
  }

  loadCreditor() {
    if (!this.creditorId) return;
    
    this.isLoading = true;
    this.creditorService.getById(this.creditorId).subscribe({
      next: (creditor) => {
        this.creditorForm.patchValue({
          name: creditor.name,
          document: creditor.document,
          email: creditor.email,
          phone: creditor.phone,
          address: creditor.address
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toastService.error('Error al cargar acreedor');
        this.router.navigate(['/creditors']);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.creditorForm.valid) {
      this.isLoading = true;
      const formData = this.creditorForm.value;

      const request = this.isEditMode
        ? this.creditorService.update({ ...formData, id: this.creditorId! })
        : this.creditorService.create(formData);

      request.subscribe({
        next: () => {
          const message = this.isEditMode 
            ? 'Acreedor actualizado exitosamente'
            : 'Acreedor creado exitosamente';
          this.toastService.success(message);
          this.router.navigate(['/creditors']);
        },
        error: (error) => {
          const message = this.isEditMode
            ? 'Error al actualizar acreedor'
            : 'Error al crear acreedor';
          this.toastService.error(message);
          this.isLoading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/creditors']);
  }

  getField(fieldName: string) {
    return this.creditorForm.get(fieldName);
  }
}