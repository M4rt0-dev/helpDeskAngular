import { Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule, Shield, AlertTriangle, Info, AlertCircle, AlertOctagon } from 'lucide-angular';
import { JsonPipe } from '@angular/common';
import { FirebaseHelpdeskService } from '../../firebase-helpdesk.service';

interface SecurityLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  event: string;
  user?: string;
  ip?: string;
  details?: Record<string, any>;
}

@Component({
  selector: 'app-security-logs',
  standalone: true,
  imports: [LucideAngularModule, JsonPipe],
  templateUrl: './security-logs.html',
  styleUrl: './security-logs.css'
})
export class SecurityLogs implements OnInit {
  private readonly firebaseStore = inject(FirebaseHelpdeskService);

  logs: SecurityLog[] = [];
  filter: 'all' | 'info' | 'warning' | 'error' | 'critical' = 'all';

  readonly Shield = Shield;
  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;
  readonly AlertCircle = AlertCircle;
  readonly AlertOctagon = AlertOctagon;

  async ngOnInit() {
    await this.loadLogs();
  }

  async loadLogs() {
    try {
      await this.firebaseStore.getItem('helpdesk_security_logs');
      const savedLogs = localStorage.getItem('helpdesk_security_logs');
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        if (Array.isArray(parsedLogs)) {
          this.logs = parsedLogs.reverse(); // Más recientes primero
        }
      }
    } catch (error) {
      console.error('Error al cargar logs de seguridad:', error);
    }
  }

  getIcon(level: string) {
    switch (level) {
      case 'critical': return this.AlertOctagon;
      case 'error': return this.AlertCircle;
      case 'warning': return this.AlertTriangle;
      case 'info':
      default: return this.Info;
    }
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-900';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  }

  get filteredLogs(): SecurityLog[] {
    return this.filter === 'all' ? this.logs : this.logs.filter(log => log.level === this.filter);
  }

  getLogCount(level: string): number {
    return this.logs.filter(l => l.level === level).length;
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('es-ES');
  }

  hasDetails(log: SecurityLog): boolean {
    return !!(log.details && Object.keys(log.details).length > 0);
  }
}
