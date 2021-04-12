import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosObservadosComponent } from './socios-observados.component';

describe('SociosObservadosComponent', () => {
  let component: SociosObservadosComponent;
  let fixture: ComponentFixture<SociosObservadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SociosObservadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SociosObservadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
