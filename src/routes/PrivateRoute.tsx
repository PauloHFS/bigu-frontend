import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useContext } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();

  // Simule a verificação de autenticação
  const { isAuthenticated, setUser } = useContext(AuthContext); // Substitua por sua lógica de autenticação real

  // useEffect(() => {
  //   console.log(isAuthenticated);
  //   if (!isAuthenticated) {
  //     router.push("/");
  //     return; // Redirecionar para a página de login se não estiver autenticado
  //   } else {
  //     getUser().then((response) => {
  //       setUser(response.data);
  //     });
  //   }
  // }, [isAuthenticated, router]);

  // useEffect(() => {
  //   const token = localStorage.getItem("bigu-token");
  //   if (token) {
  //     getUser().then((response) => {
  //       setUser(response.data);
  //     });
  //   }
  // }, []);

  return <>{children}</>;
};

const withPrivateRoute = (WrappedComponent: React.ComponentType) => {
  const ComponentWithPrivateRoute: React.FC = () => (
    // @ts-ignore
    <PrivateRoute>
      {/* @ts-ignore */}
      <WrappedComponent />
    </PrivateRoute>
  );

  return ComponentWithPrivateRoute;
};

export default withPrivateRoute;
