import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocsFilesComponent } from './admin-docs-files.component';

describe('AdminDocsFilesComponent', () => {
  let component: AdminDocsFilesComponent;
  let fixture: ComponentFixture<AdminDocsFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocsFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDocsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
