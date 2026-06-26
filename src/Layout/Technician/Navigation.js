const Navigations = [
  {
    id: "1",
    label: "Dashboard",
    path: "/technician/dashboard",
    show: true,
    icon: "fas fa-tachometer-alt",
    label_key: "tech_app_nav_dashboard",
  },
  {
    id: "2",
    label: "Timesheet",
    path: "/technician/timesheet",
    show: true,
    icon: "fas fa-calendar-alt",
    label_key: "tech_app_nav_timesheet",
  },
  {
    id: "3",
    label: "All Jobs",
    path: "/technician/jobs",
    show: true,
    icon: "fas fa-border-all",
    label_key: "tech_app_nav_alljobs",
items: [
      {
        label: "Job Details",
        show: true,
        fa_icon: "",
        icon: "fas fa-align-left",
        path: "/technician/jobs/job-details",
        label_key: "tech_app_nav_alljobs_jobdetails",
      }
    ],
  },
  {
    id: "4",
    label: "Fleet",
    path: "/technician/fleet",
    show: true,
    icon: "fas fa-truck",
    label_key: "tech_app_nav_fleet",
  },
{
    id: "5",
    label: "Complicance Document",
    path: "/technician/job-compliance-document",
    show: true,
    icon: "fas fa-file-pdf",
    label_key: "tech_app_nav_compliance_document",
  },
  {
    id: "13",
    label: "My Account",
    path: "/technician/user",
    show: false,
    fa_icon: "flaticon-tasks",
    icon: "fas fa-user",
    items: [
      {
        label: "My Profile",
        show: true,
        fa_icon: "",
        icon: "fas fa-align-left",
        path: "/technician/user/profile",
        label_key: "side_menu_navigation_my_account_sub_my_profile",
      },
      {
        label: "Change Password",
        show: true,
        fa_icon: "",
        icon: "fas fa-align-left",
        path: "/technician/user/change-password",
        label_key: "side_menu_navigation_my_account_sub_change_password",
      },
      {
        label: "Change Language",
        show: true,
        fa_icon: "",
        icon: "fas fa-align-left",
        path: "/technician/user/languages",
        label_key: "side_menu_navigation_my_account_sub_change_language",
      },
    ],
    label_key: "side_menu_navigation_my_account",
  },
];

export default Navigations;
