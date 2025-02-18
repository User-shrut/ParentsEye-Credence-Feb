// ################################### NEW CODE CHANGE FOR SIDEBAR ################################################//

import React, { useEffect, useState } from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { BsFillSignStopFill, BsGeo, BsWindowFullscreen } from 'react-icons/bs'
import { BsChatDots } from 'react-icons/bs'
import { FaAddressCard, FaCar, FaHistory, FaRegEdit, FaRegUser, FaRoute, FaStopwatch, FaUserAlt, FaUserGraduate } from 'react-icons/fa'
import { LiaChalkboardTeacherSolid, LiaFileInvoiceDollarSolid } from 'react-icons/lia'
import { TbBusStop, TbDevicesPlus, TbMessageReport, TbReport, TbSchool } from 'react-icons/tb'
import { BiBookReader, BiLogOutCircle, BiUniversalAccess } from 'react-icons/bi'
import { FaCarOn, FaSchoolFlag, FaUserGroup } from 'react-icons/fa6'
import { GrHostMaintenance, GrUserPolice, GrUserWorker } from 'react-icons/gr'
import { IoMdNotifications, IoMdNotificationsOutline } from 'react-icons/io'
import { MdCoPresent, MdEventNote, MdOutlineCategory, MdOutlineSpaceDashboard, MdSensors } from 'react-icons/md'
import { TbCategory } from 'react-icons/tb'
import { GiCancel, GiPathDistance } from 'react-icons/gi'
import { TbReportAnalytics } from 'react-icons/tb'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { RiGitBranchLine, RiParentLine, RiPinDistanceFill } from 'react-icons/ri'
import { PiDevicesLight, PiMapPinAreaFill, PiStudentBold } from 'react-icons/pi'
import { BiSupport } from 'react-icons/bi'
import { TicketCheck } from 'lucide-react'
import { icon } from 'leaflet'
import { FcLeave } from "react-icons/fc";
import { VscRequestChanges } from 'react-icons/vsc'
import { AiOutlineFileDone } from 'react-icons/ai'
import { LuGitBranchPlus } from 'react-icons/lu'

