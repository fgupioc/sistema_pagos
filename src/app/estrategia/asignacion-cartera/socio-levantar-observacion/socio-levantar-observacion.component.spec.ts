import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocioLevantarObservacionComponent } from './socio-levantar-observacion.component';

describe('SocioLevantarObservacionComponent', () => {
  let component: SocioLevantarObservacionComponent;
  let fixture: ComponentFixture<SocioLevantarObservacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocioLevantarObservacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocioLevantarObservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
