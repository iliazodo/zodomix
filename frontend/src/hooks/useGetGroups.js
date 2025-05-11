

const useGetGroups = () => {

  const getGroups = async () => {

    try {
        const res = await fetch("/api/group/get" , {
            method: "GET",
            headers: {"Content-Type" : "application/json"}
        })

        const data = await res.json();

        return data;

    } catch (error) {
      console.log(error.message);
    }
  };

  return { getGroups };
};

export default useGetGroups;
