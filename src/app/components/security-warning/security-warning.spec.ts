import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityWarning } from './security-warning';

describe('SecurityWarning', () => {
  let component: SecurityWarning;
  let fixture: ComponentFixture<SecurityWarning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityWarning],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityWarning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
