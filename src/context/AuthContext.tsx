import {
  getUser,
  signInRequest,
  signUpRequest,
  logOut as exit,
} from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { RequestContext } from "./RequestContext";
import { fakeDelay } from "@/utils/delay";
import { User } from "@/utils/types";

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (data: SignInData) => Promise<any>;
  signUp: (data: SignUpData) => Promise<any>;
  logout: () => Promise<void>;
  user: User | undefined;
  setUser: (user: User) => void;
};

type SignInData = {
  email: string;
  password: string;
};

type SignUpData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  sex: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
  const { inProgress, done } = useContext(RequestContext);
  const router = useRouter();
  
  async function signIn(credentials: SignInData) {
    const response: any = await signInRequest(credentials);
    
    if (response && response.status === 200) {
      setCookie(undefined, "nextauth.token", response?.data?.token, {
        maxAge: 8600,
      });
      setUser(response.data.userResponse);
      router.push("/dashboard");
    }
    return { data: response?.data, status: response?.status };
  }

  async function signUp(credentials: SignUpData) {
    const response = await signUpRequest(credentials);
    if (response && response.status === 200) {
      setCookie(undefined, "nextauth.token", response?.data?.token, {
        maxAge: 8600,
      });
      
      router.push({
        pathname: '/dashboard',
        query: { firstAccess: true }
      })
    }
    return { data: response?.data, status: response?.status };
  }

  async function logout() {
    router.push("/");
    destroyCookie(null, "nextauth.token");
    setUser(undefined);
    await exit();
  }

  const getUserData = async () => {
    try {
      inProgress();
      const response = await getUser();

      await fakeDelay(500);

      done();

      setUser(response.data);
    } catch (err) {

    }
  }

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      // getUser().then((data) => {
      //   setUser(data.data);
      // });
      getUserData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signUp, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
