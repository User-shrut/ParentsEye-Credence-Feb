// import React, { createContext, useState } from 'react';

// export const TotalResponsesContext = createContext();

// export const TotalResponsesProvider = ({ children }) => {
//   const [totalResponses, setTotalResponses] = useState(0);

//   return (
//     <TotalResponsesContext.Provider value={{ totalResponses, setTotalResponses }}>
//       {children}
//     </TotalResponsesContext.Provider>
//   );
// };


import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
export const TotalResponsesContext = createContext();

export const TotalResponsesProvider = ({ children }) => {
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalLeaveRequest, settotalLeaveRequest] = useState(0); // Add this line
 const [TotalResponsesPresent,setTotalResponsesPresent]=useState(0);
 const [Drivers,setDrivers]=useState(0);
 const[TotalResponsesStudent,setTotalResponsesStudent]=useState(0);
//  supervisorsdata
const [allDevices, setAllDevices] = useState([]);
const [TotalResponsesSupervisor,setTotalResponsesSupervisor]=useState(0);
//  const[supervisorsdata,setsupervisorsdata]=useState(0);
//  setTotalResponsesLeave
 const [TotalResponsesDrivers,setTotalResponsesDrivers]=useState(0);
 const [TotalResponsesAbsent,setTotalResponsesAbsent]=useState(0);
 const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null,name:null });
