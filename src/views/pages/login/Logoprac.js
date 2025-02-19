

// import React, { useContext, useState } from "react";
// import "./Logoprac.css";
// // import logoimg from "./images/new_logo.png";
// // import schoolbus from "./images/s";
// import schoolbus from "../../../assets/images/schoolbus-png.png"
// import parenteyelogo from "../../../assets/images/parenteyelogo.png"
// // import loginVideo from "../../public/"
// import Cookies from "js-cookie";
// import axios from "axios";
// import { Link } from "react-router-dom";
// // import { Signupp } from "./Signupp.jsx";
// import { useNavigate } from "react-router-dom";
// // import { TotalResponsesContext } from "../../../TotalResponsesContext";
// const Logoprac = () => {
//   const [username, setusername] = useState("");
//   const [password, setPassword] = useState("");
//   // const { setRole } = useContext(TotalResponsesContext);
//   const [role, setRole] = useState(0);

//   const navigate = useNavigate(); // Initialize the navigate function
//   const handleusernameChange = (e) => {
//     setusername(e.target.value);
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

  
//   const handleLoginClick = async () => {
//   const login = async (url, roleValue, successMessage) => {
//     try {
//       const response = await axios.post(url, { username, password });
//       if (response.data && response.data.token) {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("role", roleValue);
//         setRole(roleValue);
//         // navigate("/");
//         navigate('/dashboard');
//         // alert(successMessage);
//         return true;
//       }
//     } catch (error) {
//       console.error(`Login attempt to ${url} failed:`, error);
//     }
//     return false;
//   };

//   try {
//     // First, attempt login as user (role 4), then try other roles
//     if (
//       await login(
//         `${import.meta.env.VITE_SUPER_ADMIN_API}/login/branchgroupuser`,
//         4,
//         "User login successful"
//       )
//     ) return;

//     if (
//       await login(
//         `${import.meta.env.VITE_SUPER_ADMIN_API}/login`,
//         1,
//         "Super Admin login successful"
//       )
//     ) return;

//     if (
//       await login(
//         `${import.meta.env.VITE_SCHOOL_API}/login`,
//         2,
//         "School login successful"
//       )
//     ) return;

//     if (
//       await login(
//         `${import.meta.env.VITE_BRANCH_API}/login`,
//         3,
//         "Branch login successful"
//       )
//     ) return;

//     // If no role matched, show an error
//     alert("Incorrect username or password!");
//   } catch (error) {
//     console.error("There was an error logging in!", error);
//     alert("An unexpected error occurred. Please try again.");
//   }
// };
// const handleKeyPress = (e) => {
//   if (e.key === "Enter") {
//     e.preventDefault(); // Prevent the form from submitting if inside a form
//     handleLoginClick();
//   }
// };

 
  
//   return (
//     <div className="login-fix">
      
//       <video autoPlay muted loop style={{ width: '50%' }} className="overflow-hidden">
//   <source src="school.mp4" type="video/mp4" />
//   Your browser does not support the video tag.
// </video>

    
//       <div className="white-back">
//         <div>
//         <img src={schoolbus} alt="" style={{width:"154px"}} />
//         </div>
//     <div className="login-form">
      

//       <form>
//         <div className="login-heading">
//           {/* <h3>Login With username ID</h3> */}
//           <img src={parenteyelogo} alt="" style={{width:"200px"}} />
//           <h6 style={{paddingTop:"8px"}}>School Bus Tracking Solutions</h6>
//         </div>

//         <div data-mdb-input-init className="form-outline mb-4 setinput">
//           <input
//             type="username"
//             id="form2Example1"
//             className="form-control"
//             placeholder="Enter Your username"
//             value={username}
//             autoComplete="username"
//             onChange={handleusernameChange}
//             onKeyDown={handleKeyPress}
//           />
//         </div>

//         <div data-mdb-input-init className="form-outline mb-4 setinput">
//           <input
//             type="password"
//             id="form2Example2"
//             className="form-control"
//             placeholder="password"
//             value={password}
//             autoComplete="current-password"
//             onChange={handlePasswordChange}
//             onKeyDown={handleKeyPress}
//           />
//         </div>

