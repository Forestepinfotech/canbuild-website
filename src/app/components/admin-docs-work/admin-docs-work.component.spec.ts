import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocsWorkComponent } from './admin-docs-work.component';

describe('AdminDocsWorkComponent', () => {
  let component: AdminDocsWorkComponent;
  let fixture: ComponentFixture<AdminDocsWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocsWorkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDocsWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
