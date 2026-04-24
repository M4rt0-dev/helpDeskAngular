import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-create-admin-modal',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './create-admin-modal.html',
  styleUrl: './create-admin-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAdminModal {
  isOpen = input(false);
  onClose = output<void>();
  onSubmit = output<{ username: string; password: string; name: string }>();

  formData = signal({
    username: '',
    password: '',
    name: ''
  });

  passwordChecks = computed(() => {
    const p = this.formData().password;
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
    this.onSubmit.emit(this.formData());
    this.close();
  }

  close() {
    this.formData.set({ username: '', password: '', name: '' });
    this.onClose.emit();
  }

  updateName(value: string) {
    this.formData.update(formData => ({ ...formData, name: value }));
  }

  updateUsername(value: string) {
    this.formData.update(formData => ({
      ...formData,
      username: value.toLowerCase().replace(/\s/g, '')
    }));
  }

  updatePassword(value: string) {
    this.formData.update(formData => ({ ...formData, password: value }));
  }
}
