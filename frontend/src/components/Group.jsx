import React from 'react'
import { useNavigate } from 'react-router-dom';

const Group = (props) => {

  const navigate = useNavigate();

  const handleJoin = () => {
    localStorage.setItem("zdm-group" , JSON.stringify(props.name));
    navigate(`/chatZone/:${props.name}`);
  }

  return (
        <div className="p-5 flex flex-col border-2 border-white border-l-fuchsia-600 border-b-fuchsia-600 rounded-3xl w-[calc(100%-50px)] m-auto">
          <div className="flex flex-row justify-center items-center gap-7 xl:gap-40">
            <img
              src={`/groups/${props.picture}.png`}
              alt="profle"
              className="rounded-full border-2 border-white w-24 h-24"
            />
            <h3 className="text-5xl text-center">{props.name}</h3>
          </div>
          <p className="p-5">{props.description}</p>
          <button
            onClick={handleJoin}
            className="py-2 bg-transparent border-2 rounded-full text-2xl transition duration-300 ease-out hover:bg-white hover:text-black active:bg-black active:text-white xl:w-1/2 xl:m-auto cursor-pointer"
          >JOIN</button>
        </div>
  )
}

export default Group
