import React, { useContext, useEffect } from "react";
import MaleAvatar from "../../assets/avatar.png";
import Image from "next/image";
import Button from "../button";
import Text from "../text";
import {
  requestRide,
} from "@/services/ride";
import LottieAnimation from "../LottieAnimation";
import ghost from "../../assets/ghost.json";
import { formatarData } from "@/utils/masks";
import Modal from "../modal";
import Dropdown from "../dropdown";
import { fetchUserAddresses } from "@/services/address";
import { AuthContext } from "@/context/AuthContext";
import Router from "next/router";
import clsx from "clsx";
import { toast } from "react-toastify";
import type { Ride } from "@/utils/types";
import { AddressResponseDTO, RequestRide, RideResponseDTO } from "@/types/ride";
import Mapa from "../map";
import MapFullScreen from "../mapFullScreen";

type Props = {
  ridesAvailable: RideResponseDTO[];
  loadDataRidesAvailable: () => void;
  loading: boolean;
};

function Ride(props: Props) {
  const { ridesAvailable, loading } = props
  const [userAddress, setUserAddresses] = React.useState([]);
  const [userAddressesSelected, setUserAddressesSelected] = React.useState(
    {} as any
  );
  const [askRide, setAskRide] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [rideIdSelected, setRideIdSelected] = React.useState('');
  const [isMapFullScreen, setIsMapFullScreen] = React.useState(false);
  const [origin, setOrigin] = React.useState<AddressResponseDTO | null>(null);
  const [destination, setDestination] = React.useState<AddressResponseDTO | null>(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadData = async () => {
      const responseAddress = await fetchUserAddresses();
      const addressesFormated = responseAddress?.data.userAddress.map((address: AddressResponseDTO) => ({
        label: address.nome,
        value: address.addressId,
      }));
      setUserAddresses(addressesFormated);
    }
    loadData();
  }, [askRide]);

  const handleAskRide = (rideId: string) => {
    const userSex = user?.sex;
    const ride = ridesAvailable.find(ride => ride.rideId === rideId)
    if (ride?.driver.userId === user?.userId) {
      toast.info("Você já é o motorista dessa carona.")
      return
    } else if (ride?.toWomen && userSex == "Masculino") {
      toast.info("Essa carona é exclusiva para mulheres.")
      return
    } else if (!userAddress.length) {
      toast.info("Você precisa ter um endereço cadastrado para solicitar uma carona.")
      return
    }
    setModalOpen((prev) => !prev);
    setRideIdSelected(rideId);
  };

  const submitRide = async () => {
    if (Object.keys(userAddressesSelected).length != 0) {
      try {
        const response = await requestRide({
          addressId: userAddressesSelected.value,
          rideId: rideIdSelected,
        } as RequestRide);
        if (response?.status == 200) {
          setAskRide(rideIdSelected);
          setModalOpen((prev) => !prev);
          toast.success("Solicitação enviada. Aguarde a resposta do motorista.")
        }
      } catch (err: any) {
        toast.error(err.message)
      }
    }
  };

  const handleViewProfile = async (userId: string) => {
    Router.push(`/view-profile/${userId}`);
  };

  const handleToggleMap = (startAddress: AddressResponseDTO | null, destinationAddress: AddressResponseDTO | null) => {
    setIsMapFullScreen((prev) => !prev);
    setOrigin(startAddress);
    setDestination(destinationAddress);
  };

  const formatAddress = (adress: AddressResponseDTO | null) => {
    return adress?.rua + ", " + adress?.numero + ", " + adress?.cidade + " - " + adress?.estado;
  };

  return (
    <>
      {isMapFullScreen

        ?
        <MapFullScreen origin={formatAddress(origin)} destination={formatAddress(destination)} handleToggleMap={handleToggleMap} />
        :
        <div className="bg-dark w-full rounded-lg p-2 flex flex-col mx-auto max-w-[800px] lg:mx-0 lg:w-full sm:py-4 sm:px-8">
          <h2 className="font-['Poppins'] text-center text-2xl text-white font-bold pb-4 sm:text-xl md:text-2xl ">
            Caronas disponíveis
          </h2>
          <div className="space-y-4 grow">
            {loading ?
              <div className="flex items-center justify-center">
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status">
                </div>
              </div>
              :
              ridesAvailable?.length ? (
                ridesAvailable.slice(0, 3).map((item: RideResponseDTO) => (
                  <div
                    key={item.rideId}
                    className={clsx(
                      "flex w-full h-16",
                      "bg-white rounded-xl transition-height duration-500 ease-in-out overflow-hidden hover:h-48 md:hover:h-44 md:h-20",
                    )}
                  >
                    <div className={clsx("w-4 h-full", item.toWomen && "bg-[#f15bb5]", item.members.some((member) => member.user.userId == user?.userId) && 'bg-green')}></div>
                    <div className="w-full h-full pt-4 pr-4 pb-4 self-start">
                      <div className={clsx("flex gap-2 items-center mb-2")}>
                        <Image
                          className="w-8 h-8 md:w-12 md:h-12"
                          src={MaleAvatar}
                          alt="male avatar"
                        />
                        <p className="font-[Poppins] text-sm tracking-wide whitespace-nowrap md:text-base lg:text-lg ">
                          <span
                            className={`cursor-pointer hover:text-blue-500 ${item.driver.userId === user?.userId ? "cursor-default hover:text-gray-700" : ""
                              }`}
                            onClick={() => {
                              if (item.driver.userId !== user?.userId) {
                                handleViewProfile(item.driver.userId);
                              }
                            }}
                          >
                            {item.driver.userId !== user?.userId ? item.driver.name.split(" ")[0] : "Você"}
                          </span>
                          {` está saindo do ${item.startAddress.bairro}...`}
                        </p>
                      </div>
                      <div className="flex flex-row w-full justify-between">
                        <div className="space-y-2 mt-2 whitespace-nowrap flex flex-col gap-2">
                          <Text
                            label={`🚕 ${item.car.carModel} ${item.car.color} - ${item.car.plate}`}
                            color="dark"
                            size="md"
                            weight="medium"
                            className="tracking-wide text-xs md:text-md"
                          />
                          <Text
                            label={`🙍‍♂️ ${Number(item.numSeats - item.members.length) > 1 ? "Vagas disponíveis" : "Vaga disponível"} ${item.numSeats - item.members.length}`}
                            color="dark"
                            size="md"
                            weight="medium"
                            className="tracking-wide text-xs md:text-md"
                          />
                          <Text
                            label={`⏰ ${formatarData(item.scheduledTime)}`}
                            color="dark"
                            size="md"
                            weight="medium"
                            className="tracking-wide text-xs md:text-md"
                          />
                          <Text
                            label={`💵 ${String(item.price)}`}
                            color="dark"
                            size="md"
                            weight="medium"
                            className="tracking-wide text-xs md:text-md"
                          />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-6">
                          <span
                            className="animate-pulse text-blue-500 ease-in-out infinite font-[Poppins] cursor-pointer"
                            onClick={() => handleToggleMap(item.startAddress, item.destinationAddress)}
                          >
                            Ver no mapa
                          </span>
                          {item.members.some((membro) => membro.user.userId == user?.userId) ? (
                            <div className="self-end">
                              <Text label="Carona aceita" color="green" weight="bold" size="xs" className="uppercase sm:text-sm" />
                            </div>
                          ) : (
                            <div className={`self-end`}>
                              {item.candidates.some((candidate) => candidate.user.userId == user?.userId) || askRide === item.rideId ? (
                                <span className="font-['Poppins'] animate-pulse text-yellow ease-in-out infinite text-xs">
                                  Aguardando confirmação...
                                </span>
                              ) : (
                                <Button
                                  label="Pedir carona"
                                  onClick={() => handleAskRide(item.rideId)}
                                  size="xs"
                                  color="green"
                                  shape="square"
                                  className="sm:w-36 sm:h-10 sm:px-3 sm:text-sm md:w-48 md:h-12 md:px-8 md:text-base"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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

          <footer className="pt-4 justify-self-end">
            <p
              className=" text-gray text-base self-start hover:text-stone-400 cursor-pointer font-[Poppins]"
              onClick={() => Router.push("/availableRides")}
            >
              Ver mais
            </p>
          </footer>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen((prev) => !prev)}
            onSubmit={submitRide}
          >
            <Dropdown
              label="Selecione o ponto de partida"
              options={userAddress}
              onSelectOption={setUserAddressesSelected}
            />
          </Modal>
        </div>
      }
    </>
  );
}

export default Ride;
