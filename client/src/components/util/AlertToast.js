import React from "react";
import { Bounce, toast } from "react-toastify";

export default function ToastMsg(alert) {
    let {msg,type} = alert;
    const TopCenterDefaultToastConfig = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    }

    const ToastConfig = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    };


    switch(type){
        case 'success':
            return toast.success(msg,ToastConfig);
        case 'ok' :
            return toast.info(msg,ToastConfig);
        case 'warn':
            return toast.warn(msg,ToastConfig); 
        case 'err':
            return toast.error(msg,ToastConfig);
        default:
            return toast(msg,TopCenterDefaultToastConfig)
    }

}