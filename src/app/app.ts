import { Component, OnInit, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { initialUsers, initialCategories, initialPriorities, initialTickets } from './mock-data';
import { Notification, TicketActivity, TicketComment, TicketPriority, TicketStatus, TicketType, User } from './app.models';
import * as Security from './security';
import { SecurityWarningComponent } from './components/security-warning/security-warning';
import { Login } from './components/login/login';
import { RegisterModal } from './components/register-modal/register-modal';
import { SecurityLogs } from './components/security-logs/security-logs';
import { ConfigurationPanel } from './components/configuration-panel/configuration-panel';
import { StatCard } from './components/stat-card/stat-card';
import { TicketCard } from './components/ticket-card/ticket-card';
import { NewTicketModal } from './components/new-ticket-modal/new-ticket-modal';
import { CreateTechnicianModal } from './components/create-technician-modal/create-technician-modal';
import { CreateAdminModal } from './components/create-admin-modal/create-admin-modal';
import { TicketDetailModal } from './components/ticket-detail-modal/ticket-detail-modal';
import { NotificationsPanel } from './components/notifications-panel/notifications-panel';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    SlicePipe,
    LucideAngularModule,
    SecurityWarningComponent,
    Login,
    RegisterModal,
    SecurityLogs,
    ConfigurationPanel,
    StatCard,
    TicketCard,
    NewTicketModal,
    CreateTechnicianModal,
    CreateAdminModal,
    TicketDetailModal,
    NotificationsPanel
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  currentUser = signal<User | null>(null);
  validUsers = signal<User[]>([]);
  tickets = signal<TicketType[]>(initialTickets);
  categories = signal(initialCategories);
  priorities = signal(initialPriorities);
  notifications = signal<Notification[]>([]);
  securityIssues = signal<string[]>([]);

  activeView = signal<'dashboard' | 'tickets' | 'config' | 'logs'>('dashboard');
  isNewTicketOpen = signal(false);
  isCreateTechnicianOpen = signal(false);
  isCreateAdminOpen = signal(false);
  isRegisterOpen = signal(false);
  isNotificationsOpen = signal(false);
  selectedTicket = signal<TicketType | null>(null);

  searchQuery = signal('');
  statusFilter = signal<TicketStatus | 'all'>('all');
  priorityFilter = signal<TicketPriority | 'all'>('all');
  quickFilter = signal<'all' | 'unassigned' | 'urgent' | 'mine'>('all');

  readonly visibleTickets = computed(() => {
    const user = this.currentUser();
    if (!user) {
      return [];
    }

    if (user.role === 'usuario') {
      return this.tickets().filter(ticket => ticket.createdBy === user.username && ticket.status !== 'cerrado');
    }

    if (user.role === 'tecnico') {
      return this.tickets().filter(ticket => ticket.assignedTo === user.username || !ticket.assignedTo);
    }

    return this.tickets();
  });

  readonly stats = computed(() => {
    const tickets = this.visibleTickets();
    return {
      total: tickets.length,
      nuevo: tickets.filter(ticket => ticket.status === 'nuevo').length,
      enProceso: tickets.filter(ticket => ticket.status === 'en-proceso').length,
      resuelto: tickets.filter(ticket => ticket.status === 'resuelto').length,
      criticos: tickets.filter(ticket => ticket.priority === 'critica').length
    };
  });

  readonly filteredTickets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const quickFilter = this.quickFilter();
    const user = this.currentUser();

    return this.visibleTickets().filter(ticket => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || ticket.status === status;
      const matchesPriority = priority === 'all' || ticket.priority === priority;

      let matchesQuickFilter = true;
      if (user && (user.role === 'tecnico' || user.role === 'admin')) {
        if (quickFilter === 'unassigned') {
          matchesQuickFilter = !ticket.assignedTo;
        } else if (quickFilter === 'urgent') {
          matchesQuickFilter = ticket.priority === 'critica' || ticket.priority === 'alta';
        } else if (quickFilter === 'mine') {
          matchesQuickFilter = ticket.assignedTo === user.username;
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesQuickFilter;
    });
  });

  readonly unreadNotificationsCount = computed(() => this.notifications().filter(notification => !notification.read).length);
  readonly technicians = computed(() => this.validUsers().filter(user => user.role === 'tecnico'));

  ngOnInit() {
    const securityConfig = Security.validateSecurityConfig();
    if (!securityConfig.valid) {
      this.securityIssues.set(securityConfig.issues);
      Security.logSecurityEvent({
        level: 'warning',
        event: 'security_config_issues',
        details: { issues: securityConfig.issues }
      });
    }

    this.loadUsers();
    this.loadCategories();
    this.loadPriorities();
    this.restoreSession();
  }

  private loadUsers() {
    const savedUsers = localStorage.getItem('helpdesk_users');
    if (!savedUsers) {
      this.setInitialUsers();
      return;
    }

    try {
      const users = JSON.parse(savedUsers);
      if (Array.isArray(users) && users.every(user => user.username && user.role)) {
        this.validUsers.set(users);
        return;
      }
    } catch {
    }

    this.setInitialUsers();
  }

  private loadCategories() {
    const savedCategories = localStorage.getItem('helpdesk_categories');
    if (!savedCategories) {
      this.handleUpdateCategories(initialCategories);
      return;
    }

    try {
      this.categories.set(JSON.parse(savedCategories));
    } catch {
      this.handleUpdateCategories(initialCategories);
    }
  }

  private loadPriorities() {
    const savedPriorities = localStorage.getItem('helpdesk_priorities');
    if (!savedPriorities) {
      this.handleUpdatePriorities(initialPriorities);
      return;
    }

    try {
      this.priorities.set(JSON.parse(savedPriorities));
    } catch {
      this.handleUpdatePriorities(initialPriorities);
    }
  }

  private restoreSession() {
    const savedUser = localStorage.getItem('helpdesk_user');
    if (!savedUser) {
      return;
    }

    try {
      const user = JSON.parse(savedUser) as User;
      if (user.sessionTimestamp && Security.isSessionExpired(user.sessionTimestamp)) {
        localStorage.removeItem('helpdesk_user');
        alert('Tu sesión expiró. Necesitas iniciar sesión otra vez');
        return;
      }

      if (!user.username || !user.role || !user.sessionToken) {
        localStorage.removeItem('helpdesk_user');
        return;
      }

      this.currentUser.set(user);
      this.activeView.set(this.getDefaultViewForRole(user.role));

      const savedNotifications = localStorage.getItem(`helpdesk_notifications_${user.username}`);
      if (savedNotifications) {
        try {
          const notifications = JSON.parse(savedNotifications);
          if (Array.isArray(notifications)) {
            this.notifications.set(notifications);
          }
        } catch {
          this.notifications.set([]);
        }
      }
    } catch {
      localStorage.removeItem('helpdesk_user');
    }
  }

  private setInitialUsers() {
    this.validUsers.set(initialUsers);
    localStorage.setItem('helpdesk_users', JSON.stringify(initialUsers));
  }

  private getTimestamp() {
    return new Date()
      .toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
      .replace(',', '');
  }

  private getDefaultViewForRole(role: User['role']): 'dashboard' | 'tickets' {
    return role === 'usuario' ? 'tickets' : 'dashboard';
  }

  async submitLogin(credentials: { username: string; password: string }, loginComponent: { handleLoginResult: (success: boolean) => void }) {
    const success = await this.handleLogin(credentials);
    loginComponent.handleLoginResult(success);
  }

  async handleLogin(credentials: { username: string; password: string }): Promise<boolean> {
    const { username, password } = credentials;
    if (!username || !password) {
      Security.logSecurityEvent({
        level: 'warning',
        event: 'login_attempt_empty_fields',
        details: { username: username || 'empty' }
      });
      return false;
    }

    const sanitizedUsername = Security.sanitizeInput(username.trim().toLowerCase());
    const rateLimit = Security.checkRateLimit(`login_${sanitizedUsername}`, 5, 900000);
    if (!rateLimit.allowed) {
      const minutesLeft = rateLimit.blockedUntil
        ? Math.ceil((rateLimit.blockedUntil - Date.now()) / 60000)
        : 15;
      Security.logSecurityEvent({
        level: 'warning',
        event: 'login_rate_limit_exceeded',
        user: sanitizedUsername,
        details: { blockedUntil: rateLimit.blockedUntil }
      });
      alert(`Demasiados intentos. Espera ${minutesLeft} minutos antes de volver a intentar`);
      return false;
    }

    try {
      const user = this.validUsers().find(item => item.username === sanitizedUsername);
      if (!user) {
        Security.logSecurityEvent({
          level: 'warning',
          event: 'login_failed_user_not_found',
          details: { username: sanitizedUsername, remainingAttempts: rateLimit.remainingAttempts }
        });
        return false;
      }

      let passwordValid = false;
      if (user.password && user.password.length === 64) {
        passwordValid = await Security.verifyPassword(password, user.password);
      } else {
        passwordValid = user.password === password;
        if (passwordValid) {
          const hashedPassword = await Security.hashPassword(password);
          this.validUsers.update(users =>
            users.map(item => (item.username === user.username ? { ...item, password: hashedPassword } : item))
          );
          localStorage.setItem('helpdesk_users', JSON.stringify(this.validUsers()));
          Security.logSecurityEvent({
            level: 'info',
            event: 'password_migrated_to_hash',
            user: user.username
          });
        }
      }

      if (!passwordValid) {
        Security.logSecurityEvent({
          level: 'warning',
          event: 'login_failed_invalid_password',
          user: sanitizedUsername,
          details: { remainingAttempts: rateLimit.remainingAttempts }
        });
        return false;
      }

      Security.resetRateLimit(`login_${sanitizedUsername}`);
      const sessionUser: User = {
        username: user.username,
        name: user.name,
        role: user.role,
        sessionToken: Security.generateSessionToken(),
        sessionTimestamp: Date.now()
      };

      this.currentUser.set(sessionUser);
      localStorage.setItem('helpdesk_user', JSON.stringify(sessionUser));
      Security.logSecurityEvent({
        level: 'info',
        event: 'login_success',
        user: user.username,
        details: { role: user.role, sessionToken: `${sessionUser.sessionToken?.slice(0, 8)}...` }
      });

      const savedNotifications = localStorage.getItem(`helpdesk_notifications_${user.username}`);
      if (savedNotifications) {
        try {
          const notifications = JSON.parse(savedNotifications);
          this.notifications.set(Array.isArray(notifications) ? notifications : []);
        } catch {
          this.notifications.set([]);
        }
      } else {
        this.notifications.set([]);
      }

      this.activeView.set(this.getDefaultViewForRole(user.role));

      return true;
    } catch (error) {
      Security.logSecurityEvent({
        level: 'error',
        event: 'login_error',
        user: sanitizedUsername,
        details: { error: String(error) }
      });
      alert('Algo salió mal al iniciar sesión. Inténtalo otra vez');
      return false;
    }
  }

  handleLogout() {
    this.currentUser.set(null);
    this.notifications.set([]);
    this.selectedTicket.set(null);
    this.isNotificationsOpen.set(false);
    this.isNewTicketOpen.set(false);
    this.isCreateTechnicianOpen.set(false);
    this.isCreateAdminOpen.set(false);
    this.isRegisterOpen.set(false);
    this.activeView.set('dashboard');
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.priorityFilter.set('all');
    this.quickFilter.set('all');
    localStorage.removeItem('helpdesk_user');
  }

  async handleCreateTechnician(technicianData: { username: string; password: string; name: string }) {
    const user = this.currentUser();
    if (!user || user.role !== 'admin') {
      return;
    }

    const sanitizedUsername = Security.sanitizeInput(technicianData.username.toLowerCase());
    const sanitizedName = Security.sanitizeInput(technicianData.name);

    if (!Security.validateUsername(sanitizedUsername)) {
      alert('Error: El nombre de usuario debe tener entre 3-20 caracteres...');
      return;
    }

    if (this.validUsers().some(item => item.username === sanitizedUsername)) {
      alert('Error: El nombre de usuario ya existe');
      return;
    }

    const hashedPassword = await Security.hashPassword(technicianData.password);
    const newTechnician: User = {
      username: sanitizedUsername,
      password: hashedPassword,
      name: sanitizedName,
      role: 'tecnico'
    };

    this.validUsers.update(users => [...users, newTechnician]);
    localStorage.setItem('helpdesk_users', JSON.stringify(this.validUsers()));
    this.isCreateTechnicianOpen.set(false);
    alert(`Técnico ${newTechnician.name} creado exitosamente`);
  }

  async handleCreateAdmin(adminData: { username: string; password: string; name: string }) {
    const user = this.currentUser();
    if (!user || user.role !== 'admin') {
      return;
    }

    const sanitizedUsername = Security.sanitizeInput(adminData.username.toLowerCase());
    const sanitizedName = Security.sanitizeInput(adminData.name);

    if (this.validUsers().some(item => item.username === sanitizedUsername)) {
      alert('Error: El nombre de usuario ya existe');
      return;
    }

    const hashedPassword = await Security.hashPassword(adminData.password);
    const newAdmin: User = {
      username: sanitizedUsername,
      password: hashedPassword,
      name: sanitizedName,
      role: 'admin'
    };

    this.validUsers.update(users => [...users, newAdmin]);
    localStorage.setItem('helpdesk_users', JSON.stringify(this.validUsers()));
    this.isCreateAdminOpen.set(false);
    alert(`Administrador ${newAdmin.name} creado exitosamente`);
  }

  async handleRegister(userData: { username: string; password: string; name: string }) {
    const sanitizedUsername = Security.sanitizeInput(userData.username.toLowerCase());
    const sanitizedName = Security.sanitizeInput(userData.name);

    if (!sanitizedUsername || !sanitizedName || !userData.password) {
      alert('Error: Todos los campos son obligatorios');
      return;
    }

    if (!Security.validateUsername(sanitizedUsername)) {
      alert('Error: El nombre de usuario debe tener entre 3-20 caracteres y solo puede contener letras minúsculas, números, guiones y guiones bajos');
      return;
    }

    const passwordStrength = Security.validatePasswordStrength(userData.password);
    if (!passwordStrength.valid) {
      alert(`Error: La contraseña no cumple los requisitos de seguridad:\n\n${passwordStrength.issues.join('\n')}`);
      return;
    }

    if (this.validUsers().some(item => item.username === sanitizedUsername)) {
      alert('Ese nombre de usuario ya está en uso. Elige otro');
      return;
    }

    const hashedPassword = await Security.hashPassword(userData.password);
    const newUser: User = {
      username: sanitizedUsername,
      password: hashedPassword,
      name: sanitizedName,
      role: 'usuario'
    };

    this.validUsers.update(users => [...users, newUser]);
    localStorage.setItem('helpdesk_users', JSON.stringify(this.validUsers()));

    const sessionUser: User = {
      ...newUser,
      sessionToken: Security.generateSessionToken(),
      sessionTimestamp: Date.now()
    };

    this.currentUser.set(sessionUser);
    this.activeView.set(this.getDefaultViewForRole(sessionUser.role));
    this.isRegisterOpen.set(false);
    localStorage.setItem('helpdesk_user', JSON.stringify(sessionUser));
  }

  addNotification(username: string, notification: Omit<Notification, 'id'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 11)
    };

    const savedNotifications = localStorage.getItem(`helpdesk_notifications_${username}`);
    let userNotifications: Notification[] = [];
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        userNotifications = Array.isArray(parsedNotifications) ? parsedNotifications : [];
      } catch {
        userNotifications = [];
      }
    }

    const updatedNotifications = [newNotification, ...userNotifications];
    localStorage.setItem(`helpdesk_notifications_${username}`, JSON.stringify(updatedNotifications));

    if (this.currentUser()?.username === username) {
      this.notifications.set(updatedNotifications);
    }
  }

  handleMarkNotificationAsRead(id: string) {
    const user = this.currentUser();
    if (!user) {
      return;
    }

    this.notifications.update(notifications => notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
    localStorage.setItem(`helpdesk_notifications_${user.username}`, JSON.stringify(this.notifications()));
  }

  handleMarkAllNotificationsAsRead() {
    const user = this.currentUser();
    if (!user) {
      return;
    }

    this.notifications.update(notifications => notifications.map(notification => ({ ...notification, read: true })));
    localStorage.setItem(`helpdesk_notifications_${user.username}`, JSON.stringify(this.notifications()));
  }

  handleUpdateCategories(newCategories: typeof initialCategories) {
    this.categories.set(newCategories);
    localStorage.setItem('helpdesk_categories', JSON.stringify(newCategories));
  }

  handleUpdatePriorities(newPriorities: typeof initialPriorities) {
    this.priorities.set(newPriorities);
    localStorage.setItem('helpdesk_priorities', JSON.stringify(newPriorities));
  }

  handleCreateTicket(newTicket: { title: string; description: string; priority: TicketPriority; category: string }) {
    const user = this.currentUser();
    if (!user) {
      return;
    }

    const timestamp = this.getTimestamp();
    const ticket: TicketType = {
      id: `TKT-${2848 + this.tickets().length}`,
      title: Security.sanitizeHTML(newTicket.title),
      description: Security.sanitizeHTML(newTicket.description),
      priority: newTicket.priority,
      category: newTicket.category,
      status: 'nuevo',
      createdBy: user.username,
      createdAt: timestamp,
      updatedAt: timestamp,
      comments: [],
      activities: [{ id: Date.now().toString(), type: 'created', timestamp }]
    };

    this.tickets.update(tickets => [ticket, ...tickets]);

    for (const adminUser of this.validUsers().filter(item => item.role === 'admin' && item.username !== user.username)) {
      this.addNotification(adminUser.username, {
        type: 'ticket_created',
        title: 'Nuevo ticket creado',
        message: `${user.name} creó el ticket "${ticket.title}"`,
        ticketId: ticket.id,
        timestamp,
        read: false
      });
    }

    for (const technician of this.validUsers().filter(item => item.role === 'tecnico' && item.username !== user.username)) {
      this.addNotification(technician.username, {
        type: 'ticket_created',
        title: 'Nuevo ticket disponible',
        message: `Se creó el ticket "${ticket.title}" y está pendiente de atención`,
        ticketId: ticket.id,
        timestamp,
        read: false
      });
    }

    this.isNewTicketOpen.set(false);
    alert('Ticket creado exitosamente');
  }

  handleUpdateStatus(ticketId: string, newStatus: string) {
    const user = this.currentUser();
    if (!user) {
      return;
    }

    const ticket = this.tickets().find(item => item.id === ticketId);
    if (!ticket) {
      return;
    }

    const timestamp = this.getTimestamp();
    const statusChangeActivity: TicketActivity = {
      id: Date.now().toString(),
      type: 'status_changed',
      oldValue: ticket.status,
      newValue: newStatus,
      timestamp
    };

    this.tickets.update(tickets => tickets.map(item =>
      item.id === ticketId
        ? { ...item, status: newStatus as TicketStatus, updatedAt: timestamp, activities: [...item.activities, statusChangeActivity] }
        : item
    ));

    const selectedTicket = this.selectedTicket();
    if (selectedTicket?.id === ticketId) {
      this.selectedTicket.set({
        ...selectedTicket,
        status: newStatus as TicketStatus,
        updatedAt: timestamp,
        activities: [...selectedTicket.activities, statusChangeActivity]
      });
    }

    if (ticket.createdBy !== user.username) {
      this.addNotification(ticket.createdBy, {
        type: 'status_change',
        title: 'Estado de ticket actualizado',
        message: `Tu ticket "${ticket.title}" cambió a ${newStatus}`,
        ticketId: ticket.id,
        timestamp,
        read: false
      });
    }
  }

  handleAddComment(ticketId: string, message: string) {
    const user = this.currentUser();
    if (!user || !message.trim()) {
      return;
    }

    const ticket = this.tickets().find(item => item.id === ticketId);
    if (!ticket || ticket.status === 'cerrado') {
      return;
    }

    const timestamp = this.getTimestamp();
    const sanitizedMessage = Security.sanitizeHTML(message);
    const comment: TicketComment = {
      id: Date.now().toString(),
      author: user.username,
      authorRole: user.role,
      message: sanitizedMessage,
      timestamp
    };
    const commentActivity: TicketActivity = {
      id: (Date.now() + 1).toString(),
      type: 'comment',
      author: user.username,
      authorRole: user.role,
      message: sanitizedMessage,
      timestamp
    };

    this.tickets.update(tickets => tickets.map(item =>
      item.id === ticketId
        ? {
            ...item,
            comments: [...item.comments, comment],
            activities: [...item.activities, commentActivity],
            updatedAt: timestamp
          }
        : item
    ));

    const selectedTicket = this.selectedTicket();
    if (selectedTicket?.id === ticketId) {
      this.selectedTicket.set({
        ...selectedTicket,
        comments: [...selectedTicket.comments, comment],
        activities: [...selectedTicket.activities, commentActivity],
        updatedAt: timestamp
      });
    }

    if (ticket.createdBy !== user.username) {
      this.addNotification(ticket.createdBy, {
        type: 'comment',
        title: 'Nuevo comentario',
        message: `${user.name} comentó...`,
        ticketId: ticket.id,
        timestamp,
        read: false
      });
    }
  }

  handleAssignTicket(ticketId: string, technicianUsername: string) {
    const user = this.currentUser();
    if (!user || user.role !== 'admin') {
      return;
    }

    const ticket = this.tickets().find(item => item.id === ticketId);
    if (!ticket) {
      return;
    }

    const timestamp = this.getTimestamp();
    const assignActivity: TicketActivity = {
      id: Date.now().toString(),
      type: 'assigned',
      newValue: technicianUsername,
      timestamp
    };

    this.tickets.update(tickets => tickets.map(item =>
      item.id === ticketId
        ? { ...item, assignedTo: technicianUsername, updatedAt: timestamp, activities: [...item.activities, assignActivity] }
        : item
    ));

    const selectedTicket = this.selectedTicket();
    if (selectedTicket?.id === ticketId) {
      this.selectedTicket.set({
        ...selectedTicket,
        assignedTo: technicianUsername,
        updatedAt: timestamp,
        activities: [...selectedTicket.activities, assignActivity]
      });
    }

    this.addNotification(technicianUsername, {
      type: 'assignment',
      title: 'Nuevo ticket asignado',
      message: `Se te ha asignado el ticket "${ticket.title}"`,
      ticketId: ticket.id,
      timestamp,
      read: false
    });
  }

  handleTakeTicket(ticketId: string) {
    const user = this.currentUser();
    if (!user || (user.role !== 'tecnico' && user.role !== 'admin')) {
      return;
    }

    const ticket = this.tickets().find(item => item.id === ticketId);
    if (!ticket || ticket.assignedTo) {
      return;
    }

    const timestamp = this.getTimestamp();
    const assignActivity: TicketActivity = {
      id: Date.now().toString(),
      type: 'assigned',
      newValue: user.username,
      timestamp
    };
    const statusChangeActivity: TicketActivity | null = ticket.status === 'nuevo'
      ? {
          id: (Date.now() + 1).toString(),
          type: 'status_changed',
          oldValue: ticket.status,
          newValue: 'en-proceso',
          timestamp
        }
      : null;

    this.tickets.update(tickets => tickets.map(item => {
      if (item.id !== ticketId) {
        return item;
      }

      return {
        ...item,
        assignedTo: user.username,
        status: item.status === 'nuevo' ? 'en-proceso' : item.status,
        updatedAt: timestamp,
        activities: statusChangeActivity
          ? [...item.activities, assignActivity, statusChangeActivity]
          : [...item.activities, assignActivity]
      };
    }));

    const selectedTicket = this.selectedTicket();
    if (selectedTicket?.id === ticketId) {
      this.selectedTicket.set({
        ...selectedTicket,
        assignedTo: user.username,
        status: selectedTicket.status === 'nuevo' ? 'en-proceso' : selectedTicket.status,
        updatedAt: timestamp,
        activities: statusChangeActivity
          ? [...selectedTicket.activities, assignActivity, statusChangeActivity]
          : [...selectedTicket.activities, assignActivity]
      });
    }

    this.addNotification(ticket.createdBy, {
      type: 'assignment',
      title: 'Técnico asignado a tu ticket',
      message: `${user.name} se ha hecho cargo de tu ticket`,
      ticketId: ticket.id,
      timestamp,
      read: false
    });

    if (user.role === 'tecnico') {
      for (const adminUser of this.validUsers().filter(item => item.role === 'admin' && item.username !== user.username)) {
        this.addNotification(adminUser.username, {
          type: 'assignment',
          title: 'Ticket tomado por un técnico',
          message: `${user.name} se hizo cargo del ticket "${ticket.title}"`,
          ticketId: ticket.id,
          timestamp,
          read: false
        });
      }
    }
  }

  canAccessTicket(ticket: TicketType): boolean {
    const user = this.currentUser();
    if (!user) {
      return false;
    }

    if (user.role === 'admin') {
      return true;
    }

    if (user.role === 'usuario') {
      return ticket.createdBy === user.username;
    }

    return ticket.assignedTo === user.username;
  }

  handleOpenTicket(ticket: TicketType) {
    if (this.canAccessTicket(ticket)) {
      this.selectedTicket.set(ticket);
    }
  }

  handleOpenTicketFromNotification(ticketId: string) {
    const ticket = this.tickets().find(item => item.id === ticketId);
    if (ticket && this.canAccessTicket(ticket)) {
      this.selectedTicket.set(ticket);
      this.activeView.set('tickets');
    }
  }
}