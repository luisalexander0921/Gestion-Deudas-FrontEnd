export interface Debt {
  id: number;
  creditorId: number;
  amount: number;
  description?: string;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  recordStatus: 'ACTIVE' | 'INACTIVE';
  createdBy?: string;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
  user?: any;
  creditor?: any;
}

export interface CreateDebtRequest {
  creditorId: number;
  amount: number;
  description?: string;
  dueDate: string;
  status?: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  createdBy?: string;
  userId?: number;
}

export interface FilterDebtRequest {
  status?: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDateFrom?: string;
  dueDateTo?: string;
}