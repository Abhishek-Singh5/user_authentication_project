import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";


const ResetPassword = () => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSend, setIsEmailSend] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const inputRefs = React.useRef([]);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').slice(0, 6);
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email }, { withCredentials: true });
            if (data.success) {
                toast.success(data.message);
                setIsEmailSend(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const onSubmitOTP = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(input => input.value);
        const otpValue = otpArray.join('');

        if (otpValue.length !== 6) {
            return toast.error("Please enter 6-digit OTP");
        }

        setOtp(otpValue);
        setIsOtpSubmitted(true);
    };

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword }, { withCredentials: true });
            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" />

            {!isEmailSend && (
                <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
                    <p className="text-center mb-6 text-indigo-300">Enter your registered email address.</p>
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.mail_icon} alt="mail" className="w-3 h-3" />
                        <input type="email" placeholder="Email id" className="bg-transparent outline-none text-white" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
                </form>
            )}

            {isEmailSend && !isOtpSubmitted && (
                <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password OTP</h1>
                    <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id.</p>
                    <div className="flex justify-between mb-8" onPaste={handlePaste}>
                        {Array(6).fill('').map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded"
                                ref={el => inputRefs.current[index] = el}
                                onInput={e => handleInput(e, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                required
                            />
                        ))}
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Submit</button>
                </form>
            )}

            {isOtpSubmitted && isEmailSend && (
                <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">New password</h1>
                    <p className="text-center mb-6 text-indigo-300">Enter the new password below</p>
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.lock_icon} alt="lock" className="w-3 h-3" />
                        <input type="password" placeholder="Password" className="bg-transparent outline-none text-white" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;