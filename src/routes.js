import { Colors } from 'chart.js'
import { element } from 'prop-types'
import React from 'react'
const DashBoard = React.lazy(() => import('./views/theme/dashboard/DashBoard'))
const LiveTrack = React.lazy(() => import('./views/theme/livetrack/LiveTrack'))
const IndividualTrack = React.lazy(() => import('./views/theme/livetrack/IndividualTrack.js'))

// master
const Devices = React.lazy(() => import('./views/Master/devices/Devices.js'))
const Users = React.lazy(() => import('./views/Master/users/Users.js'))
const Group = React.lazy(() => import('./views/Master/group/Group.js'))
const Geofences = React.lazy(() => import('./views/Master/geofences/Geofences.js'))
const Driver = React.lazy(() => import('./views/Master/driver/Driver.js'))
const Notifications = React.lazy(() => import('./views/Master/notifications/Notifications.js'))
const Maintenance = React.lazy(() => import('./views/Master/maintenance/Maintenance.js'))
const Category = React.lazy(() => import('./views/Master/category/Category.js'))
const Model = React.lazy(() => import('./views/Master/model/Model.js'))
// reports
const Combine = React.lazy(() => import('./views/Reports/StatusReports/StatusReport.js'))
const Custom = React.lazy(() => import('./views/Reports/DistanceReport/DistanceReport.js'))
const History = React.lazy(() => import('./views/Reports/HistoryReport/HistoryReport.js'))
const Stops = React.lazy(() => import('./views/Reports/StopsReport/StopsReport.js'))
const Travel = React.lazy(() => import('./views/Reports/TravelSummary/TravelReport.js'))
const Trips = React.lazy(() => import('./views/Reports/TripReport/TripReport.js'))
const IdleReport = React.lazy(() => import('./views/Reports/IdleReport/IdleReport.js'))
const Schedules = React.lazy(() => import('./views/Reports/SensorReport/SensorReport.js'))
const Alerts = React.lazy(() => import('./views/Reports/alerts-events/Alerts.js'))
// const Summary = React.lazy(() => import('./views/Reports/VehicleReport/VehicleReport.js'))
const Customchart = React.lazy(() => import('./views/Reports/GeofenceReport/GeofenceReport.js'))

// expense management
const InvoiceForm = React.lazy(() => import('./views/ExpenseManagement/Invoice.js'))
const Po = React.lazy(() => import('./views/ExpenseManagement/PO.js'))
const InventoryManagment = React.lazy(() => import('./views/ExpenseManagement/InventoryManage.js'))

// answer tickets
const AnswerTicket = React.lazy(() => import('./views/ExpenseManagement/AnswerTicket.js'))

// Raise Ticket
const RaiseTicket = React.lazy(() => import('./views/forms/help-support/RaiseTicket.js'))

// additional
const ChatBot = React.lazy(() => import('./views/theme/chatbot/ChatBot'))
const HelpSupport = React.lazy(() => import('./views/forms/help-support/HelpSupp.js'))
const GettingStarted = React.lazy(
  () => import('./components/articles/gettingStarted/GettingStarted.js'),
)
const Faq = React.lazy(() => import('./components/articles/faq/Faq.js'))


// Parent Eyes Route

// Schools parent eye

const StudentDetail = React.lazy(() => import('./views/School/StudentDetail/StudentDetail.jsx'))
const Geofence = React.lazy(() => import('./views/School/Geofence/Geofence.jsx'))
const Absent = React.lazy(() => import('./views/School/Absent/Absent.jsx'))
const ApprovedRequest = React.lazy(() => import('./views/School/ApprovedRequest/ApprovedRequest.jsx'))
const DeniedRequest = React.lazy(() => import('./views/School/DeniedRequest/DeniedRequest.jsx'))
const Leave = React.lazy(() => import('./views/School/Leave/Leave.jsx'))
const PickAndDrop = React.lazy(() => import('./views/School/PickAndDrop/PickupAndDrop.jsx'))
const Present = React.lazy(() => import('./views/School/Present/Present.jsx'))
const Status = React.lazy(() => import('./views/School/Status/Status.jsx'))

// User parent eye

const AddDevice = React.lazy(() => import('./views/Users/AddDevices/AddDevices.jsx'))
const UserAccess = React.lazy(() => import('./views/Users/UserAccess/UserAccess.jsx'))
const SupervisorApprove = React.lazy(() => import('./views/Users/Supervisor/Supervisor.jsx'))
const SchoolMaster = React.lazy(() => import('./views/Users/SchoolMaster/SchoolMaster.jsx'))
const ReadDevices = React.lazy(() => import('./views/Users/ReadDevices/ReadDevices.jsx'))
const StudentApprove = React.lazy(() => import('./views/Users/Parent/Parent.jsx'))
const SchoolNotification = React.lazy(() => import('./views/Users/Notification/Notification.jsx'))
const DriverApprove = React.lazy(() => import('./views/Users/Driver/Driver.jsx'))
const BranchMaster = React.lazy(() => import('./views/Users/BranchMaster/BranchMaster.jsx'))
// const AssignBranches = React.lazy(() => import('./views/Users/AssignBranches/AssignBranches.jsx'))
// const MyBranchDevices = React.lazy(() => import('./views/Users/MyBranchDevices/MyBranchDevices.jsx'))

// Reports parent eye

