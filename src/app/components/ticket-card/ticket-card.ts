import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TicketType, User } from '../../app.models';
import { LucideAngularModule } from 'lucide-angular';

interface CategoryItem {
  id: string;
  name: string;
  label: string;
}

@Component({
  selector: 'app-ticket-card',
  imports: [LucideAngularModule],
  templateUrl: './ticket-card.html',
  styleUrl: './ticket-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketCard {
  ticket = input.required<TicketType>();
  currentUserRole = input.required<string>();
  allUsers = input<User[]>([]);
  categories = input<CategoryItem[]>([]);
  
  onClick = output<void>();
  onTakeTicket = output<void>();

  getPriorityColor(priority: string) {
    const colors: Record<string, string> = {
      baja: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }

  getStatusColor(status: string) {
    const colors: Record<string, string> = {
      nuevo: 'bg-primary-soft text-primary border-primary-30',
      'en-proceso': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      resuelto: 'bg-green-50 text-green-700 border-green-200',
      cerrado: 'bg-gray-100 text-gray-800 border-border'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-border';
  }

  getTechnicianName(username?: string) {
    if (!username) return 'Sin asignar';
    const tech = this.allUsers().find(u => u.username === username);
    return tech ? tech.name : username;
  }

  getCategoryLabel(categoryId: string) {
    const category = this.categories().find(item => item.id === categoryId);
    if (category) {
      return category.label;
    }
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  }

  showTakeButton() {
    return !this.ticket().assignedTo && (this.currentUserRole() === 'tecnico' || this.currentUserRole() === 'admin');
  }
}