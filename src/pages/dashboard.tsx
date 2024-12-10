import { useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import Image from "next/image";

import Header from "@/components/header";
import History from "@/components/history";
import Ride from "@/components/ride";
import { AuthContext } from "@/context/AuthContext";
import Star from "../assets/star.png";
import { RequestContext } from "@/context/RequestContext";
import RidesRequests from "@/components/requestRides";
import RidesOffers from "@/components/ridesOffers";
import LottieAnimation from "@/components/LottieAnimation";
import Celebrations from "../assets/celebrations.json";
import { Text } from "@/components";
import { fakeDelay } from "@/utils/delay";
import clsx from "clsx";
import { useRouter } from "next/router";
import { getAllRidesAvailable, getMyRidesAvailable, getRideHistory } from "@/services/ride";
import { RideResponseDTO } from "@/types/ride";
import { toast } from "react-toastify";
import Joyride, { Step, CallBackProps } from "react-joyride";

function Dashboard() {
  const router = useRouter();
  const { firstAccess: first = false } = router.query;
  const { user } = useContext(AuthContext);
  const { loading } = useContext(RequestContext);
  const [history, setHistory] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [showRides, setShowRides] = useState(false);
  const [firstDashboardAccess, setFirstDashboardAccess] = useState(first);
  const [ridesAvailable, setRidesAvailable] = useState<RideResponseDTO[]>([]);
  const [myRides, setMyRides] = useState<RideResponseDTO[]>([]);

  const [loadingStateRides, setLoadingStateRides] = useState<boolean>(true);
  const [loadingStateHistory, setLoadingStateHistory] = useState<boolean>(true);

  const handleCloseRequests = () => setShowRequests(false);
  const handleOpenRequests = () => setShowRequests(true);
  const handleCloseRides = () => setShowRides(false);
  const handleOpenRides = () => setShowRides(true);

  useEffect(() => {
    loadDataHistory();
    loadDataRidesAvailable();
    loadDataMyRides();
  }, []);
  
  const loadDataHistory = async () => {
    try{
      const responseHistory = await getRideHistory();
      setHistory(responseHistory.data.userHistory);
    }finally{
      setLoadingStateHistory(false);
    }
  }

  const loadDataRidesAvailable = async () => {
    try{
      const responseAvailable = await getAllRidesAvailable();
      setRidesAvailable(responseAvailable?.data.rides);
    }finally{
      setLoadingStateRides(false);
    }
  }

  const loadDataMyRides = async () => {
    try{
      const myRides = await getMyRidesAvailable();
      if (myRides) setMyRides(myRides.data.userDriverActivesHistory);
    }catch(error: any){
      toast.error("Ocorreu um erro ao buscar as suas caronas.")
    }
  }

  const renderGreeting = () => {
    return (
      <div className="flex gap-1">
        {loading ? (
          <div className="flex items-center gap-4">
            <div className="animate-pulse rounded-md bg-slate-700 h-14 w-80"></div>
            <div className="animate-pulse rounded-md bg-slate-700 h-14 w-16"></div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <h1 className="font-[Poppins] text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl mr-2">
              {`Olá, ${user?.name.split(" ")[0]}`}
            </h1>
            <div className="flex items-center gap-2">
              <Image className="w-3 h-3" src={Star} alt="estrela" />
              <span className="text-gray text-[0.725rem] pt-1">{user ? user.avgScore.toFixed(1) : 0.0}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const [messages, setMessages] = useState([
    "Sua conta foi criada com sucesso!",
    "Viu como foi fácil?",
    "Espere um instante",
    "Tudo pronto. Seja bem-vindo!",
  ]);

  const positions = ["-0px", "-100px", "-200px", "-300px", ""];

  const [p, setP] = useState(0);

  useEffect(() => {
    async function t() {
      await fakeDelay(2000);
      setP(1);
      await fakeDelay(2000);
      setP(2);
      await fakeDelay(2000);
      setP(3);
      await fakeDelay(2000);
      setP(4);
    }

    t();
  }, []);

  useEffect(() => {
    if (p === 4) {
      setFirstDashboardAccess(false);
    }
  }, [p]);

  const firstAccess = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <div className="w-[1100px] h-28 mt-28 overflow-hidden mx-auto text-center space-y-10">
          {messages.map((ms, i) => (
            <Text
              key={i}
              label={ms}
              size="5xl"
              className={clsx(
                `transition translate-y-[${positions[p]}] ease-in-out duration-1000`,
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-center w-full h-screen absolute">
          <LottieAnimation
            data={Celebrations}
            className="top-48 w-[800px] absolute start-auto"
          />
        </div>
      </div>
    );
  };

  // Steps for Joyride
  const steps: Step[] = [
    {
      target: ".profile", // CSS selector for the element to highlight
      content: "Aqui você encontra sua pontuação média, conquistada ao longo da sua jornada no Bigu!",
      disableBeacon: true
    },
    {
      target: ".history-section", // Assuming this class is applied to the History component
      content: "Este é o seu histórico de corridas, incluindo as que você participou e as que ofereceu!",
      disableBeacon: true
    },
    {
      target: ".rides-available", // Assuming this class is applied to the Ride component
      content: "Estas são as corridas disponíveis no momento. Clique em 'Ver mais' para explorar mais opções e filtrá-las conforme sua preferência.",
      disableBeacon: true
    },
    {
      target: ".header-actions", // Assuming this class is applied to Header actions
      content: "No canto superior direito, você pode configurar sua foto de perfil, acessar suas informações e editá-las. Já no canto superior esquerdo, é possível buscar ajuda, oferecer uma carona, visualizar as solicitações recebidas e acessar dados das caronas que você está oferecendo!",
      disableBeacon: true
    },
    {
      target: ".info-Botton", // Assuming this class is applied to Header actions
      content: "Por fim, no botão abaixo, você pode revisitar este tutorial sempre que precisar. Estamos aqui para ajudar :)",
      disableBeacon: true
    },
  ];

  const [showGuide, setShowGuide] = useState(false);


  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status)) {
      setShowGuide(false); // Hide guide after it finishes
    }
  };



  return (
    <div className="relative w-full my-16 max-w-[1920px] mx-auto">
      {firstDashboardAccess ? (
        firstAccess()
      ) : (
        <>
        
          {showGuide && (
              <Joyride
              steps={steps} 
              continuous
              showSkipButton
              // showProgress
              run={showGuide}
              callback={handleJoyrideCallback}
              styles={{
                options: {
                  zIndex: 10000,
                },
              }}
              locale={{
                back: "Voltar",
                close: "Fechar",
                last: "Finalizar",
                next: "Próximo",
                open: 'Abrir',
                skip: "Pular",
              }}
              
            />
          )}
        
          {/* Conteúdo do Dashboard */}
          <div className="max-w-[90%] mx-auto flex flex-col gap-9">
            <div className="header-actions">
              <Header
                handleOpenRequests={handleOpenRequests}
                handleOpenRides={handleOpenRides}
                hasCandidates={myRides.some((ride) => ride.candidates.length > 0)}
              />
            </div>
            <div className="profile flex justify-between items-center">
              {renderGreeting()}
            </div>
            <div className="flex flex-col-reverse justify-between gap-2 sm:gap-12 lg:gap-12 lg:flex-row">
              <div className="history-section w-full">
                <History races={history} loading={loadingStateHistory} />
              </div>
              <div className="border-solid border-[1px] border-warmGray-700"></div>
              <div className="rides-available w-full">
                <Ride ridesAvailable={ridesAvailable} loadDataRidesAvailable={loadDataRidesAvailable} loading={loadingStateRides}/>
              </div>
            </div>
          </div>
          <RidesRequests
            handleClose={handleCloseRequests}
            visible={showRequests}
            myRides={myRides}
            setMyRides={setMyRides}
          />
          <RidesOffers handleClose={handleCloseRides} visible={showRides} loadDataRidesAvailable={loadDataRidesAvailable}/>
          <button
            className="info-Botton fixed bottom-4 left-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none"
            onClick={() => setShowGuide(true)}
            title="Iniciar Guia"
          >
            ?
          </button>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "nextauth.accessToken": token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
