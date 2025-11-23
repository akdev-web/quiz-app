import { createContext, useContext, useEffect, useState } from "react";
import api from "../components/api";
import ToastMsg from '../components/util/AlertToast.js';


const UserContext = createContext();
export const UserProvider = ({children}) =>{
    const [user,setUser] = useState(null);
    const [authenticating ,setauthenticating] = useState(true)

    useEffect(()=>{
        const getUser = async() =>{
            setauthenticating(true)
            try {
                const res = await api.get('/user/profile');
                if(res.data.success){
                    setUser(res.data?.user);
                    setauthenticating(false);
                }
            } catch (error) {
                ToastMsg({msg:error.message,type:'err'});
                setauthenticating(false);
            }  
        }
        const access = localStorage.getItem('access_Token'); 
        if(!user  && access){
          getUser();             
        }else {setauthenticating(false)} 
    },[])


   
    const Login = (user,token) => {
        setUser(user)
        localStorage.setItem('access_Token',token);
    }

    const Logout = () =>{
        setUser(null);
        localStorage.removeItem('access_Token');
    }

    return (
        <UserContext.Provider value={{user,setUser,authenticating,Login,Logout}}>
            {children}
        </UserContext.Provider>
    )
}

const useUserContext = () => useContext(UserContext);
export default useUserContext;