import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './loginprompt.css';
import "./loginprompt.js";
import './home.css';
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate, Link } from "react-router-dom";
//import DisplayPatientData from './DisplayPatientData';
import DisplayStudyData from './AdminDisplayStudyData';
import './DoctorView.css';
import ContractsButton from './ContractsButton';
import Sidebar from './Sidebar';
import NotificationContext from './NotificationContext';
import ValidateDomain from "./validation";
import NavigationBar from './NavigationBar';

function FDAView() {

// for notification system
const { notifications } = useContext(NotificationContext);
const [showNotifications, setShowNotifications] = useState(false);

const handleNotificationClick = () => {
  setShowNotifications(!showNotifications);
  const notificationCircle = document.querySelector('.notification-circle');
  if (showNotifications) {
    notificationCircle.classList.remove('clicked');
  } else {
    notificationCircle.classList.add('clicked');
  }
};

const handlePopupClick = () => {
  setShowNotifications(false);
};

// end of notification stuff

  const location = useLocation();
  const [user, setUser] = useState(location.state);
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const patientId = '0186b496-32f6-9a7f-cdfe-1e37ab416338';
  const [searchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  if (user?.email == null) {
    
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
    const user= {
      email: userAuth?.email,
      role: userAuth?.displayName,
      id: userAuth?.uid
    }
    if (userAuth) {
      console.log(userAuth)
      setUser(user)
    } else {
      setUser(null)
    }
      
    if (user.role != "fda") {
      navigate("/Login");
    }

    })
    return unsubscribe
  };
  const FDAHomePage = () => {
    navigate("/View", { state: { user } });
  };

  return (
    <div className='fdaview'> 

      <NavigationBar isFDAView={true} user={user}/>

      <div className='doctorNavButtonLocations'>
          <div className="welcomeBro" style={{borderColor: '#08d3b4'}}>
            <button className='welcomeContainer' onClick={() => FDAHomePage(user)} style={{color: 'black'}}>Welcome Page</button>
          </div>

          <div className='addPatientBro' style={{borderColor: '#08d3b4'}}>
            <button className='welcomeContainer' onClick={togglePopup} style={{color: 'black'}}>Manage Contracts</button>
          </div>
      </div>

      <Sidebar></Sidebar>

      <div>
          <button className='notification-circle' onClick={handleNotificationClick}>
            <div class="notification-circle-icon"></div>
            <div class="notification-number">{notifications.length}</div>
          </button>
            
          {showNotifications && (
            <div className="notification-popup" onClick={handlePopupClick}>
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  {notification.message}
                </div>
              ))}
            </div>
          )}
        </div>

      <div className='patientTableLocation' style={{top: '300px'}}>
        <DisplayStudyData nameSearch={""} statusSearch={""} startSearch={""} isFDAView={true}/>
      </div>
      {isOpen && <ContractsButton handleClose={togglePopup}/>}
    </div>
  );
}

export default FDAView;