const DeviceStatus = React.lazy(() => import('./views/ReportsUpdated/Combined/Combined.jsx'))
const Route = React.lazy(() => import('./views/ReportsUpdated/Route/Route.jsx'))
const Events = React.lazy(() => import('./views/ReportsUpdated/Event/Event.jsx'))
const SchoolTrips = React.lazy(() => import('./views/ReportsUpdated/Trips/Trips.jsx'))
const StopsReports = React.lazy(() => import('./views/ReportsUpdated/Stops/Stops.jsx'))
const Summary = React.lazy(() => import('./views/ReportsUpdated/Summary/Summary.jsx'))
const Statistics = React.lazy(() => import('./views/ReportsUpdated/Statistics/Statistics.jsx'))
const KilometerDistance = React.lazy(() => import('./views/ReportsUpdated/DistanceReport/DistanceReport.jsx'))
const SchoolGeofenceReports = React.lazy(() => import('./views/ReportsUpdated/GeofenceReport/GeofenceReport.jsx'))


const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/dashboard', name: 'DashBoard', element: DashBoard },
  { path: '/livetrack', name: 'LiveTrack', element: LiveTrack },
  {
    path: '/salesman/:deviceId/:category/:name',
    name: 'IndividualTrack',
    element: IndividualTrack,
  },
  { path: '/notifications', name: 'Notifications', element: Notifications },
  { path: '/devices', name: 'Devices', element: Devices },
  { path: '/geofences', name: 'Geofence', element: Geofences },
  { path: '/group', name: 'Group', element: Group },
  { path: '/maintenance', name: 'Maintenance', element: Maintenance },
  { path: '/driver', name: 'Driver', element: Driver },
  { path: '/users', name: 'Users', element: Users },
  { path: '/category', name: 'Category', element: Category },
  { path: '/model', name: 'Model', element: Model },
  { path: '/statusreports', name: 'Combine', element: Combine },
  { path: '/distancereports', name: 'Custom', element: Custom },
  { path: '/history', name: 'History', element: History },
  {
    path: '/history/:deviceId/:category/:name',
    name: 'History',
    element: History,
  },
  { path: '/stops', name: 'Stops', element: Stops },
  { path: '/travelsreport', name: 'Travel', element: Travel },
  { path: '/tripsreport', name: 'Trips', element: Trips },
  { path: '/idlereport', name: 'Idle', element: IdleReport },
  { path: '/sensorreports', name: 'Schedule', element: Schedules },
  { path: '/alerts-events', name: 'Alerts', element: Alerts },
  // { path: '/vehiclereport', name: 'Summary', element: Summary },
  { path: '/geofencereport', name: 'Geofence Report', element: Customchart },
  { path: '/invoice', name: 'Invoice', element: InvoiceForm },
  { path: '/po', name: 'PO', element: Po },
  { path: '/inventory-management', name: 'Inventory Management', element: InventoryManagment },
  { path: '/chatbot', name: 'ChatBot', element: ChatBot },
  { path: '/h&s', name: 'Help & Support', element: HelpSupport },
  { path: '/HelpSupp/getting-started', name: 'Getting Started', element: GettingStarted },
  { path: '/answer-ticket', name: 'Answer Ticket', element: AnswerTicket },
  { path: '/HelpSupp/faq', name: 'FAQ', element: Faq },
  { path: '/raise-ticket', name: 'Raise Ticket', element: RaiseTicket },

  // Parnet Eyes Route

  // Schools Parent eye Route

  { path: '/studentdetail', name: 'StudentDetail', element: StudentDetail },
  { path: '/schoolgeofence', name: 'Geofence', element: Geofence },
  { path: '/schoolstatus', name: 'Status', element: Status },
  { path: '/schoolpresent', name: 'Present', element: Present },
  { path: '/schoolpickanddrop', name: 'Pick And Drop', element: PickAndDrop },
  { path: '/schoolleave', name: 'Leave', element: Leave },
  { path: '/schooldeniedrequest', name: 'Denied Request', element: DeniedRequest },
  { path: '/schoolapprovedrequest', name: 'Approved Request', element: ApprovedRequest },
  { path: '/schoolabsent', name: 'Absent', element: Absent },

  // User Parent eye Route

  { path: '/adddevices', name: 'Add Devices', element: AddDevice },
  { path: '/branchmaster', name: 'Branch Master', element: BranchMaster },
  { path: '/schooldriver', name: 'Driver Approve', element: DriverApprove },
  { path: '/schoolnotification', name: 'School Notification', element: SchoolNotification },
  { path: '/parent', name: 'Student Approve', element: StudentApprove },
  { path: '/readdevices', name: 'Read Devices', element: ReadDevices },
  { path: '/schoolmaster', name: 'School Master', element: SchoolMaster },
  { path: '/supervisor', name: 'Supervisor Approve', element: SupervisorApprove },
  { path: '/useraccess', name: 'User Access', element: UserAccess },
  // { path: '/assignbranches', name: 'Assign Branches', element: AssignBranches },
  // { path: '/mybranchdevices', name: 'My Branch Devices', element: MyBranchDevices },

  // Reports parent eye

  { path: '/combined', name: 'Device Status', element: DeviceStatus },
  { path: '/route', name: 'Route', element: Route },
  { path: '/event', name: 'Events', element: Events },
  { path: '/schooltrips', name: 'School Trips', element: SchoolTrips },
  { path: '/schoolstops', name: 'Stops Reports', element: StopsReports },
  { path: '/summary', name: 'Summary', element: Summary },
  { path: '/statistics', name: 'Statistics', element: Statistics },
  { path: '/schooldistance', name: 'Kilometer Distance', element: KilometerDistance },
  { path: '/schoolgeorep', name: 'School Geofence Reports', element: SchoolGeofenceReports },

]
export default routes
