import { auth } from '@/config/FirebaseConfig';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useEffect, useState, useTransition } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input } from '@nextui-org/react';
import { message, Typography } from 'antd';
import { FaWhatsapp } from 'react-icons/fa';
import { createAccount } from '@/service/createAccount';

interface PheneLoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function PhoneLoginModel({ isOpen, onOpenChange }: PheneLoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [userName, setUserName] = useState(''); // State to hold the user's name

  useEffect(() => {
    if (!isOpen) return;

    const recaptchaVerifierInstance = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      { size: 'invisible' }
    );
    setRecaptchaVerifier(recaptchaVerifierInstance);

    return () => {
      recaptchaVerifierInstance.clear();
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const requestOtp = async (
    e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    if (e) {
      e.preventDefault();
    }
  
    setResendCountdown(60);
  
    startTransition(async () => {
      setError('');
      if (!recaptchaVerifier) {
        return setError('RecaptchaVerifier is not initialized.');
      }
  
      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          `+91${phoneNumber}`,
          recaptchaVerifier
        );
        setConfirmationResult(confirmationResult);
        setSuccess('OTP sent successfully!');
        message.success('OTP sent successfully');
      } catch (err: unknown) {
        setResendCountdown(0);
        setError('Failed to send OTP. Please try again.');
        console.error(err);
      }
    });
  };
  

  const verifyOtp = async () => {
    if (!confirmationResult) {
      setError('Please request the OTP first.');
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      // Pass the user's name as an argument to createAccount
      await createAccount(userName);
      message.success("OTP Verified Successfully");
      onOpenChange(false); // Close the modal on success
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError('Failed to verify OTP. Please check the OTP.');
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="text-center justify-center">Welcome Back</ModalHeader>
        <ModalBody className="flex justify-center">
          <div className="bg-white p-2rounded-lg relative">
            {!confirmationResult ? (
              <form onSubmit={requestOtp}>
                <Typography className="text-center mb-2 text-1xl font-bold flex items-center justify-center">
                  Enter your 10 Digit <FaWhatsapp className="text-green-500 ml-1 mr-1" /> Number
                </Typography>

                {/* User Name Input */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="userName">Enter Name</label>
                  <Input
                    id="userName"
                    className="w-full"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Phone Number Input */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phoneNumber">Enter Phone Number</label>
                  <Input
                    id="phoneNumber"
                    className="w-full"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    prefix="+91 "
                    maxLength={10}
                  />
                </div>

                <Button
                disabled={!phoneNumber || !userName || isPending || resendCountdown > 0}
                onPress={()=>{
                  requestOtp();
                }}
                className={`w-full ${!phoneNumber || !userName || isPending || resendCountdown > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-400 hover:bg-orange-300 cursor-pointer'} font-bold`}
                variant="ghost"
              >
                {resendCountdown > 0
                  ? `Resend OTP in ${resendCountdown}`
                  : isPending
                  ? 'Sending OTP'
                  : 'Send OTP'}
              </Button>

              </form>
            ) : (
              <>
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button onPress={verifyOtp} className="w-full mt-5 bg-green-400 text-white font-bold cursor-pointer">
                  Verify OTP
                </Button>
              </>
            )}
            <div className="text-center mt-4">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </div>
            <div id="recaptcha-container" />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
