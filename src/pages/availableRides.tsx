import { Button } from "@/components";
import RideFull from "@/components/rideFull";
import Text from "@/components/text";
import { AuthContext } from "@/context/AuthContext";
import { 
  getAllRidesActive, 
  getAllRidesAvailable,
  getAllRidesActiveToWomen,
  getAllRidesAvailableToWomen,
 } from "@/services/ride";
import { RideResponseDTO } from "@/types/ride";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ghost from "../assets/ghost.json";
import LottieAnimation from "../components/LottieAnimation";

function AvailableRides() {
  const [rides, setRides] = useState<RideResponseDTO[]>([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isToWomen, setIsToWomen] = useState<boolean>(false);

  useEffect(() => {
    loadDataRides();
  }, [isAvailable, isToWomen]);

  const loadDataRides = async () => {
    setLoading(true);
    try {
      let response;

      if (isAvailable && isToWomen) {
        response = await getAllRidesAvailableToWomen();
      } 
      else if (isAvailable) {
        response = await getAllRidesAvailable();
      } 
      else if (isToWomen) {
        response = await getAllRidesActiveToWomen();
      } 
      else {
        response = await getAllRidesActive();
      }
      setRides(response?.data.rides || []);
    } catch (error) {
      toast.error("Ocorreu algum erro ao buscar as caronas disponíveis.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setIsAvailable(false);
    setIsToWomen(false);
  };

  const ridesWithDriver = rides?.filter(
    (element: any) => element.driver.userId !== user?.userId
  );

  return (
    <div className="flex justify-center items-center my-12">
      <div className="w-[90%] flex flex-col gap-2 lg:max-w-[1024px]">
        <div className="w-full flex gap-1 justify-start">
          <p
            className="cursor-pointer hover:text-stone-400 text-gray text-md font-[Poppins]"
            onClick={() => Router.push("/dashboard")}
          >
            Voltar para tela inicial
          </p>
        </div>
        <div className=" w-full flex flex-col rounded-lg gap-3">
          <div className="flex gap-2 items-center">
            <Text
              label="Caronas ativas"
              className=" cursor-pointer hover:text-stone-400 "
              color="white"
              size="lg"
              weight="bold"
            />
          </div>

          <div className=" w-full flex gap-2 justify-end items-center">
            <Button
              label="Todas"
              size="res"
              color={!isAvailable && !isToWomen ? "green" : "yellow"}
              shape="square"
              onClick={clearFilters}
            />
            <Button 
              label="Disponíveis" 
              size="res" 
              color={isAvailable ? "green" : "yellow"}
              shape="square" 
              onClick={() => setIsAvailable(!isAvailable)}
            />
            <Button 
              label="Para elas" 
              size="res" 
              color={isToWomen ? "pink" : "yellow"}
              shape="square" 
              onClick={() => setIsToWomen(!isToWomen)}
            />
              
          </div>
          {loading ? (
            <div className="flex items-center justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              ></div>
            </div>
          ) : ridesWithDriver?.length ? (
            ridesWithDriver.map((item: RideResponseDTO, index: number) => (
              <div key={index}>
                <RideFull
                  id={item.rideId}
                  driver={item.driver}
                  start={item.startAddress}
                  destination={item.destinationAddress}
                  numSeats={item.numSeats}
                  model={item.car.carModel}
                  plate={item.car.plate}
                  color={item.car.color}
                  dateTime={item.scheduledTime}
                  toWoman={item.toWomen}
                />
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="w-64 h-64 ">
                <LottieAnimation data={ghost} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvailableRides;
