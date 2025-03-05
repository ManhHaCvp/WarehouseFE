import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserContext);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.match(/^(0[1-9]|84[1-9])[0-9]{8,9}$/)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/request-otp", { phonenumber: phone }, { withCredentials: true });
      toast.success("OTP đã được gửi!");
      setShowOtpForm(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Không thể gửi OTP, thử lại sau!");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/auth/verify-otp?phoneNumber=${phone}&otp=${otp}`, {}, { withCredentials: true });
      toast.success("Xác thực thành công!");
      sessionStorage.setItem("user", JSON.stringify(response.data));
      setUserAuth(response.data);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("OTP không hợp lệ, vui lòng thử lại!");
    }
  };

  return (
    // Test
    <div className="flex h-screen w-screen overflow-hidden p-2">
      <div className="flex flex-col justify-center items-center w-1/2 h-full bg-[#182F73] rounded-3xl">
        <div className="absolute top-4 left-4 flex items-center px-4 py-2 rounded-md">
          <img src="/test.svg" alt="Logo" className="w-25 h-25 mr-2 mt-4 ml-4" />
        </div>
        <img src="/icon.svg" alt="Logo" className="w-80 h-80" />

        <div className="absolute bottom-4 left-4 text-white text-sm leading-tight ml-5 mb-8">
          <p className="text-xl"> “NATRUMAX - VÌ MỘT VIỆT NAM KHỎE MẠNH”</p>
          <p className="mt-2">Nguyễn Tất Tùng</p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-1/2 h-full">
        <div className="w-94">
          {!showOtpForm ? (
            <form onSubmit={handleSendOtp} className="flex flex-col justify-center w-full">
              <h2 className="text-3xl font-semibold text-center mb-4">Login</h2>
              <label className="text-gray-700 text-center mb-5" htmlFor="phone">
                Enter phone number to get OTP
              </label>
              <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Phone Number" />
              <button type="submit" className="w-full bg-[#2a4181] text-white py-2 px-4 rounded hover:bg-[#1E40AF] mt-1.5">
                Get OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col justify-center w-full">
              <h2 className="text-3xl font-semibold text-center mb-4">Submit OTP</h2>
              <label className="text-gray-700 text-center mb-5" htmlFor="otp">
                Enter OTP to access into system
              </label>
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otp} onChange={setOtp} className="flex justify-center">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <button type="submit" className="w-full bg-[#2a4181] text-white py-2 px-4 rounded hover:bg-[#1E40AF] mt-4">
                Submit
              </button>
            </form>
          )}
          <p className="text-center text-gray-600 mt-4">
            By clicking get OTP, you agree to our <br />
            <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
