"use client";

import { useEffect } from "react";
import * as Amplify from "aws-amplify";
import awsconfig from "../aws-exports"; // Adjust the path if necessary

export default function AmplifyConfig() {
  useEffect(() => {
    Amplify.configure(awsconfig);
  }, []);

  return null;
}
