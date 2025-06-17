import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocsFilsJobComponent } from './admin-docs-fils-job.component';

describe('AdminDocsFilsJobComponent', () => {
  let component: AdminDocsFilsJobComponent;
  let fixture: ComponentFixture<AdminDocsFilsJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocsFilsJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDocsFilsJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
