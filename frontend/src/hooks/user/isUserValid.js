
const useIsUserValid = () => {

  const isUserValid = async () => {
    try {
      const res = await fetch("/api/user/isUserValid", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if(!res.ok){
        localStorage.removeItem("zdm-user");
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  return { isUserValid };
};

export default useIsUserValid;
