import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import UserInterface from "@/interfaces/UserInterface";

interface UserContextType {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_USER_DATA}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          
          setUser(res.data.userFound);
        })
        .catch((err) => {
          console.error("Erro ao carregar usuário:", err);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
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
