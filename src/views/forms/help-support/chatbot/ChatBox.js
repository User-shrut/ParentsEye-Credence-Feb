import { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import { jwtDecode } from "jwt-decode";

import Cookies from 'js-cookie';
import io from "socket.io-client";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 
import avatarImg from '../images/emptyimage.jpg';

const socket = io(import.meta.env.LOCAL_API);

const ChatBox = () => {
  const accessToken = Cookies.get('token');
  if (!accessToken) {
    throw new Error('Token is missing');
  }

  const decodedToken = jwtDecode(accessToken);

  const userName = decodedToken.username;
  const chatusername = decodedToken.chatusername;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const[preMessage, setPreMessage] = useState(null);

  const [roomId, setRoomId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [chatAdmin, setchatAdmin] = useState(null);
  const [selectedUser, setNameofSelectedUser] = useState(null);
  const [selectedUserImg, setNameofSelectedUserImg] = useState(null);


const [loadingPreMessage, setLoadingPreMessage] = useState(true);
const [loadingChatUser, setLoadingChatUser] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userName && (selectedUsername || chatAdmin)) {
      const room = generateRoomId(userName, selectedUsername || chatAdmin);
      setRoomId(room);

      socket.emit("joinRoom", {
        room,
        username: userName
      });
    }
  }, [userName, chatAdmin, selectedUsername]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  const generateRoomId = (user1, user2) => {
    return [user1, user2].sort().join("_");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToBottomafterPreMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { room: roomId, message, sender: userName, receiver: chatAdmin || selectedUsername });
      setMessage(""); // Clear the input
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 
  useEffect(() => {
    scrollToBottomafterPreMessage();
  }, [preMessage]); 

  // console.log("dddddddddjjjjjjjjjjjjjjjjj",data)


  const fetchData = async () => {
    const accessToken = Cookies.get('token');
    const url = `http://localhost:4000/api/chatboxuser`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      setLoading(false);
      console.log("dddddddddjjjjjjjjjjjjjjjjj",response)
      setData(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error;
    }finally {
      setLoadingChatUser(false);
    }
  };


    
  const fetchPreMessage = async () => {
    const accessToken = Cookies.get('token');
    const url = `${import.meta.env.LOCAL_API}/api/userprechatmessage/${roomId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      setLoading(false);
      setPreMessage(response.data.data);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      throw error;
    }finally {
      setLoadingPreMessage(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setLoadingChatUser(true);
    fetchData();
  }, []);


  useEffect(() => {
    if (roomId) {
      setLoading(true);
      setLoadingPreMessage(true);
      fetchPreMessage();
    setMessages([]);

    }
  }, [userName, roomId]); 
  
  const handleSalesmanClick = (username,name,Img) => {
    setSelectedUsername(username);
    setNameofSelectedUser(name);
    setNameofSelectedUserImg(Img);

    // setMessages([]);

  };

  const handleAdminClick = (username) => {
    setSelectedUsername(null);
    setNameofSelectedUser(null);
    setNameofSelectedUserImg(null);
    setchatAdmin(username);
    setNameofSelectedUserImg();
    setMessages([]);
  };


  return (
    <>
      <div className="container fs-5">
        <div className="row">
          <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
            <div className="p-3">
              <div className="input-group rounded mb-3">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <span className="input-group-text border-0" id="search-addon">
                  search
                </span>
              </div>
              <div
                data-mdb-perfect-scrollbar-init
                className="overflow-y-scroll"
                style={{ height: "70vh" }}
              >
                <div>
                  <a
                    href="#!"
                    className="d-flex justify-content-between text-decoration-none"
                  >
                    <div className="d-flex flex-row">
                      <div>
                        <img
                          src={avatarImg}
                          alt="avatar"
                          className="d-flex align-self-center me-3 rounded-circle"
                          width={60}
                        />
                        <span className="badge bg-success badge-dot" />
                      </div>
                      <div className="pt-1">
                        <p
                          className="fw-bold mb-0 mt-2"
                          onClick={() => handleAdminClick(chatusername)}
                        >
                          Admin
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
                 {/* Show Skeleton if PreMessage is Loading */}
                 {loadingChatUser &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} style={{ padding: "10px", maxWidth: "60%" }}>
                        <Skeleton height={40} width="100%" />
                      </div>
                    ))
                  }
  
                {!loadingChatUser && data?.map((user) => (
                  <ul className="list-unstyled mb-0" key={user.id}>
                    <li
                      onClick={() =>
                        handleSalesmanClick(
                          user.username,
                          user.companyName ||
                            user.branchName ||
                            user.supervisorName ||
                            user.salesmanName ,user.profileImage
                        )
                      }
                      className="p-2 border-bottom"
                    >
                      <a
                        href="#!"
                        className="d-flex justify-content-between text-decoration-none"
                      >
                        <div className="d-flex flex-row">
                          <div>
                            <img
                               src={user.profileImage ? `data:image/png;base64,${user.profileImage}` : avatarImg}
                              alt="avatar"
                              className="d-flex align-self-center me-3 rounded-circle"
                              width={50}
                            />
                            <span className="badge bg-success badge-dot" />
                          </div>
                          <div className="pt-1">
                            <p className="fw-bold mb-0">
                              {user.companyName ||
                                user.branchName ||
                                user.supervisorName ||
                                user.salesmanName}
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
  
          <div
            className="col-md-6 col-lg-7 col-xl-8"
            style={{ height: "80vh" }} // Parent container with fixed height
          >
            {(selectedUsername || chatAdmin) && (
              <div className="d-flex flex-column h-100">
                {/* Chat header */}
                <div className="d-flex flex-row bg-body-tertiary p-3">
                  <img
                    src={selectedUserImg ? `data:image/png;base64,${selectedUserImg}` : avatarImg}
                    className="d-flex align-self-center me-3 rounded-circle"
                    alt="avatar"
                    style={{ width: 45, height: "100%" }}
                  />
                  <div>
                    <p className="fw-bold p-2 ms-3 mb-1">
                      {selectedUser || "Admin"}
                    </p>
                  </div>
                </div>
  
                {/* Messages container */}
                <div className="flex-grow-1 overflow-auto">
                   {/* Show Skeleton if PreMessage is Loading */}
                  {loadingPreMessage &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} style={{ padding: "10px", maxWidth: "60%" }}>
                        <Skeleton height={40} width="100%" />
                      </div>
                    ))
                  }
                  {/* Render previous messages first */}
                  {!loadingPreMessage && preMessage?.map((msg, index) => (
                    <div
                      key={`pre-${index}`}
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.sender === userName ? "flex-end" : "flex-start",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            msg.sender === userName ? "#007bff" : "#ccc",
                          color: msg.sender === "me" ? "white" : "black",
                          padding: "10px",
                          borderRadius: "10px",
                          maxWidth: "60%",
                          margin: "5px 0",
                          textAlign: "left",
                        }}
                      >
                        {msg.Message }
                        <br />
                        <div className="d-flex justify-content-between gap-3">
                          {/* Optionally, add sender or timestamp */}
                        </div>
                      </div>
                      </div>
                  ))}

                  {/* Then render real-time messages */}
                  {messages.map((msg, index) => (
                    <div
                      key={`msg-${index}`}
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.sender === userName ? "flex-end" : "flex-start",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            msg.sender === userName ? "#007bff" : "#ccc",
                          color: msg.sender === "me" ? "white" : "black",
                          padding: "10px",
                          borderRadius: "10px",
                          maxWidth: "60%",
                          margin: "5px 0",
                          textAlign: "left",
                        }}
                      >
                        {msg.message}
                        <br />
                        <div className="d-flex justify-content-between gap-3">
                          {/* Optionally, add sender or timestamp */}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} /> {/* Scroll ref */}
                </div>
  
                {/* Input area (always at the bottom) */}
                <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control form-control-lg ms-2"
                    id="exampleFormControlInput2"
                    placeholder="Type message"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="form-control w-auto form-control-lg ms-2"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
  

}

export default ChatBox

