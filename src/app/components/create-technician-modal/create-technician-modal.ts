import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-create-technician-modal',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './create-technician-modal.html',
  styleUrl: './create-technician-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTechnicianModal {
  isOpen = input(false);
  onClose = output<void>();
  onSubmit = output<{ username: string; password: string; name: string }>();

  formData = signal({
    username: '',
    password: '',
    name: ''
  });

  submit() {
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
