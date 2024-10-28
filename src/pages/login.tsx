"use client";

import { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import { loginEmailState, loginPasswordState } from "@/atoms";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import LoginBG from "@/assets/login-bg.png";
import Logo from "@/assets/rmb-logo.png";
import { Input } from "@/components/ui/base/input";

export default function EnhancedLoginForm() {
  const [email, setEmail] = useRecoilState(loginEmailState);
  const [password, setPassword] = useRecoilState(loginPasswordState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { login, verifyOTP } = useAuth();

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success("OTP sent to your email");
      setShowOtpForm(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await verifyOTP(email, password, Number(otp));
    } catch (error) {
      toast.error("2 "+getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
      }}
    >
      <div className="relative w-full max-w-sm overflow-hidden">
        <Card
          className={`p-4 rounded-xl transition-transform duration-300 ease-in-out ${
            showOtpForm ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <CardHeader className="text-center">
            <img src={Logo} alt="Logo" className="h-20 w-auto mx-auto" />
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Managing all inspection manual report in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailPasswordSubmit} className="grid gap-4">
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="password"
                type="password"
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card
          className={`p-4 rounded-xl absolute top-0 left-full w-full transition-transform duration-300 ease-in-out ${
            showOtpForm ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <CardHeader className="text-center">
            <img src={Logo} alt="Logo" className="h-20 w-auto mx-auto" />
            <CardTitle className="text-xl">Enter OTP</CardTitle>
            <CardDescription>
              Please enter the OTP sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpSubmit} className="grid gap-4">
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOtp(e.target.value)
                }
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowOtpForm(false)}
                disabled={loading}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