//         <div className="nedd-sign">
//           <div>
//             <a style={{color:"#FD8B37"}} href="https://hbgadget.in/">Need Help ?</a>
//           </div>
//           <div className="button-col">
//             <button
//               type="button"
//               data-mdb-button-init
//               data-mdb-ripple-init
//               className="btn btn-primary btn-block mb-4"
//               onClick={handleLoginClick}
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   </div>
//     </div>
//   );
// };
// export default Logoprac;
//--------------------------------------old login of parent eye -------------------------------------
import React, { useState } from "react";
import "./Logoprac.css";
import schoolbus from "../../../assets/images/schoolbus-png.png";
import parenteyelogo from "../../../assets/images/parenteyelogo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logoprac = () => {
  const [credentials, setCredentials] = useState({ username: 'hbtrack', password: '123456@' })
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);
  const navigate = useNavigate();

  const handleusernameChange = (e) => {
    setusername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLoginClick();
    }
  };

  const handleLoginClick = async () => {
    // Multi‑role login function (tries several endpoints)
    const login = async (url, roleValue, successMessage) => {
      try {
        const response = await axios.post(url, { username, password });
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", roleValue);
          setRole(roleValue);
          console.log(successMessage);
          return true;
        }
      } catch (error) {
        console.error(`Login attempt to ${url} failed:`, error);
      }
      return false;
    };

    // Try the different login endpoints one by one
    let loginSuccess = false;
    if (
      await login(
        `${import.meta.env.VITE_SUPER_ADMIN_API}/login/branchgroupuser`,
        4,
        "User login successful"
      )
    ) {
      loginSuccess = true;
    } else if (
      await login(
        `${import.meta.env.VITE_SUPER_ADMIN_API}/login`,
        1,
        "Super Admin login successful"
      )
    ) {
      loginSuccess = true;
    } else if (
      await login(
        `${import.meta.env.VITE_SCHOOL_API}/login`,
        2,
        "School login successful"
      )
    ) {
      loginSuccess = true;
    } else if (
      await login(
        `${import.meta.env.VITE_BRANCH_API}/login`,
        3,
        "Branch login successful"
      )
    ) {
      loginSuccess = true;
    }

    if (loginSuccess) {
      // Now perform the hard login to set cookies
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`;
        const response = await axios.post(apiUrl, credentials);
        if (response.data?.token) {
          const { token } = response.data;
          // Configure cookie options (secure for HTTPS)
          const cookieOptions = {
            secure: window.location.protocol === "https:",
          };
          // Save credentials and token as cookies
          Cookies.set("crdntl", JSON.stringify({ username, password }), cookieOptions);
          Cookies.set("authToken", token, cookieOptions);
        }
      } catch (error) {
        console.error("Hard login failed:", error);
      }
      navigate("/dashboard");
    } else {
      alert("Incorrect username or password!");
    }
  };

  return (
    <div className="login-fix">
      <video autoPlay muted loop style={{ width: "50%" }} className="overflow-hidden">
        <source src="school.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="white-back">
        <div>
          <img src={schoolbus} alt="" style={{ width: "154px" }} />
        </div>
        <div className="login-form">
          <form>
            <div className="login-heading">
              <img src={parenteyelogo} alt="" style={{ width: "200px" }} />
              <h6 style={{ paddingTop: "8px" }}>School Bus Tracking Solutions</h6>
            </div>

            <div data-mdb-input-init className="form-outline mb-4 setinput">
              <input
                type="username"
                id="form2Example1"
                className="form-control"
                placeholder="Enter Your username"
                value={username}
                autoComplete="username"
                onChange={handleusernameChange}
                onKeyDown={handleKeyPress}
              />
            </div>

            <div data-mdb-input-init className="form-outline mb-4 setinput">
              <input
                type="password"
                id="form2Example2"
                className="form-control"
                placeholder="password"
                value={password}
                autoComplete="current-password"
                onChange={handlePasswordChange}
                onKeyDown={handleKeyPress}
              />
            </div>

            <div className="nedd-sign">
              <div>
                <a style={{ color: "#FD8B37" }} href="https://hbgadget.in/">
                  Need Help ?
                </a>
              </div>
              <div className="button-col">
                <button
                  type="button"
                  className="btn btn-primary btn-block mb-4"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Logoprac;


