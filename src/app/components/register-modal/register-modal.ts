import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.html',
  styleUrls: ['./register-modal.css'],
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterModal {
  isOpen = input(false);
  onClose = output<void>();
  onSubmit = output<{ username: string; password: string; name: string }>();

  data = signal({ username: '', password: '', name: '' });

  passwordChecks = computed(() => {
    const p = this.data().password;
    return {
      minLength: p.length >= 8,
      hasUpper: /[A-Z]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasNumber: /\d/.test(p),
      hasSpecial: /[-_.@]/.test(p),
    };
  });

  isPasswordValid = computed(() => Object.values(this.passwordChecks()).every(Boolean));

  submit() {
    if (!this.isPasswordValid()) return;
    this.onSubmit.emit(this.data());
    this.data.set({ username: '', password: '', name: '' });
    this.onClose.emit();
  }

  close() {
    this.data.set({ username: '', password: '', name: '' });
    this.onClose.emit();
  }

  updateName(value: string) {
    this.data.update(data => ({ ...data, name: value }));
  }

  updateUsername(value: string) {
    this.data.update(data => ({
      ...data,
      username: value.toLowerCase().replace(/\s/g, '')
    }));
  }

  updatePassword(value: string) {
    this.data.update(data => ({ ...data, password: value }));
  }
}