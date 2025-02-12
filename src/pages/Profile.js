import React, { useState, useEffect } from "react";
import { getUserData} from "../api/userService";  // импортируем API запросы
import "../styles/styles.css";
import {addUserDB, getUserFromDB} from "../services/database";

const Profile = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const loadUserData = async () => {
    try {
      if (navigator.onLine) {
        const data = await getUserData(localStorage.getItem("access_token"));
        setUser({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        });

        await addUserDB({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        });
      } else {
        const userFromDB = await getUserFromDB();
        if (userFromDB) {
          setUser(userFromDB);
        } else {
          console.error("No user data found in IndexedDB.");
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
      <div className="profile-container">
        <div className="profile-info">
          <p><strong>Name:</strong> {user.first_name}</p>
          <p><strong>Last Name:</strong> {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>
      </div>
  );
};

export default Profile;
