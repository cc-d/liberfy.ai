import React, { createContext, useContext, useEffect, useState } from "react";
import apios from "./apios";
import { useNavigate } from "react-router-dom";
import {
  BaseMsg, Token,
  DataCreateChat, DataCreateComp, DataMsgAdd,
  DBComp, DBMsg, DBChat, DBUserWithToken, DBUser
} from "./api";

interface AuthContextProps {
  user: DBUser | null;
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
  isLoading: boolean;
  login: (data: jwtLoginData) => Promise<void>;
  register: (data: jwtLoginData) => Promise<void>;
  logout: () => void;
  autoTokenLogin: () => Promise<void>;
}

export interface jwtLoginData {
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toDBUser = (userWithToken: DBUserWithToken): DBUser => {
    const { token, ...userWithoutToken } = userWithToken;
    return userWithoutToken;
  };




  const login = async (data: jwtLoginData) => {
    setIsLoading(true);
    try {
      const resp = await apios.post("/user/login", {username: data.username, password: data.password});
      if (resp) {
        const tokUser: DBUserWithToken = resp.data;
        console.log(tokUser, 'tokUser')
        localStorage.setItem("token", tokUser.token.access_token);
        console.log(toDBUser(tokUser));
        setUser(tokUser);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: jwtLoginData) => {
    setIsLoading(true);
    try {
      const resp = await apios.post("/user/register", {username: data.username, password: data.password});
      if (resp) {
        const tokUser: DBUserWithToken = resp.data;
        localStorage.setItem("token", tokUser.token.access_token);
        setUser(toDBUser(tokUser));
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const autoTokenLogin = async () => {
    const locToken: string | null = localStorage.getItem("token");
    if (locToken && !user && !isLoading) {
      setIsLoading(true);
      try {
        const resp = await apios.post("/user_from_token", {token: locToken});
        if (resp) {
          const tokUser: DBUserWithToken = resp.data;
          setUser(toDBUser(tokUser));
        }
      } catch (error) {
        console.error("Auto login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    autoTokenLogin();
  }, []); // Add auto login on mount

  return (
    <AuthContext.Provider
      value={{ setUser, user, isLoading, login, register, logout, autoTokenLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
