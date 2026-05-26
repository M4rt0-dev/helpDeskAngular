import { ComponentFixture, TestBed } from '@angular/core/testing';

import { appConfig } from '../../app.config';
import { TicketCard } from './ticket-card';

describe('TicketCard', () => {
  let component: TicketCard;
  let fixture: ComponentFixture<TicketCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCard],
      providers: appConfig.providers,
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ticket', {
      id: 'INC-001',
      title: 'Error de acceso',
      description: 'No permite iniciar sesion',
      status: 'nuevo',
      priority: 'alta',
      category: 'acceso',
      createdBy: 'mario',
      assignedTo: '',
      createdAt: '2026-05-26T00:00:00.000Z',
      comments: [],
      activity: []
    });
    fixture.componentRef.setInput('currentUserRole', 'tecnico');
    fixture.componentRef.setInput('allUsers', []);
    fixture.componentRef.setInput('categories', []);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
