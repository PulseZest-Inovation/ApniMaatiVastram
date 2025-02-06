import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

type SocialMedia = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
};

type SocialMediaLinksProps = {
  socialMedia: SocialMedia;
};

const SocialMediaLinks = ({ socialMedia }: SocialMediaLinksProps) => {
  return (
    <div className="w-full sm:w-1/2 flex justify-end space-x-4">
      {socialMedia?.facebook && (
        <Link
          href={socialMedia.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-600 transition"
        >
          <FaFacebookF size={24} />
        </Link>
      )}
      {socialMedia?.instagram && (
        <Link
          href={socialMedia.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-800 transition"
        >
          <FaInstagram size={24} />
        </Link>
      )}
      {socialMedia?.twitter && (
        <Link
          href={socialMedia.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-400 transition"
        >
          <FaTwitter size={24} />
        </Link>
      )}
      {socialMedia?.linkedin && (
        <Link
          href={socialMedia.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-700 transition"
        >
          <FaLinkedin size={24} />
        </Link>
      )}
      {socialMedia?.youtube && (
        <Link
          href={socialMedia.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-red-600 transition"
        >
          <FaYoutube size={24} />
        </Link>
      )}
    </div>
  );
};

export default SocialMediaLinks;
