import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import Input from "./Input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "./PasswordStrengthMeter.jsx";
import { useAuthStore } from "../store/authStore.js";
const SigneIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isLoading , error,setError } = useAuthStore();
  
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
			const valid = await signup(email, password, name);
      valid ?  navigate("/verify-email") : null;
		} catch (error) {
      console.log(error);
		}
    
  };

    useEffect(() => {
    setError();
  }, []);
console.log(error);

 

  return (
    <motion.div
      className="max-w-md w-full absolute  bg-gray-800 bg-opacity-50 rounded-2xl backdrop-filter backdrop-blur-xl shadow-xl "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handelSubmit}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordStrengthMeter password={password} />

          {error && error.length>0 && <p className='text-red-500 font-semibold px-1 pt-3'>{error}</p>}


          <motion.button
            className="mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg
          shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none  focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
          focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className=" rounded-b-xl  bg-gray-900 bg-opacity-50  px-8 py-4  flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{"  "}
          <Link to="/login" className="text-green-400 hover:underline">
            login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SigneIn;
