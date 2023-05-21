import Menu from "../assets/Menu.png"
import Foto from "../assets/woman.png"
import Star from "../assets/star.png"
import Image from "next/image"
import Ride from "@/components/ride";
import React from "react";
import Button from "@/components/button";
import Back from "../assets/CaretRight.svg"
import RideFull from "@/components/rideFull";
function Dashboard(){
  const[drawer, setDrawer] = React.useState(false);

  const openDrawer = () => {
    setDrawer(true);
  };

  const handleOutsideClick = (event: any) => {
    // Verifica se o clique ocorreu fora do drawer
    if (drawer && !event.target.closest('#drawer')) {
      setDrawer(false);
    }
  };

  
  return (
      <div className=" relative w-full py-9" onClick={handleOutsideClick}>
        <div className=" max-w-[89%] mx-auto flex flex-col gap-9">
          <header className="flex justify-between items-center px-6">
            <div className="flex gap-2 items-center">
              <Image className=" w-10 h-10" src={Foto} alt="foto" />
              <a className=" text-gray" href="">
                Ver perfil
              </a>
            </div>
            <Image className=" w-9 h-6" src={Menu} alt="menu" onClick={openDrawer}/>
            {drawer && 
              <div id="drawer" className="bg-white w-1/2 fixed top-0 right-0 h-44 rounded flex justify-center items-center">
                <div className="flex flex-col p-5 justify-center items-center gap-5 ">
                  <Button label="Oferecer carona" onClick={() => {}} size="res" color="yellow" shape="square" />
                  <Button label="Sair" onClick={() => {}} size="res" color="yellow" shape="square" />
                </div>
              </div>
            }
          </header>
          <div className="flex justify-between items-center px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <h1 className="text-xl font-bold text-white md:text-4xl mr-2">
                  Olá, Matheus
                  {/* {`Olá, ${user.fullName}`} */}
                </h1>
                <div className="flex items-center gap-2 pt-2">
                  <Image className="w-3 h-3" src={Star} alt="estrela" />
                  <span className="text-gray text-[0.725rem]">5.0</span>
                </div>
              </div>
            </div>
            {/* <Button label="Salvar" onClick={editSubmit} size="md" color="green" shape="square" /> */}
          </div>
          <Ride/>
        </div>
      </div>
    );
}
export default Dashboard;