export interface WorkModel {
    WorkID?: number;
    WorkSubject?: string;
    WorkDetail?: string;
    isHourly?: boolean;
    StartTime?: string;
    EndTime?: string;
    WorkTimeZone?: string;
    ColorID?: number;
    ColorName?: string;
    Color_Hex?: string;
    PriorityID?: number;
    PriorityName?: string;
    PriorityLevel?: number;
    UserID?: number;
    UserName?: string;
    UserType?: string;
    UserTypeID?: number;
    CompanyID?: number;
    CompanyName?: string;
    StatusID?: number;
    StatusName?: string;
    StartDate?: string; // You can change this to Date if you're parsing
    EndDate?: string;
    CreatedBy?: number;
    isRadius?: boolean;
    Radius?: string;
    ProjectStartingDate?: string;
    ProjectEndingDate?: string;
    JobID?: number;
    JobName?: string;
    JobAddress?: string;
    isActive?: number;
    WorkingDays?: string;
    ProjectDateRange?: string;
    ColorDetail?: string;
}
