import LoginBG from "@/assets/login-bg.png";
import { loginEmailState, loginPasswordState } from "@/atoms";
import { Button } from "@/components/ui/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import { Input } from "@/components/ui/base/input";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export default function LoginForm() {
  const [email, setEmail] = useRecoilState(loginEmailState);
  const [password, setPassword] = useRecoilState(loginPasswordState);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onSubmit = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${LoginBG})`, backgroundSize: "cover" }}
    >
      <Card className="mx-auto max-w-sm p-4 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>
            Managing all inspection manual report in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              {/* <Label htmlFor="email">Email</Label> */}
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              {/* <Label htmlFor="password">Password</Label> */}
              <Input
                id="password"
                type="password"
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
