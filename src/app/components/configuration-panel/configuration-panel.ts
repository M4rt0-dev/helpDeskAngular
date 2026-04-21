import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

interface CategoryItem {
  id: string;
  name: string;
  label: string;
}

interface PriorityItem {
  id: string;
  name: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-configuration-panel',
  templateUrl: './configuration-panel.html',
  styleUrl: './configuration-panel.css',
  imports: [FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationPanel {
  categories = input<CategoryItem[]>([]);
  priorities = input<PriorityItem[]>([]);
  onUpdateCategories = output<CategoryItem[]>();
  onUpdatePriorities = output<PriorityItem[]>();

  newCategory = signal<CategoryItem>({ id: '', name: '', label: '' });
  newPriority = signal<PriorityItem>({ id: '', name: '', label: '', color: '#008046' });

  addCategory() {
    const category = this.newCategory();
    if (!category.id || !category.name || !category.label) {
      return;
    }

    if (this.categories().some(item => item.id === category.id)) {
      alert('El ID de categoría ya existe');
      return;
    }

    this.onUpdateCategories.emit([...this.categories(), { ...category }]);
    this.newCategory.set({ id: '', name: '', label: '' });
  }

  deleteCategory(id: string) {
    if (confirm('¿Estás seguro de eliminar esta categoría? Los tickets existentes con esta categoría no se verán afectados.')) {
      this.onUpdateCategories.emit(this.categories().filter(category => category.id !== id));
    }
  }

  addPriority() {
    const priority = this.newPriority();
    if (!priority.id || !priority.name || !priority.label || !priority.color) {
      return;
    }

    if (this.priorities().some(item => item.id === priority.id)) {
      alert('El ID de prioridad ya existe');
      return;
    }

    this.onUpdatePriorities.emit([...this.priorities(), { ...priority }]);
    this.newPriority.set({ id: '', name: '', label: '', color: '#008046' });
  }

  deletePriority(id: string) {
    if (confirm('¿Estás seguro de eliminar esta prioridad? Los tickets existentes con esta prioridad no se verán afectados.')) {
      this.onUpdatePriorities.emit(this.priorities().filter(priority => priority.id !== id));
    }
  }

  updateCategoryField(field: keyof CategoryItem, value: string) {
    this.newCategory.update(category => ({
      ...category,
      [field]: field === 'id' ? value.toLowerCase().replace(/\s/g, '-') : value
    }));
  }

  updatePriorityField(field: keyof PriorityItem, value: string) {
    this.newPriority.update(priority => ({
      ...priority,
      [field]: field === 'id' ? value.toLowerCase().replace(/\s/g, '-') : value
    }));
  }
}