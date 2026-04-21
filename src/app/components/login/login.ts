import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
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
  error = signal('');
  isLoading = signal(false);

  onLogin = output<{ username: string; password: string }>();
  onOpenRegister = output<void>();

  async submit() {
    this.error.set('');

    if (!this.username() || !this.password()) {
      this.error.set('Ups, falta el usuario y la contraseña');
      return;
    }

    this.isLoading.set(true);
    try {
      this.onLogin.emit({ username: this.username(), password: this.password() });
    } catch {
      this.error.set('No pudimos iniciar sesión. Inténtalo de nuevo');
    } finally {
      this.isLoading.set(false);
    }
  }

  handleLoginResult(success: boolean) {
    if (!success) {
      this.error.set('Usuario o contraseña incorrectos');
      this.password.set('');
      return;
    }

    this.error.set('');
  }

  openRegister() {
    this.error.set('');
    this.onOpenRegister.emit();
  }
}