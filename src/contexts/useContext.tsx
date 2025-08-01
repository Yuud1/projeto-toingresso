import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import UserInterface from "@/interfaces/UserInterface";

interface UserContextType {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  isLoading: boolean;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async () => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_USER_DATA}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.userFound) {
          setUser(response.data.userFound);
        } else {
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  const refreshUser = () => {
    loadUserData();
  };

  // Listener para mudanças no localStorage
  useEffect(() => {
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        loadUserData();
      }
    };

    // Listener para mudanças em outras abas
    window.addEventListener("storage", handleStorageChange);

    // Listener para mudanças na mesma aba (custom event)
    const handleTokenChange = () => {
      loadUserData();
    };

    window.addEventListener("tokenChanged", handleTokenChange);

    // Carregar dados iniciais
    loadUserData();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
