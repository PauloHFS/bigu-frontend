import { AddressResponseDTO } from "@/types/ride";
import Button from "../button";
import Mapa from "../map";

type Props = {
    origin: string;
    destination: string;
    handleToggleMap: (s: AddressResponseDTO | null, d: AddressResponseDTO | null) => void;
  };

function MapFullScreen(props: Props) {

    const {origin, destination} = props;

    return (
        <div className="w-full h-full fixed top-0 left-0 bg-white z-50 flex flex-col items-center justify-center">
            <Mapa
                origin={origin}
                destination={destination}
            />
            <Button
                label="Fechar mapa"
                onClick={() => props.handleToggleMap(null, null)}
                size="res"
                color="red"
                shape="square"
                className="absolute top-4 right-4"
            />
        </div>

    )
}

export default MapFullScreen;