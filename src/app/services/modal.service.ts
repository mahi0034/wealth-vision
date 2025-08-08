// src/app/services/modal.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: { [key: string]: boolean } = {};

  openModal(id: string): void {
    this.modals[id] = true;
  }
  closeModal(id: string): void {
    this.modals[id] = false;
  }
  isModalOpen(id: string): boolean {
    return this.modals[id] ?? false;
  }
}
