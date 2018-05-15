import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTabComponent } from './route-tab.component';

describe('RouteTabComponent', () => {
  let component: RouteTabComponent;
  let fixture: ComponentFixture<RouteTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
