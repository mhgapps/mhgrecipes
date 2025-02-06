"use client";

import { useEffect } from "react";
import awsconfig from "../aws-exports";
import { Amplify } from "@aws-amplify/core";

export default function AmplifyConfig() {
  useEffect(() => {
    // Configure Amplify using your aws-exports config.
    Amplify.configure(awsconfig);
    // Set the global instance for client components.
    if (typeof window !== "undefined") {
      (window as any).AmplifyInstance = Amplify;
      console.log("Amplify configured:", Amplify);
    }
  }, []);

  return null;
}
