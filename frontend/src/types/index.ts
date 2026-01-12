export type CaseStatus = 'New' | 'In Follow-up' | 'Partially Paid' | 'Closed';

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: number;
  client_id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: string;
  status: CaseStatus;
  follow_up_notes?: string;
  created_at: string;
  updated_at: string;
  client: Client;
}

export interface CreateCasePayload {
  client_id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: string;
  follow_up_notes?: string;
}

export interface UpdateCasePayload {
  status?: CaseStatus;
  follow_up_notes?: string;
}

export interface CreateClientPayload {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface UpdateClientPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}
