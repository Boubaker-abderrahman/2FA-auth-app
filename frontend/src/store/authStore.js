import {create} from "zustand"

import axios from "axios"

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;


export const useAuthStore = create((set)=>({
    user : null,
    isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	setError : ()=>set({error : null}),

    signup : async (email,password,name)=>{
        set({isLoading :true,error : null})

        try{
            const response = await axios.post(`http://localhost:5000/api/auth/signup`,{email,name,password})
            if(!response) {throw new Error(`invalid response in signUp ${response}`)}
            
            set({isLoading : false , user : response.data.user ,isAuthenticated: true, message : response.data.message})
            
            return true

        }catch(err){
            set({isLoading:false, error : err?.response?.data?.message || "Error in Signing Up"})
			console.log(err)
			return false
        }
    },

    login : async (email,password)=>{
        set({isLoading :true,error : null})

        try{
            const response = await axios.post(`http://localhost:5000/api/auth/login`,{email,password})
            set({isLoading : false, isAuthenticated : true , user : response.data.user})
        }catch(err){
			console.log(err?.response?.data?.message)
			console.log(err)
            set({error: err?.response?.data?.message || 'Error Logging in' , isLoading:false })

        }




    },
    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			console.log(error)
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			
			return response.data;
		} catch (error) {
			set({ error: error?.response?.data?.message || "Error verifying email", isLoading: false });
			console.log(error?.response?.data?.message)
			
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/auth-check`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
            console.log(error?.response?.data?.message)

			set({  isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error?.response?.data?.message || "Error sending reset password email",
			});
			console.log(error)
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { newPassword :password });
			console.log(response)
			set({ message: response.data.message, isLoading: false });
			return response
		} catch (error) {
			set({
				isLoading: false,
				error: error?.response?.data?.message || "Error resetting password",
			});
			console.log(error)
		}
	},

}))