const _nav = (role, decodedToken) => {
  let devices,
    users,
    driver,
    groups,
    geofence,
    notification,
    maintenance,
    category,
    model,
    status,
    distance,
    history,
    stop,
    travel,
    idle,
    trips,
    sensor,
    alerts,
    // vehicle,
    geofenceReport
  console.log(decodedToken)

  if (role != 'superadmin') {
    ; ({
      devices,
      users,
      driver,
      groups,
      geofence,
      notification,
      maintenance,
      category,
      model,
      status,
      distance,
      history,
      stop,
      travel,
      trips,
      idle,
      // sensor,
      alerts,
      // vehicle,
      geofenceReport,
    } = decodedToken.user)
  }

  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }} title="Dashboard">
          <MdOutlineSpaceDashboard
            color="black"
            style={{ marginRight: '15px', fontSize: '30px' }}
          />
        </div>
      ),
    },
    ...(role == 'superadmin'
      ? [
        {
          component: CNavTitle,
          name: 'All Menu',
        },

        // Parent Eyess navigation
        // School Parnet Eyes

        {
          component: CNavItem,
          name: 'School',

          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }} title="Reports">
              <TbSchool color="black" style={{ marginRight: '15px', fontSize: '30px' }} />
            </div>
          ),
          items: [
            {
              component: CNavItem,
              name: 'StudentDetail',
              to: '/studentdetail',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PiStudentBold style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Geofence',
              to: '/schoolgeofence',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BsGeo style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Absent',
              to: '/schoolabsent',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FcLeave style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Approved Request',
              to: '/schoolapprovedrequest',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <VscRequestChanges style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Denied Request',
              to: '/schooldeniedrequest',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GiCancel style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Leave',
              to: '/schoolleave',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <AiOutlineFileDone style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Pick And Drop',
              to: '/schoolpickanddrop',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TbBusStop style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Present',
              to: '/schoolpresent',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdCoPresent style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Status',
              to: '/schoolstatus',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TbMessageReport style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },


          ]
        },

        // Parnet Eye User Section

        {
          component: CNavItem,
          name: 'Users',

          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }} title="Reports">
              <FaUserGraduate color="black" style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
          items: [
            {
              component: CNavItem,
              name: 'School Master',
              to: '/schoolmaster',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaSchoolFlag style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Branch Master',
              to: '/branchmaster',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <LuGitBranchPlus style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Driver Approve',
              to: '/schooldriver',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GrUserPolice style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Student Approve',
              to: '/parent',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RiParentLine style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Supervisor Approve',
              to: '/supervisor',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <LiaChalkboardTeacherSolid style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Add Devices',
              to: '/adddevices',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TbDevicesPlus style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'Read Devices',
              to: '/readdevices',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BiBookReader style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'User Access',
              to: '/useraccess',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BiUniversalAccess style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            {
              component: CNavItem,
              name: 'School Notification',
              to: '/schoolnotification',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IoMdNotificationsOutline style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },

            // {
            //   component: CNavItem,
            //   name: 'Assign Branches',
            //   to: '/assignbranches',

            //   icon: (
            //     <div style={{ display: 'flex', alignItems: 'center' }}>
            //       <RiGitBranchLine style={{ marginRight: '15px', fontSize: '25px' }} />
            //     </div>
            //   ),
            // },

            // {
            //   component: CNavItem,
            //   name: 'My Branch Devices',
            //   to: '/mybranchdevices',

            //   icon: (
            //     <div style={{ display: 'flex', alignItems: 'center' }}>
            //       <PiDevicesLight style={{ marginRight: '15px', fontSize: '25px' }} />
            //     </div>
            //   ),
            // },


          ]
        },


        // Credence Tracker code navigation

        {
          component: CNavItem,
          name: 'Master',

          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }} title="Master">
              <FaAddressCard
                color="black"
                style={{ marginRight: '15px', fontSize: '27px' }}
              />
            </div>
          ),

          items: [
            {
              component: CNavItem,
              name: 'Devices',

              to: '/devices',
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaCar style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Users',

              to: '/users',
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaUserAlt style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Group',

              to: '/group',
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaUserGroup style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Geofences',
              to: '/geofences',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Driver',
              to: '/driver',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GrUserWorker style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Notifications',
              to: '/notifications',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IoMdNotifications style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Maintenance',
              to: '/maintenance',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GrHostMaintenance style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Category',
              to: '/category',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdOutlineCategory style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Model',
              to: '/model',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TbCategory style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            // {
            //   component: CNavItem,
            //   name: 'Answer Ticket',
            //   to: '/answer-ticket',
            //   icon: (
            //     <div style={{ display: 'flex', alignItems: 'center' }}>
            //       <TicketCheck style={{ marginRight: '15px', fontSize: '25px' }} />
            //     </div>
            //   ),
            // },
          ],
        },
        {
          component: CNavItem,
          name: 'Report',

          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }} title="Reports">
              <TbReport color="black" style={{ marginRight: '15px', fontSize: '30px' }} />
            </div>
          ),
          items: [
            {
              component: CNavItem,
              name: 'Status Reports',
              to: '/statusreports',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TbReportAnalytics style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Distance Reports',
              to: '/distancereports',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GiPathDistance style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'History',
              to: '/history',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaHistory style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Stops',
              to: '/stops',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BsFillSignStopFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Travel Summary',
              to: '/travelsreport',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaRoute style={{ marginRight: '15px', fontSize: '25px' }} />
                </div >
              ),
            },
            {
              component: CNavItem,
              name: 'Trips Report',
              to: '/tripsreport',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RiPinDistanceFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Idle Report',
              to: '/idlereport',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaStopwatch style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            // {
            //   component: CNavItem,
            //   name: 'Sensor Reports',
            //   to: '/sensorreports',

            //   icon: (
            //     <div style={{ display: 'flex', alignItems: 'center' }}>
            //       <MdSensors style={{ marginRight: '15px', fontSize: '25px' }} />
            //     </div>
            //   ),
            // },
            {
              component: CNavItem,
              name: 'Alerts/Events',
              to: '/alerts-events',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdEventNote style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            // {
            //   component: CNavItem,
            //   name: 'Vehicle Reports',
            //   to: '/vehiclereport',

            //   icon: (
            //     <div style={{ display: 'flex', alignItems: 'center' }}>
            //       <FaCarOn style={{ marginRight: '15px', fontSize: '25px' }} />
            //     </div>
            //   ),
            // },
            {
              component: CNavItem,
              name: 'Geofence Report',
              to: '/geofencereport',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
          ],
        },
        {
          component: CNavItem,
          name: 'Supports',

          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }} title="Expense Management">
              <BiSupport color="black" style={{ marginRight: '15px', fontSize: '30px' }} />
            </div>
          ),
          items: [
            // { component: CNavItem, name: 'Invoice', to: '/invoice' },
            // { component: CNavItem, name: 'PO', to: '/po' },
            // { component: CNavItem, name: 'Inventory', to: '/inventory-management' },
            {
              component: CNavItem,
              name: 'Raise Ticket',
              to: '/raise-ticket',
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TicketCheck style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            {
              component: CNavItem,
              name: 'Answered Ticket',
              to: '/answer-ticket',
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TicketCheck style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
          ],
        },




      ]
      : [
        {
          component: CNavTitle,
          name: 'All Menu',
        },
        (devices || users || groups || geofence || driver || notification || maintenance) && {
          component: CNavGroup,
          name: 'Master',
          visible: true, // This can be a boolean or controlled by a state.
          icon: (
            <div
              style={{ display: 'flex', alignItems: 'center', color: '#FFFFF' }}
              title="Master"
            >
              <LiaFileInvoiceDollarSolid style={{ marginRight: '15px', fontSize: '30px' }} />
            </div>
          ),
          items: [
            devices && {
              component: CNavItem,
              name: 'Devices',
              to: '/devices',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaCar style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            users && {
              component: CNavItem,
              name: 'Users',
              to: '/users',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaUserAlt style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            groups && {
              component: CNavItem,
              name: 'Group',
              to: '/group',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaUserGroup style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            geofence && {
              component: CNavItem,
              name: 'Geofences',
              to: '/geofences',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            driver && {
              component: CNavItem,
              name: 'Driver',
              to: '/driver',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GrUserWorker style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            notification && {
              component: CNavItem,
              name: 'Notifications',
              to: '/notifications',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IoMdNotifications style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            maintenance && {
              component: CNavItem,
              name: 'Maintenance',
              to: '/maintenance',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GrHostMaintenance style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
          ].filter(Boolean),
        },
        (status ||
          distance ||
          history ||
          stop ||
          travel ||
          idle ||
          trips ||
          alerts ||
          dayreport ||
          vehicle ||
          geofenceReport) && {
          component: CNavGroup,
          name: 'Report',
          visible: true, // This can be a boolean or controlled by a state.
          icon: (
            <div
              style={{ display: 'flex', alignItems: 'center', color: '#FFFFF' }}
              title="Report"
            >
              <TbReport style={{ marginRight: '15px', fontSize: '30px' }} />
            </div>
          ),
          items: [
            status && {
              component: CNavItem,
              name: 'Status Reports',
              to: '/statusreports',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TbReportAnalytics style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            distance && {
              component: CNavItem,
              name: 'Distance Reports',
              to: '/distancereports',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GiPathDistance style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            history && {
              component: CNavItem,
              name: 'History',
              to: '/history',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaHistory style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            stop && {
              component: CNavItem,
              name: 'Stops',
              to: '/stops',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BsFillSignStopFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            travel && {
              component: CNavItem,
              name: 'Travels Summary',
              to: '/travelsreport',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RiPinDistanceFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            trips && {
              component: CNavItem,
              name: 'Trips Report',
              to: '/tripsreport',

              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RiPinDistanceFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            idle && {
              component: CNavItem,
              name: 'Idle Report',
              to: '/idlereport',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaStopwatch style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            alerts && {
              component: CNavItem,
              name: 'Alerts/Events',
              to: '/alerts-events',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdEventNote style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
            geofenceReport && {
              component: CNavItem,
              name: 'Geofence Report',
              to: '/geofencereport',
              visible: true, // This can be a boolean or controlled by a state.
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
          ].filter(Boolean),
        },
        {
          component: CNavGroup,
          name: 'Supports',
          visible: true, // This can be a boolean or controlled by a state.
          icon: (
            <div
              style={{ display: 'flex', alignItems: 'center', color: '#FFFFF' }}
              title="Expense Management"
            >
              <BiSupport style={{ marginRight: '15px', fontSize: '30px' }} />
            </div>
          ),
          items: [
            {
              component: CNavItem,
              name: 'Raise Ticket',
              to: '/raise-ticket',
              icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TicketCheck style={{ marginRight: '15px', fontSize: '25px' }} />
                </div>
              ),
            },
          ],
        },
      ].filter(Boolean)),
    // {
    //   component: CNavItem,
    //   name: 'Chat Bot',
    //   to: '/chatbot',
    //   icon: (
    //     <div style={{ display: 'flex', alignItems: 'center', color: '#FFFFF' }}>
    //       <BsChatDots color="#FFFFF" style={{ marginRight: '15px', fontSize: '30px' }} />
    //     </div>
    //   ),
    // },
    // {
    //   component: CNavItem,
    //   name: 'Help & Support',
    //   to: '/h&s',
    //   icon: (
    //     <div style={{ display: 'flex', alignItems: 'center', color: '#FF7A00' }}>
    //       <BiSupport color="#FF7A00" style={{ marginRight: '15px', fontSize: '30px' }} />
    //     </div>
    //   ),
    // },
  ]
}

export default _nav
