import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TUser } from "@/api/types.ts";
import React from "react";

interface IProps {
  setUser: (user: TUser) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}
const LoginPage: React.FC<IProps> = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idToken: credentialResponse.credential
        })
      });

      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem("token", token);
        setUser(user);
        setIsAuthenticated(true);
        navigate("/");
        toast({
          title: "Success",
          description: "Successfully logged in with Google"
        });
      } else {
        console.error("LoginPage failed:", await response.json());
        toast({
          title: "Error",
          description: "LoginPage failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login with Google",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Leumi Asset Platform</CardTitle>
          <CardDescription>Please sign in with your Google account to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast({
                title: "Error",
                description: "LoginPage Failed",
                variant: "destructive"
              });
            }}
            useOneTap
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
