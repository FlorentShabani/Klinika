import {lazy} from "react";

const Home = lazy(() => import("../pages/Home"));
const HelpCenter = lazy(() => import("../pages/HelpCenter"));
const About = lazy(() => import("../pages/About"));
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const PatientDashboard = lazy(() => import("../pages/patient/Dashboard"));
const PatientReservations = lazy(() => import("../pages/patient/Reservations"));
const PatientReservationsList = lazy(() => import("../pages/patient/ReservationsList"));
const PatientConsultationsList = lazy(() => import("../pages/patient/ConsultationsList"));

const DeveloperDashboard = lazy(() => import("../pages/developer/Dashboard"));
const DeveloperUserData = lazy(() => import("../pages/developer/UserData"));
const DeveloperSpecializationData = lazy(() => import("../pages/developer/SpecializationData"));
const DeveloperRoleData = lazy(() => import("../pages/developer/RoleData"));
const DeveloperHelpCenterData = lazy(() => import("../pages/developer/HelpCenterData"));
const DeveloperHelpCenterCategoryData = lazy(() => import("../pages/developer/HelpCenterCategoryData"));
const DeveloperServiceDeskData = lazy(() => import("../pages/developer/ServiceDeskData"));
const DeveloperBlockData = lazy(() => import("../pages/developer/BlockData"));
const Settings = lazy(() => import("../pages/Settings.tsx"));
const DeveloperReservationData = lazy(() => import("../pages/developer/ReservationData"));
const DeveloperConsultationData = lazy(() => import("../pages/developer/ConsultationData"));
const DeveloperSpecializedDoctorData = lazy(() => import("../pages/developer/SpecializedDoctorData"));
const DeveloperPatientData = lazy(() => import("../pages/developer/PatientData"));
// const DeveloperUserRolesData = lazy(() => import("../pages/developer/UserRolesData"));


const SpecializedDashboard = lazy(() => import("../pages/specialized/Dashboard"));
const SpecializedAppointments = lazy(() => import("../pages/specialized/Appointments"));


const PrimaryDashboard = lazy(() => import("../pages/primary/Dashboard"));
const PrimaryAppointments = lazy(() => import("../pages/primary/Appointments"));

export {
    Home,
    HelpCenter,
    About,
    Register,
    Login,
    Settings,

    PatientDashboard,
    PatientReservations,
    PatientReservationsList,
    PatientConsultationsList,

    DeveloperDashboard,
    DeveloperUserData,
    DeveloperSpecializationData,
    DeveloperRoleData,
    DeveloperHelpCenterData,
    DeveloperHelpCenterCategoryData,
    DeveloperServiceDeskData,
    DeveloperBlockData,
    DeveloperReservationData,
    DeveloperConsultationData,
    DeveloperSpecializedDoctorData,
    DeveloperPatientData,

    SpecializedDashboard,
    SpecializedAppointments,

    PrimaryDashboard,
    PrimaryAppointments
};
