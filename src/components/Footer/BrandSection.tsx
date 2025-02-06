import Image from "next/image";
import Link from "next/link";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

type FooterData = {
  whatsappNumber: string;
  email: string;
};

type BrandSectionProps = {
  footerData: FooterData | null;
};

const BrandSection = ({ footerData }: BrandSectionProps) => {
  return (
    <div className="w-full md:w-1/3">
      <Link href={ApplicationConfig.baseUrl} className="flex items-center">
        <Image
          src={ApplicationConfig.applicationLogo}
          height={200}
          width={200}
          alt={ApplicationConfig.applicationName}
        />
      </Link>
      <p className="mt-4 text-gray-600 text-justify leading-relaxed tracking-wide font-bold w-100">
      Welcome to Apni Maati Vastram! We are a trusted fashion brand that harmoniously blends 
        tradition with contemporary flair—perfect for work and celebrations. Our exquisite creations, 
        from ready-to-wear and pre-pleated sarees to traditional drapes, along with stylish blouses & accessories, 
        elevate everyday elegance, comfort, and empowerment.
      </p>
      <ul className="mt-4 space-y-2 text-gray-600">
        <li className="flex items-center space-x-2">
          <FaWhatsapp className="text-green-500" />
          <span>{footerData?.whatsappNumber}</span>
        </li>
        <li className="flex items-center space-x-2">
          <MdEmail className="text-blue-500" />
          <span>{footerData?.email}</span>
        </li>
      </ul>
    </div>
  );
};

export default BrandSection;
