import { ComponentFixture, TestBed } from '@angular/core/testing';

import { appConfig } from '../../app.config';
import { ConfigurationPanel } from './configuration-panel';

describe('ConfigurationPanel', () => {
  let component: ConfigurationPanel;
  let fixture: ComponentFixture<ConfigurationPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationPanel],
      providers: appConfig.providers,
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationPanel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', []);
    fixture.componentRef.setInput('priorities', []);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
