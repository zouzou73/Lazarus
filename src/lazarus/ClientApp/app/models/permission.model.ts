export type PermissionNames =
    "View Users" | "Manage Users" |
    "View Roles" | "Manage Roles" | "Assign Roles" |
    "View Appointments" | "Manage Appointments" | "Request Appointments" | "Accept Appointments" |
    "View Consultations" |
    "View Patients" | "Manage Patients" |
    "View Providers" | "Manage Providers";

export type PermissionValues =
    "users.view" | "users.manage" |
    "roles.view" | "roles.manage" | "roles.assign" |
    "appointments.view" | "appointments.manage" | "appointments.request" | "appointments.accept" |
    "consultations.view" |
    "patients.view" | "patients.manage" |
    "providers.view" | "providers.manage";

export class Permission {

    public static readonly viewUsersPermission: PermissionValues = "users.view";
    public static readonly manageUsersPermission: PermissionValues = "users.manage";

    public static readonly viewRolesPermission: PermissionValues = "roles.view";
    public static readonly manageRolesPermission: PermissionValues = "roles.manage";
    public static readonly assignRolesPermission: PermissionValues = "roles.assign";

    public static readonly viewAppointmentsPermission: PermissionValues = "appointments.view";
    public static readonly manageAppointmentsPermission: PermissionValues = "appointments.manage";
    public static readonly requestAppointmentsPermission: PermissionValues = "appointments.request";
    public static readonly acceptAppointmentsPermission: PermissionValues = "appointments.accept";

    public static readonly viewConsultationsPermission: PermissionValues = "consultations.view";

    public static readonly viewPatientsPermission: PermissionValues = "patients.view";
    public static readonly managePatientsPermission: PermissionValues = "patients.manage";

    public static readonly viewProvidersPermission: PermissionValues = "providers.view";
    public static readonly manageProvidersPermission: PermissionValues = "providers.manage";


    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}