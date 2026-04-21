import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-ticket-modal',
  templateUrl: './new-ticket-modal.html',
  styleUrls: ['./new-ticket-modal.css'],
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTicketModal {
  isOpen = input(false);
  categories = input<any[]>([]);
  priorities = input<any[]>([]);
  
  onClose = output<void>();
  onSubmit = output<any>();

  ticket = signal({ title: '', description: '', category: '', priority: '' });

  submit() {
    this.onSubmit.emit(this.ticket());
    this.ticket.set({ title: '', description: '', category: '', priority: '' });
  }
}