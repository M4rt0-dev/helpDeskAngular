import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  username = signal('');
  password = signal('');

  onLogin(credentials: { username: string; password: string }) {
    // Emit login event
  }

  onOpenRegister() {
    // Emit register event
  }

  submit() {
    this.onLogin({ username: this.username(), password: this.password() });
  }
}