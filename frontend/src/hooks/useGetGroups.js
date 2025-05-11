

const useGetGroups = () => {

  const getGroups = async () => {

    try {
        const res = await fetch("https://zodomix.com/api/group/get" , {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
            credentials: "include"
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
