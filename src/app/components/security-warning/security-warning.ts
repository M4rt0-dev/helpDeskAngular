import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-security-warning',
  templateUrl: './security-warning.html',
  styleUrl: './security-warning.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule]
})
export class SecurityWarningComponent {
  issues = input<string[]>([]);
}