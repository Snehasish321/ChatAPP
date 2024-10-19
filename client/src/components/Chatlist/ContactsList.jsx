import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack , BiSearchAlt2} from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [{},dispatch] = useStateProvider()

  useEffect(() => {
    
    const getContacts = async () => {
      try {
        
      const {
        data:{users},
      } = await axios.get(GET_ALL_CONTACTS);
      setAllContacts(users);
    } catch (err) {
      console.log(err);
    }
  };
    getContacts();
},[]);
return (
  <div className="h-full flex flex-col bg-dark">
    <div className="h-20 flex items-center px-4 py-2 bg-header">
      <BiArrowBack 
        className="cursor-pointer text-2xl"
        onClick={() => 
          dispatch({
            type: reducerCases.SET_ALL_CONTACTS_PAGE
          })
        }
      />
      <span className="ml-4 text-white text-lg">New Chat</span>
    </div>
    <div className="flex-auto overflow-auto custom-scrollbar bg-content">
      <div className="bg-panel-header-background flex items-center gap-3 px-4 py-2 rounded-lg m-4">
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl"/>
        <input 
          type="text" 
          placeholder="Search contacts" 
          className="bg-transparent text-sm focus:outline-none text-white w-full"
        />
      </div>
      { Object.entries(allContacts).map(([initialLetter, userList]) => {
        return  (
        <div key={Date.now() + initialLetter} className="pl-10 py-2">
          <div className="text-teal-light text-base font-medium">
            {initialLetter}
          </div>
          {
            userList.map(contact=> {
              return(
              <ChatLIstItem 
              data={contact}
              isContactPage={true}
              key={contact.id}
              />
            )
            })}
        </div>
      );
})}
    </div>
  </div>
);
}

export default ContactsList;
