import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTicketModal } from './new-ticket-modal';

describe('NewTicketModal', () => {
  let component: NewTicketModal;
  let fixture: ComponentFixture<NewTicketModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTicketModal],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTicketModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
