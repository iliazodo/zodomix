import React, { useEffect, useState } from "react";

import Nav from "../components/Nav.jsx";
import Group from "../components/Group.jsx";
import useGetGroups from "../hooks/useGetGroups.js";

const Explore = () => {

  const {getGroups} = useGetGroups();

  const [groups , setGroups] = useState([]);

  const handleGetGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  }

  useEffect( () => {
    handleGetGroups();
  } , [])

  return (
    <>
      <Nav />
      <div className="overflow-auto h-screen grid grid-cols-1 md:grid-cols-2 py-32 gap-16">
        
        {Array.isArray(groups) && groups.map(group => (
          <Group key={group._id} name={group.name} description={group.description} picture={group.picture} />
        ))}

      </div>
    </>
  );
};

export default Explore;
