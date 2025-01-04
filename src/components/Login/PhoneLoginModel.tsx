import { auth } from '@/config/FirebaseConfig';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { FormEvent, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { message, Typography } from 'antd';
import { FaWhatsapp } from 'react-icons/fa';

interface PheneLoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function PhoneLoginModel({ isOpen, onOpenChange }: PheneLoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');  // Initially empty, will add +91 to it
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const Router =useRouter()

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

  const requestOtp = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setResendCountdown(60);

    startTransition(async () => {
      setError('');
      if (!recaptchaVerifier) {
        return setError('RecaptchaVerifier is not initialized.');
      }

      try {
        const confirmationResult = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, recaptchaVerifier);  // Prefixing with +91
        setConfirmationResult(confirmationResult);
        setSuccess('OTP sent successfully!');
        message.success("OTP send Successfully")
      } catch (err: any) {
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
      message.success("OTP Verfied Successfully")
      onOpenChange(false); // Close the modal on success
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError('Failed to verify OTP. Please check the OTP');
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="text-center">Welcome Back</ModalHeader>
        <ModalBody className="flex justify-center">
          <div className="bg-white p-6 rounded-lg relative">

            {!confirmationResult ? (
              <form onSubmit={requestOtp}>
                <Typography className="text-center mb-2 text-1xl font-bold flex items-center justify-center">
                Enter your 10 Digit <FaWhatsapp className="text-green-500 ml-1 mr-1" />  Number
              </Typography>
                <Input
                  className="w-full mb-4"
                  type="tel"  
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  prefix="+91 "  // Pre-fills the input with +91
                  maxLength={10}  // Restricting input length after +91
                />
             
                <Button
                  disabled={!phoneNumber || isPending || resendCountdown > 0}
                  onClick={requestOtp}
                  className="w-full"
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
                <Button onClick={verifyOtp} className="w-full mt-5" variant="light">
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
