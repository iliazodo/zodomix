import { useState } from "react";

const useGetLeaderboard = () => {
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

    const getLeaderboard = async () => {
        setLeaderboardLoading(true);
        try {
            const res = await fetch("/api/user/leaderboard", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error.message);
            return [];
        } finally {
            setLeaderboardLoading(false);
        }
    };

    return { leaderboardLoading, getLeaderboard };
};

export default useGetLeaderboard;