const [role , setRole] = useState(0);
const [selectedVehicle, setSelectedVehicle] = useState({deviceId: null, name: null,latitude: null, longitude: null}); 
  const role1 = localStorage.getItem("role");
  const [loading, setLoading] = useState(true); // Add a loading state
  const token = localStorage.getItem("token");
  const fetchDataTotalStudent = async (startDate = "", endDate = "") => {
    
    try {
      let response;
      const token = localStorage.getItem("token");

  // If token doesn't exist, stop further execution and log a message
      if (!token) {
        console.log("No token found. Cannot fetch context data.");
        return; // Exit the function or handle accordingly
  }
      if (role1 == 1) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${import.meta.env.VITE_SUPER_ADMIN_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 2) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${import.meta.env.VITE_SCHOOL_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 3) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${import.meta.env.VITE_BRANCH_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if(role1==4){
        const token=localStorage.getItem("token");
        response=await axios.get(`${import.meta.env.VITE_USERBRANCH}/read-children`,
          {
            headers:{
              Authorization:`Bearer ${token}`
            },
          }
        )
      }
      console.log("my role is :",role1);
      console.log("fetch data", response.data); // Log the entire response data
      // fetchgeofencepoint();
      if (response?.data) {
        const allData =
          role1 == 1
            ? response.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.children) && branch.children.length > 0
                    ? branch.children.map((child) => ({
                        ...child, // Spread child object to retain all existing properties
                        schoolName: school.schoolName,
                        branchName: branch.branchName,
                      }))
                    : []
                )
              )
              :role1==4
              ?response.data.updatedChildData.map((school)=>
              ({
                ...school,
                
              })
              )
            : role1 == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.children) && branch.children.length > 0
                  ? branch.children
                  : []
              )
            : response?.data.data;

        console.log(allData);

        
        setTotalResponsesStudent(allData.length);
        // Log the date range and filtered data
      
      
      } else {
        console.error("Expected an array but got:", response.data.children);
      }
    } catch (error) {
      console.error("Error:", error);
    } 
  };
 
  const fetchpresent = async (startDate = "", endDate = "") => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl =
        role1 == 1
          ? `${import.meta.env.VITE_SUPER_ADMIN_API}/present-children`
          : role1 == 2
          ? `${import.meta.env.VITE_SCHOOL_API}/present-children`
          : role1==3
          ? `${import.meta.env.VITE_BRANCH_API}/present-children`
          :`${import.meta.env.VITE_USERBRANCH}/presentchildrenByBranchgroup`
          
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("fetch data", response.data);
  
      let allData = [];
  
      if (role1 == 1 ) {
        // Handle for role 1 and role 2
        allData = response?.data.data.flatMap((school) =>
          school.branches.flatMap((branch) =>
            Array.isArray(branch.children) && branch.children.length > 0
              ? branch.children
              : []
          )
        );
      }else if (role1 == 2) {
        // Handle for role 2 (this is your specified data structure)
        allData = response?.data.branches.flatMap((branch) =>
          Array.isArray(branch.children) && branch.children.length > 0
            ? branch.children.map(child => ({
                ...child,
                branchName: branch.branchName,  // Assign branchName to child data
                schoolName: response.data.schoolName,  // Assign schoolName to child data
              }))
            : []
        );
      }  else if (role1 == 3) {
        // Handle for role 3
        allData = Array.isArray(response.data.children) ? response.data.children : [];
      }else if(role1==4){
        allData=response.data.branches.flatMap((item)=>
        Array.isArray(item.children)&&item.children.length>0?
        item.children.map((present)=>(
          {
            ...present
          }
        ))
        :[]
        )
      }
  
      // Apply local date filtering if dates are provided
     
  
      // Log the date range and filtered data
     
      setTotalResponsesPresent(allData.length);
    } catch (error) {
      console.error("Error:", error);
    } 
  };


  const fetchDataDrivers = async (startDate = "", endDate = "") => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;
      if (role1 == 1) {
        response = await axios.get(
          `${import.meta.env.VITE_SUPER_ADMIN_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 2) {
        response = await axios.get(
          `${import.meta.env.VITE_SCHOOL_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 3) {
        response = await axios.get(
          `${import.meta.env.VITE_BRANCH_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if (role1 == 4) {
        response = await axios.get(
          `${import.meta.env.VITE_USERBRANCH}/getdriverdata`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data);

      if (response?.data) {
        console.log(response.data);
        const allData =
          role1 == 1
            ? response?.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.drivers) && branch.drivers.length > 0
                    ? branch.drivers
                    : []
                )
              )
            : role1 == 2
            ? response?.data.branches.flatMap((branch) => branch.drivers)
            : response?.data.drivers;

       

        setTotalResponsesDrivers(allData.length);
       
      } else {
        console.error("Expected an array but got:", response.data.drivers);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDataAbsent = async (startDate = "", endDate = "") => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl =
        role1 == 1
          ? `${import.meta.env.VITE_SUPER_ADMIN_API}/absent-children`
          : role1 == 2
          ? `${import.meta.env.VITE_SCHOOL_API}/absent-children`
          :role==3
          ? `${import.meta.env.VITE_BRANCH_API}/absent-children`// for role == 3
          :`${import.meta.env.VITE_USERBRANCH}/absentchildrenByBranchgroup`
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("fetch data", response.data);
  
      let allData = [];
  
      if (role1 == 1 ) {
        // Handle for role 1 and role 2
        allData = response?.data.data.flatMap((school) =>
          school.branches.flatMap((branch) =>
            Array.isArray(branch.children) && branch.children.length > 0
              ? branch.children.map(child => ({
                  ...child,
                  branchName: branch.branchName,  // Assign branchName to child data
                  schoolName: school.schoolName,  // Assign schoolName to child data
                }))
              : []
          )
        );
      }else if (role1 == 2) {
        // Handle for role 2 (this is your specified data structure)
        allData = response?.data.branches.flatMap((branch) =>
          Array.isArray(branch.children) && branch.children.length > 0
            ? branch.children.map(child => ({
                ...child,
                branchName: branch.branchName,  // Assign branchName to child data
                schoolName: response.data.schoolName,  // Assign schoolName to child data
              }))
            : []
        );
      }  else if (role1 == 3) {
        // Handle for role 3 where data is in children array
        allData = Array.isArray(response.data.children) ? response.data.children : [];
      }else if(role1==4){
        allData=response.data.branches.flatMap((item)=>
        Array.isArray(item.children)&&item.children.length>0?
        item.children.map((absent)=>({
          ...absent
        }))
        :[]
        )
      }
  
    
      
      setTotalResponsesAbsent(allData.length);
    } catch (error) {
      console.error("Error:", error);
    } 
  };
  const fetchleaves = async (startDate = "", endDate = "") => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;
  
      if (role1 == 1) {
        response = await axios.get(
          `${import.meta.env.VITE_SUPER_ADMIN_API}/pending-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 2) {
        response = await axios.get(
          `${import.meta.env.VITE_SCHOOL_API}/pending-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 3) {
        response = await axios.get(
          `${import.meta.env.VITE_BRANCH_API}/pending-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if (role1 == 4) {
        response = await axios.get(
          `${import.meta.env.VITE_USERBRANCH}/pendingrequests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
  
      
  
      if (response.data) {
        // Parse the data differently for each role
        const allData =
          role1 == 1
            ? response?.data?.data?.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.requests) && branch.requests.length > 0
                    ? branch.requests
                    : []
                )
              )
            : role1 == 2
            ? response?.data?.branches.flatMap((branch) =>
                Array.isArray(branch.requests) && branch.requests.length > 0
                  ? branch.requests
                  : []
              )
              :role1==4
              ? response?.data?.data?.flatMap((branch) =>
                Array.isArray(branch.requests) ? branch.requests : []
              )
            : role1 == 3
            ? Array.isArray(response.data.requests) && response.data.requests.length > 0
              ? response.data.requests
              : []
            : [];
  
       
  
        // Apply local date filtering if dates are provided
      
        
        settotalLeaveRequest(allData.length);
      } else {
        console.error("Expected an array but got:", response.data.children);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

 
  const fetchDataSupervisor = async (startDate = "", endDate = "") => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;

      if (role1 == 1) {
        response = await axios.get(
          `${import.meta.env.VITE_SUPER_ADMIN_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 2) {
        response = await axios.get(
          `${import.meta.env.VITE_SCHOOL_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 3) {
        response = await axios.get(
          `${import.meta.env.VITE_BRANCH_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else if (role1 == 4) {
        response = await axios.get(
          `${import.meta.env.VITE_USERBRANCH}/readSuperviserBybranchgroupuser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data); // Log the entire response data

      if (response?.data) {
        const allData =
          role1 == 1
            ? response?.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.supervisors) &&
                  branch.supervisors.length > 0
                    ? branch.supervisors
                    : []
                )
              )
            : role1 == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.supervisors) &&
                branch.supervisors.length > 0
                  ? branch.supervisors
                  : []
              )
            : response.data.supervisors;

        console.log("supervisirs", allData);
      
        setTotalResponsesSupervisor(allData.length);
      } else {
        console.error("Expected an array but got:", response.data.supervisors);
      }
    } catch (error) {
      console.error("Error:", error);
    } 
  };
  const fetchDataDriver = async (startDate = "", endDate = "") => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;
      if (role1 == 1) {
        response = await axios.get(
          `${import.meta.env.VITE_SUPER_ADMIN_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 2) {
        response = await axios.get(
          `${import.meta.env.VITE_SCHOOL_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role1 == 3) {
        response = await axios.get(
          `${import.meta.env.VITE_BRANCH_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data);

      if (response?.data) {
        console.log(response.data);
        const allData =
          role1 == 1
            ? response?.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.drivers) && branch.drivers.length > 0
                    ? branch.drivers
                    : []
                )
              )
            : role1 == 2
            ? response?.data.branches.flatMap((branch) => branch.drivers)
            : response?.data.drivers;

        setDrivers(allData.length);
      
      } else {
        console.error("Expected an array but got:", response.data.drivers);
      }
    } catch (error) {
      console.error("Error:", error);
    } 
  };
  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl =
        role1 == 1
          ? `${import.meta.env.VITE_SUPER_ADMIN_API}/read-devices`
          : role1 == 2
          ? `${import.meta.env.VITE_SCHOOL_API}/read-devices`
          :role1==3
          ?`${import.meta.env.VITE_BRANCH_API}/read-devices`
          
          :`${import.meta.env.VITE_USERBRANCH}/getdevicebranchgroupuser`
  
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      let allData = [];
      if (role1 == 1) {
        allData = response?.data.data.flatMap((school) =>
          school.branches.flatMap((branch) =>
            Array.isArray(branch.devices) && branch.devices.length > 0
              ? branch.devices.map((device) => ({
                  ...device,
                  schoolName: school.schoolName,
                  branchName: branch.branchName,
                }))
              : []
          )
        );
      } else if (role1 == 2) {
        allData = response?.data.branches.flatMap((branch) =>
          Array.isArray(branch.devices) && branch.devices.length > 0
            ? branch.devices.map((device) => ({
                ...device,
                branchName: branch.branchName,
                schoolName: response.data.schoolName,
              }))
            : []
        );
      } else if (role1 == 3) {
        const branchName = response.data.branchName;
        const schoolName = response.data.schoolName;
  
        allData = Array.isArray(response.data.devices)
          ? response.data.devices.map((device) => ({
              ...device,
              branchName,
              schoolName,
            }))
          : [];
      }else if(role1==4){
        allData=response?.data?.data?.flatMap((school) =>
          school?.branches?.flatMap((branch) =>
            Array.isArray(branch.devices) && branch.devices.length > 0
              ? branch.devices.map((device) => ({
                  ...device,
                  branchName: branch.branchName,
                  schoolName: school.schoolName,
                }))
              : []
          )
        )
      }
  
      setAllDevices(allData.length); // Store all devices
      // setBuses(allData); // Set initial buses as well
      console.log("filter devices according to branch",allData)
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    

  // // If token doesn't exist, stop further execution and log a message
  //     if (!token) {
  //       console.log("No token found. Cannot fetch context data.");
  //       return; // Exit the function or handle accordingly
  // }
  
      
  
    setLoading(true);
    if(token){
 // Run all fetch functions in parallel using Promise.all
 const fetchData = async () => {
  const token = localStorage.getItem('token');
  
  try {
    setLoading(true); // Set loading state to true
    await Promise.all([
      fetchDataTotalStudent(),
      fetchDataDrivers(),
      fetchDataAbsent(),
      fetchDataSupervisor(),
      fetchBuses(),
      fetchleaves(),
      fetchpresent(),
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false); // Set loading state to false once all data is fetched
  }
};

fetchData(); // Call the function to fetch data on mount
    }else{
      
    }
   
  
    // fetchData();
    /* fetchleaves();
    fetchpresent();
    fetchDataAbsent();
    fetchDataDrivers();
    fetchDataSupervisor();
    fetchDataTotalStudent();
    fetchBuses(); */
  }, [token]);
  // if (loading) {
  //   return <div>Loading...</div>; // Show a loading indicator until data is fetched
  // }
  return (
    <TotalResponsesContext.Provider value={{ totalResponses,allDevices,  selectedVehicle, setSelectedVehicle,setAllDevices,TotalResponsesSupervisor,setTotalResponsesSupervisor,TotalResponsesStudent,setTotalResponsesStudent, setTotalResponses, totalLeaveRequest, settotalLeaveRequest ,TotalResponsesDrivers,setTotalResponsesDrivers,Drivers,setDrivers,TotalResponsesAbsent,setTotalResponsesAbsent,role , setRole,TotalResponsesPresent,setTotalResponsesPresent, coordinates,       // Provide the coordinates state
      setCoordinates,loading,setLoading}}>
      {children}
      {/* {loading ? null: children} Show loading state while fetching data */}
      
    </TotalResponsesContext.Provider>
  );
};

// export default TotalResponsesProvider;