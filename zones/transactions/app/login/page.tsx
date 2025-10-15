"use client";
import { useEffect } from "react";

export default function TransactionsLoginRedirect() {
  useEffect(() => {
    window.location.replace("/login");
  }, []);
  return null;
}