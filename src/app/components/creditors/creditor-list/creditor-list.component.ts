import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreditorService } from '../../../services';

@Component({
  selector: 'app-creditor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditor-list.component.html',
  styleUrls: ['./creditor-list.component.css']
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