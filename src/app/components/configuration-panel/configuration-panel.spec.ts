import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationPanel } from './configuration-panel';

describe('ConfigurationPanel', () => {
  let component: ConfigurationPanel;
  let fixture: ComponentFixture<ConfigurationPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
