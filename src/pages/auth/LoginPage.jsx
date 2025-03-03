import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App"; // Import UserContext
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false); // Điều khiển hiển thị OTP form
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserContext);

  // Hàm gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.match(/^(0[1-9]|84[1-9])[0-9]{8,9}$/)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/request-otp", { phonenumber: phone }, { withCredentials: true });
      toast.success("OTP đã được gửi!");
      setShowOtpForm(true); // Chuyển sang giao diện nhập OTP
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Không thể gửi OTP, thử lại sau!");
    }
  };

  // Hàm xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/verify-otp?phoneNumber=${phone}&otp=${otp}`,
        {}, // Body rỗng
        { withCredentials: true },
      );

      toast.success("Xác thực thành công!");
      sessionStorage.setItem("user", JSON.stringify(response.data));
      setUserAuth(response.data); // Cập nhật trạng thái đăng nhập
      console.log(response.data);
      navigate("/admin/dashboard"); // Điều hướng tới trang chính
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("OTP không hợp lệ, vui lòng thử lại!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Cột bên trái */}
      <div 
  className="flex items-center justify-center w-full h-screen bg-cover bg-center" 
  style={{ backgroundImage: "url('https://natrumax.com/wp-content/uploads/2021/08/logo-co-ban-NTM.jpg')" }}
>
 
</div>

      {/* Cột bên phải: Chuyển đổi giữa 2 form */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col justify-center w-94">
          {!showOtpForm ? (
            // Form nhập số điện thoại
            <form onSubmit={handleSendOtp} className=" flex flex-col justify-center w-94  ">
              <div className="flex justify-center">
                <h2 className="text-3xl font-semibold mb-4">Login</h2>
              </div>
              <div className="mb-4">
                <label className="flex justify-center text-gray-700 mb-5" htmlFor="phone">
                  Enter phone number to get OTP
                </label>
                <div className="flex justify-center">
                  <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Phone Number" />
                </div>
              </div>
              <button type="submit" className=" w-full bg-[#2a4181] text-white py-2 px-4 rounded hover:bg-[#1E40AF]">
                Get OTP
              </button>
            </form>
          ) : (
            // Form nhập OTP
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-center">
                <h2 className="text-3xl font-semibold mb-4">Submit OTP</h2>
              </div>
              <div className="mb-4">
                <label className="flex justify-center text-gray-700 mb-5" htmlFor="otp">
                  Enter OTP to access into system
                </label>
                {/* <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter OTP"
                /> */}
              </div>
              <div className="flex justify-center w-full ">
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                 value={otp} // Set giá trị OTP từ state
                 onChange={setOtp} // Cập nhật state khi người dùng nhập
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              </div>
              
              <button type="submit" className="w-full bg-[#2a4181] text-white py-2 px-4 rounded hover:bg-[#1E40AF] mt-3">
                Submit
              </button>
            </form>
          )}

          <div className="flex items-center my-4">
            <span className="mx-2 text-gray-600">
              By clicking get OTP, you agree to our <br />
              <span className="underline ">Terms of Service</span> and <span className="underline ">Privacy Policy</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
