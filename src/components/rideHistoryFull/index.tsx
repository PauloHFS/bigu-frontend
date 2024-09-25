import { useContext, useEffect } from "react";
import Modal from "../modal";
import Avatar from "../../assets/woman.png"
import Image from "next/image";
import Star from "../../assets/star.png"
import Button from "../button";
import Map from "../../assets/map.png"
import { formatDateRide } from "@/utils/masks";
import { MapPin, Person, Clock } from "@phosphor-icons/react";
import React from "react";
import { fetchUserAddresses } from "@/services/address";
import { requestRide } from "@/services/ride";
import { AddressResponseDTO, RequestRide, UserResponseDTO } from "@/types/ride";
import { toast } from "react-toastify";
import Dropdown from "../dropdown";
import { AuthContext } from "@/context/AuthContext";

interface RideProps {
  id:string,
  driver: UserResponseDTO,
  start: string,
  destination: string,
  numSeats: number,
  model: string,
  plate: string,
  color: string,
  dateTime: string,
  toWoman: boolean
}

function RideHistoryFull(props: RideProps) {
  const { user } = useContext(AuthContext)
  const [userAddress, setUserAddresses] = React.useState([]);
  const [userAddressesSelected, setUserAddressesSelected] = React.useState(
    {} as any
  );
  const [askRide, setAskRide] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [rideIdSelected, setRideIdSelected] = React.useState({});

  useEffect(() => {
    fetchUserAddresses().then((data) => {
      const addressesFormated = data?.data.userAddress.map((address: AddressResponseDTO) => ({
        label: address.nome,
        value: address.addressId,
      }));
      setUserAddresses(addressesFormated);
    });
  }, [askRide]);

  const handleAskRide = (rideId: string) => {
    const userSex = user?.sex;
    if(props.driver.userId === user?.userId){
      toast.info("Você já é o motorista dessa carona.")
      return
    }else if(props.toWoman && userSex == "Masculino"){
      toast.info("Essa carona é exclusiva para mulheres.")
      return
    }
    setModalOpen((prev) => !prev);
    setRideIdSelected(rideId);
  };

  const submitRide = async () => {
    try {
      const response = await requestRide({
        addressId: userAddressesSelected.value,
        rideId: rideIdSelected,
      } as RequestRide);
      if (response?.status == 200) {
        setAskRide((prev) => !prev);
        setModalOpen((prev) => !prev);
        toast.success("Solicitação enviada. Aguarde a resposta do motorista.")
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  };

  return (

    <div className="bg-light-white w-full h-42 rounded-xl flex p-4 flex-col gap-4 sm:p-5">
      <div className="flex justify-between">
        <div className="flex gap-2 sm:gap-4 items-center">
          <Image className="w-8 h-8 md:w-12 md:h-12" src={Avatar} alt="foto" />
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 items-center">
              <h1 className="font-bold text-black font-['Poppins'] sm:text-2xl md:text-3xl">
                {props.driver.name.split(" ")[0]}
              </h1>
              <Image className=" w-3 h-3" src={Star} alt="estrela" />
              <span className=" text-gray text-xs">5.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between md:items-center">
        <div className="space-y-2 md:space-y-4 lg:space-y-8">
          <div className="flex gap-2 items-center">
            <MapPin size={24} color="#252525" weight="bold"/>
            <span className="font-['Poppins'] font-medium text-xs sm:text-sm md:text-base lg:text-xl">
              {props.start} - {props.destination}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <Person size={24} color="#252525" weight="fill"/>
            <span className="font-['Poppins'] font-normal text-xs sm:text-sm md:text-base lg:text-xl">
              {3 - props.numSeats}{" "}
              {"vagas ocupadas"}{" "}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <Clock size={24} color="#252525" weight="bold" />


            <span className="font-['Poppins'] font-medium text-xs sm:text-sm md:text-base lg:text-xl">
              {props.dateTime}
            </span>
          </div>
        </div>

        <div className="flex gap-8 md:relative bottom-8">
          <Image className="hidden md:flex md:w-40 md:h-32 lg:w-64 lg:h-52" src={Map} alt="mapa" />
        </div>
      </div>
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

  );
}

export default RideHistoryFull;