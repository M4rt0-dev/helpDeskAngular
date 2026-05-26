import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityWarningComponent } from './security-warning';

describe('SecurityWarningComponent', () => {
  let component: SecurityWarningComponent;
  let fixture: ComponentFixture<SecurityWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityWarningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityWarningComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
