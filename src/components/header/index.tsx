import { fetchUserAddresses } from "@/services/address";
import { Car, getUserCars } from "@/services/car";
import { AddressFormState } from "@/utils/types";
// import { List, SignOut } from "@phosphor-icons/react/dist/ssr";
import { List } from "@phosphor-icons/react/dist/ssr/List";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Foto from "../../assets/woman.png";
import useDrawer from "../../hooks/useDrawer";
import Drawer from "../drawer";
import Input from "../input/input";
import Text from "../text";
import Link from "./Link";

type Props = {
  handleOpenRequests: () => void;
  handleOpenRides: () => void;
};

export default function Header(props: Props) {
  const {
    drawerIsOpen,
    toggleDrawer,
    handleLogout,
    handleNavigateToOfferRide,
  } = useDrawer();
  const router = useRouter();

  const [carsUser, setCarsUser] = useState<Car[]>([]);
  const [userAddresses, setUserAddresses] = useState<AddressFormState[]>([]);
  const [hoveredImage, setHoveredImage] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const responseCars: any = await getUserCars();
      if (responseCars) setCarsUser(responseCars.data.userCars);

      const responseAddress = await fetchUserAddresses();
      if (responseAddress?.data)
        setUserAddresses(responseAddress?.data.userAddress);
    };
    loadData();
  }, []);

  const showToast = () => {
    if (!(carsUser.length && userAddresses.length)) {
      toast.info(
        "Você precisa pelo menos um carro e endereço cadastrados para ofertar uma carona."
      );
    }
  };

  return (
    <header className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Image
          onClick={() => router.push("/profile")}
          className="w-12 h-12 lg:w-20 lg:h-20 cursor-pointer"
          src={Foto}
          alt="foto"
        />
        {hoveredImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/70 rounded-full">
            <label
              title="Click to upload"
              className="cursor-pointer flex items-center gap-4 px-6 py-4 relative"
            >
              <img
                className="w-12"
                src="https://www.svgrepo.com/show/357902/image-upload.svg"
                alt="file upload icon"
                width="512"
                height="512"
              />
              <Input
                name="foto"
                className="w-full md:h-16 md:text-lg hidden"
                type="file"
                sizing="xs"
              />
            </label>
          </div>
        )}
        <Link
          to="/profile"
          label="Ver perfil"
          className="hover:text-stone-400 text-xl"
        />
      </div>
      <List
        size={32}
        color="gray"
        className="lg:hidden cursor-pointer"
        onClick={toggleDrawer}
      />

      <div className="hidden lg:flex md:gap-5 items-center">
        <button
          onClick={showToast}
          className="group transition-all duration-300 ease-in-out"
        >
          <Link
            to="/offer-ride"
            className={clsx(
              "text-gray text-base uppercase font-medium",
              carsUser.length &&
                userAddresses.length &&
                "py-2 text-gray text-base hover:text-[#a8a29e] uppercase font-medium bg-left-bottom bg-gradient-to-r from-amber-400 to-amber-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out underline-offset-8"
            )}
            label="Oferecer carona"
            disabled={!(carsUser.length && userAddresses.length)}
          />
        </button>
        <button
          onClick={props.handleOpenRequests}
          className="group transition-all duration-300 ease-in-out"
        >
          <Text
            label="Solicitações"
            className="py-2 text-gray text-base hover:text-[#a8a29e] uppercase font-medium bg-left-bottom bg-gradient-to-r from-amber-400 to-amber-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out underline-offset-8"
            color="gray"
            size="base"
            weight="medium"
          />
        </button>

        <button
          onClick={props.handleOpenRides}
          className="group transition-all duration-300 ease-in-out"
        >
          <Text
            label="Minhas caronas"
            className="py-2 text-gray hover:text-[#a8a29e] text-base uppercase font-medium bg-left-bottom bg-gradient-to-r from-amber-400 to-amber-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out underline-offset-8"
            color="gray"
            size="base"
            weight="medium"
          />
        </button>
        <span
          className="flex items-center gap-2 hover:text-stone-400 cursor-pointer hover:underline"
          onClick={handleLogout}
        >
          <Text
            label="SAIR"
            size="md"
            color="gray"
            className="cursor-pointer hover:hover:text-stone-400"
          />
          <SignOut size={36} color="gray" className="" />
        </span>
      </div>
      <Drawer
        drawerIsOpen={drawerIsOpen}
        toggleDrawer={toggleDrawer}
        handleOpenRequests={props.handleOpenRequests}
        handleOpenRides={props.handleOpenRides}
        handleNavigateToOfferRide={handleNavigateToOfferRide}
        handleLogout={handleLogout}
      />
    </header>
  );
}
