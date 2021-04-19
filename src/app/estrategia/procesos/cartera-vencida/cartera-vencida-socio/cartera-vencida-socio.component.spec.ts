import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraVencidaSocioComponent } from './cartera-vencida-socio.component';

describe('CarteraVencidaSocioComponent', () => {
  let component: CarteraVencidaSocioComponent;
  let fixture: ComponentFixture<CarteraVencidaSocioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraVencidaSocioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraVencidaSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
