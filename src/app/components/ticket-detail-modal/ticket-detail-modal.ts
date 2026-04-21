import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TicketType, User } from '../../app.models';

@Component({
  selector: 'app-ticket-detail-modal',
  templateUrl: './ticket-detail-modal.html',
  styleUrls: ['./ticket-detail-modal.css'],
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailModal {
  isOpen = input(false);
  ticket = input<TicketType | null>(null);
  currentUser = input<User | null>(null);
  technicians = input<User[]>([]);
  allUsers = input<User[]>([]);

  onClose = output<void>();
  onUpdateStatus = output<string>();
  onAddComment = output<string>();
  onAssignTicket = output<string>();

  newComment = signal('');
  readonly statuses = ['nuevo', 'en-proceso', 'resuelto', 'cerrado'];

  addComment() {
    if (this.newComment().trim()) {
      this.onAddComment.emit(this.newComment());
      this.newComment.set('');
    }
  }

  canEditStatus() {
    const user = this.currentUser();
    const t = this.ticket();
    if (!user || !t) return false;
    return user.role === 'admin' || (user.role === 'tecnico' && t.assignedTo === user.username);
  }

  canAssign() {
    return this.currentUser()?.role === 'admin';
  }

  canComment() {
    return this.ticket()?.status !== 'cerrado';
  }

  getUserName(username?: string) {
    if (!username) return 'Sin asignar';

    const user = this.allUsers().find(item => item.username === username);
    if (user) return user.name;

    const names: Record<string, string> = {
      admin: 'Administrador',
      tecnico: 'Carlos Mendez',
      tecnico2: 'Ana Torres',
      tecnico3: 'Miguel Ruiz',
      usuario: 'Juan Pérez',
      maria: 'María García',
      pedro: 'Pedro Martínez'
    };

    return names[username] || username;
  }

  getRoleBadgeClass(role?: string) {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'tecnico':
        return 'bg-primary-soft text-primary';
      default:
        return 'bg-green-100 text-green-700';
    }
  }

  getStatusButtonClass(status: string) {
    if (this.ticket()?.status === status) {
      return 'border-primary bg-primary text-white';
    }

    return 'border-border hover:border-primary-50 text-foreground hover:bg-muted';
  }
}