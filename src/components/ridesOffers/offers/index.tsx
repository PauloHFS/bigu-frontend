import Button from "@/components/button";
import Text from "@/components/text";
import { getMyRidesAvailable, setOverRide } from "@/services/ride";
import { RideResponseDTO } from "@/types/ride";
import { formatarData } from "@/utils/masks";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import Router from "next/router";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type Props = {
  ride: RideResponseDTO;
  handleClose: () => void;
  handleDeleteRide: (ride: RideResponseDTO) => void;
  handleEditRide: (ride: string) => void;
  setMyRides: Dispatch<SetStateAction<RideResponseDTO[]>>;
};

function Offer(props: Props) {
  const { ride, setMyRides } = props;

  const handleOverRide = async (rideId: string) => {
    try {
      const response = await setOverRide(rideId);
      if (response && response.status === 200) {
        toast.success("Carona finalizada com sucesso.");
        const response = await getMyRidesAvailable();
        setMyRides(response?.data.userDriverActivesHistory);
      }
    } catch (error) {
      toast.error("Ocorreu algum erro ao finalizar essa carona.");
    }
  };

  const handleViewProfile = async (userId: string) => {
    Router.push(`/view-profile/${userId}`);
  };

  const handleChat = () => {
    Router.push(`/chat?rideId=${ride.rideId}&senderId=${ride.driver.userId}`);
  };

  return (
    <div className="w-full rounded-lg px-8 py-6 bg-white shadow-xl">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div>
            <Text label="📍 Origem:" color="dark" size="base" weight="bold" />
            <Text
              label={
                ride.startAddress.rua +
                ", " +
                ride.startAddress.numero +
                ", " +
                ride.startAddress.bairro
              }
              color="gray"
              size="base"
            />
          </div>

          <div>
            <Text label="📍 Destino:" color="dark" size="base" weight="bold" />
            <Text
              label={
                ride.destinationAddress.rua +
                ", " +
                ride.destinationAddress.numero +
                ", " +
                ride.destinationAddress.bairro
              }
              color="gray"
              size="base"
            />
          </div>

          <div>
            <Text
              label="🚙 Vagas disponíveis:"
              color="dark"
              size="base"
              weight="bold"
            />
            <Text
              label={
                Number(ride.numSeats) - ride.members.length > 1
                  ? ride.numSeats + " vagas disponíveis"
                  : Number(ride.numSeats) -
                    ride.members.length +
                    " vaga disponível"
              }
              color="gray"
              size="base"
            />
          </div>

          <div>
            <Text
              label="⏰ Data e hora:"
              color="dark"
              size="base"
              weight="bold"
            />
            <Text
              label={formatarData(ride.scheduledTime)}
              color="gray"
              size="base"
            />
          </div>

          <div>
            <Text label="🙋 Membros:" color="dark" size="base" weight="bold" />
            {ride.members && ride.members.length > 0 ? (
              <ul>
                {ride.members.map((member, index) => (
                  <li key={index}>
                    <p
                      className="font-[Poppins] text-gray text-lg cursor-pointer hover:text-blue-500"
                      onClick={() => handleViewProfile(member.user.userId)}
                    >
                      {`- ${member.user.name}`}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <Text
                label="Sem membros por enquanto..."
                color="gray"
                size="base"
              />
            )}
          </div>
        </div>
        <PencilSimple
          color="#FFB400"
          weight="bold"
          className="cursor-pointer"
          size={24}
          onClick={() => props.handleEditRide(ride.rideId)}
        />
      </div>
      <div className="flex flex-row justify-center gap-2 mt-4">
        <Button
          label="Chat"
          size="sm"
          color="dark-blue"
          className="uppercase"
          shape="square"
          onClick={() => handleChat()}
        />

        <Button
          label="Cancelar"
          size="sm"
          color="red"
          className="uppercase"
          shape="square"
          onClick={() => props.handleDeleteRide(ride)}
        />

        <Button
          label="Finalizar"
          size="sm"
          color="green"
          className="uppercase"
          shape="square"
          onClick={() => handleOverRide(ride.rideId)}
        />
      </div>
    </div>
  );
}

export default Offer;
