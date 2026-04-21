import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailModal } from './ticket-detail-modal';

describe('TicketDetailModal', () => {
  let component: TicketDetailModal;
  let fixture: ComponentFixture<TicketDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
