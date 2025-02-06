"use client";

import { useEffect } from "react";
import awsconfig from "../aws-exports";
import { Amplify } from "@aws-amplify/core";
import API from "@aws-amplify/api";

export default function AmplifyConfig() {
  useEffect(() => {
    Amplify.configure(awsconfig);
    console.log("Amplify configured:", Amplify);
  }, []);

  return null;
}
