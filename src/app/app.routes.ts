import { Routes } from '@angular/router';

import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ClientComponent } from './components/client/client.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserManageComponent } from './components/user-manage/user-manage.component';
import { UserDocumentsComponent } from './components/user-documents/user-documents.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectManageComponent } from './components/project-manage/project-manage.component';
import { ProjectDocumentsComponent } from './components/project-documents/project-documents.component';
import { WorkCreateComponent } from './components/work-create/work-create.component';
import { WorkManageComponent } from './components/work-manage/work-manage.component';
import { WorkDocumentsComponentOnInit } from './components/work-documents/work-documents.component';
import { SupervisorComponent } from './components/supervisor/supervisor/supervisor.component';
import { SupervisordashboardComponent } from './components/supervisor/supervisordashboard/supervisordashboard.component';
import { AdminRequirementsComponent } from './components/admin-requirements/admin-requirements.component';
import { AdminColorComponent } from './components/admin-color/admin-color.component';
import { WorkRequestComponent } from './components/work-request/work-request.component';
import { AdminDocsComponent } from './components/admin-docs/admin-docs.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: 'Dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
        pathMatch: 'full',
      },
      {
        path: 'user-create',
        component: UserCreateComponent,
        title: 'User Create',
        pathMatch: 'full',
      },
      {
        path: 'user-manage',
        component: UserManageComponent,
        title: 'User Manage',
        pathMatch: 'full',
      },
      {
        path: 'user-documents',
        component: UserDocumentsComponent,
        title: 'User Documents',
        pathMatch: 'full',
      },
      {
        path: 'project-create',
        component: ProjectCreateComponent,
        title: 'Project Create',
        pathMatch: 'full',
      },
      {
        path: 'project-manage',
        component: ProjectManageComponent,
        title: 'Project Manage',
        pathMatch: 'full',
      },
      {
        path: 'project-documents',
        component: ProjectDocumentsComponent,
        title: 'Project Manage',
        pathMatch: 'full',
      },

      {
        path: 'work-create',
        component: WorkCreateComponent,
        title: 'Work Create',
        pathMatch: 'full',
      },
      {
        path: 'work-manage',
        component: WorkManageComponent,
        title: 'Work Manage',
        pathMatch: 'full',
      },
      {
        path: 'work-documents',
        component: WorkDocumentsComponentOnInit,
        title: 'Work Manage',
        pathMatch: 'full',
      },

      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
        pathMatch: 'full',
      },
      {
        path: 'requirements',
        component: AdminRequirementsComponent,
        title: 'Requirements',
      }, {
        path: 'color',
        component: AdminColorComponent,
        title: 'Color',
      }, {
        path: 'request',
        component: WorkRequestComponent,
        title: 'Work Request',
      },
      {
        path: 'docs',
        component: AdminDocsComponent,
        title: 'Documents',
      },
    ],
  },
  {
    path: 'user',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: UserdashboardComponent,
        title: 'MyDashboard',
      },
      {
        path: 'dashboard',
        component: UserdashboardComponent,
        title: 'MyDashboard',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: UserprofileComponent,
        title: 'MyProfile',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'supervisor',
    component: SupervisorComponent,
    children: [
      {
        path: '',
        component: SupervisordashboardComponent,
        title: 'MyDashboard',
      },
      {
        path: 'dashboard',
        component: SupervisordashboardComponent,
        title: 'MyDashboard',
        pathMatch: 'full',
      },
    ],
  },
];
