"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp"; // Import đúng thư viện shadcn
import { InputOTPSlot } from "@/components/ui/input-otp";

const OtpPopup = ({ open, onClose, onSubmit }) => {
  const [otp, setOtp] = useState(""); // Lưu OTP nhập vào

  const handleChange = (value) => {
    console.log("OTP nhập vào:", value);
    setOtp(value);
  };

  const handleSubmit = () => {
    if (otp.length === 6) {
      console.log("Gửi OTP:", otp); // Debug xem có đúng giá trị không
      onSubmit(otp); // Gửi OTP nhập vào LoginPage
      onClose();
    } else {
      alert("Vui lòng nhập đủ 6 số OTP");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập mã OTP</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {/* Component OTP chuẩn của shadcn */}
          <InputOTP value={otp} onChange={handleChange} maxLength={6} className="flex gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-10 h-10 text-center text-xl border border-gray-300 rounded-md"
              />
            ))}
          </InputOTP>
          <Button onClick={handleSubmit} className="w-full">
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpPopup;
