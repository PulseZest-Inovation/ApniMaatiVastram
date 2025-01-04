// import {auth} from '@/config/FirebaseConfig'
// import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import React, { FormEvent, useEffect, useState, useTransition } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

// interface OtpModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose }) => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState("");
//   const [resendCountdown, setResendCountdown] = useState(0);
//   const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
//   const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     if (!isOpen) return;

//     // Initialize reCAPTCHA only if the modal is open
//     const recaptchaVerifierInstance = new RecaptchaVerifier(
//       auth,
//       "recaptcha-container",
//       { size: "invisible" }
//     );
//     setRecaptchaVerifier(recaptchaVerifierInstance);

//     return () => {
//       recaptchaVerifierInstance.clear();
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (resendCountdown > 0) {
//       timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   const requestOtp = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // This ensures that the default form submission behavior is prevented
    
//     setResendCountdown(60);
  
//     startTransition(async () => {
//       setError("");
//       if (!recaptchaVerifier) {
//         return setError("RecaptchaVerifier is not initialized.");
//       }
  
//       try {
//         const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
//         setConfirmationResult(confirmationResult);
//         setSuccess("OTP sent successfully!");
//       } catch (err: any) {
//         setResendCountdown(0);
//         setError("Failed to send OTP. Please try again.");
//         console.error(err);
//       }
//     });
//   };
  

//   const verifyOtp = async () => {
//     if (!confirmationResult) {
//       setError("Please request the OTP first.");
//       return;
//     }

//     try {
//       await confirmationResult.confirm(otp);
//       onClose();  // Close the modal on success
//     } catch (error) {
//       console.error(error);
//       setError("Failed to verify OTP. Please check the OTP");
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity ${
//         isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//       }`}
//       style={{ transitionDuration: "0.3s" }}
//     >
//       <div className="bg-white p-6 rounded-lg w-96">
//         <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
//           &times;
//         </button>
//         {!confirmationResult ? (
//           <form onSubmit={requestOtp}>
//             <Input
//               className="text-black"
//               type="tel"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="Enter phone number"
//             />
//             <p className="text-xs text-gray-400 mt-2">Please enter number with the country code (e.g., +91)</p>
//             <Button
//               disabled={!phoneNumber || isPending || resendCountdown > 0}
//               onClick={requestOtp}
//               className="mt-5"
//               variant='ghost'
//             >
//               {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}` : isPending ? "Sending OTP" : "Send OTP"}
//             </Button>
//           </form>
//         ) : (
//           <>
//             <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
//               <InputOTPGroup>
//                 <InputOTPSlot index={0} />
//                 <InputOTPSlot index={1} />
//                 <InputOTPSlot index={2} />
//               </InputOTPGroup>
//               <InputOTPSeparator />
//               <InputOTPGroup>
//                 <InputOTPSlot index={3} />
//                 <InputOTPSlot index={4} />
//                 <InputOTPSlot index={5} />
//               </InputOTPGroup>
//             </InputOTP>
//             <Button onClick={verifyOtp} className="mt-5" variant='outline'>
//               Verify OTP
//             </Button>
//           </>
//         )}
//         <div className="text-center mt-4">
//           {error && <p className="text-red-500">{error}</p>}
//           {success && <p className="text-green-500">{success}</p>}
//         </div>
//         <div id="recaptcha-container" />
//       </div>
//     </div>
//   );
// };

// export default OtpModal;
