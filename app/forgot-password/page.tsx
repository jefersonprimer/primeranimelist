import { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a verification code to reset your password.",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <ForgotPasswordClient />
    </div>
  );
}
