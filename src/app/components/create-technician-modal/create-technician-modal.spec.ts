import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTechnicianModal } from './create-technician-modal';

describe('CreateTechnicianModal', () => {
  let component: CreateTechnicianModal;
  let fixture: ComponentFixture<CreateTechnicianModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTechnicianModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTechnicianModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
