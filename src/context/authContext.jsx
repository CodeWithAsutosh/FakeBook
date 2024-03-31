import { createContext, useEffect, useState } from "react";
import axios from "axios";
const baseURL = process.env.REACT_APP_BASE_URL;

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUserID, setCurrentUserID] = useState(
    localStorage.getItem("userId") ? localStorage.getItem("userId") : null
  );
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );

  const login = async (inputs) => {
    try {
      const res = await axios.post(`${baseURL}/users/login`, inputs);
      setCurrentUserID(res.data.data.userId);
      setCurrentUser(res.data.data.token);
      return res.data.status === true ? res.data : false;
    } catch (err) {
      if (err.response && err.response.data.status === false) {
        alert(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    if(currentUser && currentUserID){
      localStorage.setItem("userId", currentUserID);
      localStorage.setItem("token", currentUser);
    }
  }, [currentUser, currentUserID]);

  return (
    <AuthContext.Provider value={{ currentUser, currentUserID, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;