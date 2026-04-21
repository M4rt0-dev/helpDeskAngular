import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Notification } from '../../app.models';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.html',
  styleUrls: ['./notifications-panel.css'],
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsPanel {
  isOpen = input(false);
  notifications = input<Notification[]>([]);
  
  onClose = output<void>();
  onMarkAsRead = output<string>();
  onMarkAllAsRead = output<void>();
  onOpenTicket = output<string>();

  unreadCount() {
    return this.notifications().filter(notification => !notification.read).length;
  }

  getIconName(type: string) {
    switch (type) {
      case 'assignment':
        return 'user-plus';
      case 'comment':
        return 'message-square';
      case 'status_change':
        return 'alert-circle';
      default:
        return 'bell';
    }
  }

  handleTicketClick(ticketId?: string) {
    if (ticketId) {
      this.onOpenTicket.emit(ticketId);
      this.onClose.emit();
    }
  }
}