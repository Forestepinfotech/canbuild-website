export interface JobDetail {
    JobID?: number;
    JobName: string;
    CompanyName: string;
    CompanyEmail: string;
    CompanyContact: string;
    isActive: number;
    ManagerID: number;
    ManagerName: string;
    ContactNo: string;
    EmailID: string;
    CompanyID: number;
    WorkingDays: string;
    JobAddress: string;
    JobCity: string;
    JobPostalCode: string;
    ProjectStartingDate: string; // ISO date string
    ProjectEndingDate: string;   // ISO date string
    CreatedName: string;
    UserID: number;
    CreatedOn: string;           // ISO date string
    StatusID: number;
    StatusName: string;
    ProjectDateRange: string;
}
