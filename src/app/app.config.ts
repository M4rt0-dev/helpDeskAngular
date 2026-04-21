import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  CircleCheckBig,
  Clock,
  FileText,
  Filter,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Tag,
  Ticket,
  Trash2,
  TrendingUp,
  User,
  UserPlus,
  X,
  LucideAngularModule
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Activity,
        AlertCircle,
        AlertTriangle,
        Bell,
        Calendar,
        CheckCircle,
        CircleCheckBig,
        Clock,
        FileText,
        Filter,
        LayoutDashboard,
        LogIn,
        LogOut,
        MessageSquare,
        Plus,
        Search,
        Send,
        Settings,
        Shield,
        Tag,
        Ticket,
        Trash2,
        TrendingUp,
        User,
        UserPlus,
        X
      })
    )
  ]
};
