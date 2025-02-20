import { fetchUserAddresses } from "@/services/address";
import { Car, getUserCars } from "@/services/car";
import {
  getAllRidesAvailable,
  getCandidates,
  getRideHistory,
} from "@/services/ride";
import { parseCookies } from "nookies";
import { createContext, useEffect, useState } from "react";

type RideContextType = {
  rides: any;
  history: any;
  cars: any;
  setCars: any;
  userAddress: any;
  setRides: any;
  ridesUser: any[];
  setRidesUser: any;
};

export const RideContext = createContext({} as RideContextType);

export function RideProvider({ children }: any) {
  const [rides, setRides] = useState([] as any);
  const [history, setHistory] = useState([] as any);
  const [cars, setCars] = useState<Car[]>([]);
  const [userAddress, setUserAddress] = useState([]);
  const [ridesUser, setRidesUser] = useState([]);

  const { "nextauth.token": token } = parseCookies();
  useEffect(() => {
    if (token) {
      getAllRidesAvailable().then((data) => setRides(data?.data));
      getRideHistory().then((data) => setHistory(data?.data));
    }
  }, [token]);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      const loadData = async () => {
        getUserCars().then((response) => {
          // @ts-ignore
          setCars(response);
        });
        fetchUserAddresses().then((response) => {
          setUserAddress(response?.data);
        });
      };
      loadData();
    }
  }, [token]);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      getAllRidesAvailable().then((data) => setRides(data?.data));
      getRideHistory().then((data) => setHistory(data?.data));
    }
  }, []);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      const loadData = async () => {
        getUserCars().then((response) => {
          // @ts-ignore
          setCars(response);
        });
        fetchUserAddresses().then((response) => {
          setUserAddress(response?.data);
        });
      };
      loadData();
    }
  }, []);

  useEffect(() => {
    if (cars.length > 0) {
      getCandidates().then((data) => {
        setRidesUser(data?.data);
      });
    }
  }, [rides]);

  return (
    // @ts-ignore
    <RideContext.Provider
      value={{
        rides,
        history,
        cars,
        setCars,
        userAddress,
        setRides,
        ridesUser,
        setRidesUser,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}
