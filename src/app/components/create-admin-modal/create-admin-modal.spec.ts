import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminModal } from './create-admin-modal';

describe('CreateAdminModal', () => {
  let component: CreateAdminModal;
  let fixture: ComponentFixture<CreateAdminModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdminModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAdminModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
