
const useIsUserValid = () => {

  const isUserValid = async () => {
    try {
      const res = await fetch("/api/user/isUserValid", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        localStorage.removeItem("zdm-user");
        return;
      }

      const user = await res.json();
      localStorage.setItem("zdm-user", JSON.stringify(user));
      return user;

    } catch (error) {
      console.log(error.message);
    }
  };

  return { isUserValid };
};

export default useIsUserValid;
