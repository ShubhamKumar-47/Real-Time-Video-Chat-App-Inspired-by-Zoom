import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
});

export const AuthProvider = ({ children }) => {

    // Start with no user data by default; provider should not consume its own context.
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) return null;
            let request = await client.get("/get_user_info", {
                params: {
                    token
                }
            });
            if (request.status === 200) {
                setUserData(request.data);
                return request.data;
            }
        } catch (err) {
            console.error("Failed to fetch user info:", err);
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            setUserData(null);
        }
        return null;
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name,
                username,
                password
            });

            if (request.status === 201) {  // CREATED
                return request.data.message;
            }

        } catch (err) {
            throw err;
        }
    };

    const handleLogin = async (username, password, remember = false) => {
        try {
            let request = await client.post("/login", {
                username,
                password
            });

            if (request.status === 200) {  // OK
                const token = request.data.token;
                // If user wants to be remembered, persist to localStorage, otherwise sessionStorage
                if (remember) {
                    localStorage.setItem("token", token);
                } else {
                    sessionStorage.setItem("token", token);
                }
                
                // Fetch and populate user profile data immediately
                await fetchUserInfo();
                
                // Return token so caller can decide navigation/UI
                return token;
            }

            return null;

        } catch (err) {
            throw err;
        }
    };

    const getHistoryOfUser = async () => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            let request = await client.get("/get_all_activity", {
                params: {
                    token
                }
            });

            return request.data;

        } catch (err) {
            throw err;
        }
    };

    const addToUserHistory = async (meetingCode) => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            let request = await client.post("/add_to_activity", {
                token,
                meeting_code: meetingCode
            });

            return request;

        } catch (e) {
            throw e;
        }
    };

    const requestPasswordResetOtp = async (email) => {
        try {
            let request = await client.post("/forgot-password", {
                username: email
            });
            return request.data;
        } catch (err) {
            throw err;
        }
    };

    const resetPasswordWithOtp = async (email, otp, newPassword) => {
        try {
            let request = await client.post("/reset-password", {
                username: email,
                otp,
                newPassword
            });
            return request.data;
        } catch (err) {
            throw err;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUserData(null);
        navigate("/auth");
    };

    const data = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin,
        fetchUserInfo,
        handleLogout,
        requestPasswordResetOtp,
        resetPasswordWithOtp
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};
