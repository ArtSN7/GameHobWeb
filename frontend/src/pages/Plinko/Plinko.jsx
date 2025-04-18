// https://grok.com/share/bGVnYWN5_034be7fd-4a17-424f-bd77-60e8b5d58f3a


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import {Game} from "./Components/pages/Game"

export default function Plinko(){

  const { user, profile, balance, isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
  }, [isAuthenticated]);

  return(
    <Game />
  )
}