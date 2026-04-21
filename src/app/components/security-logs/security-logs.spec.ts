import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLogs } from './security-logs';

describe('SecurityLogs', () => {
  let component: SecurityLogs;
  let fixture: ComponentFixture<SecurityLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
