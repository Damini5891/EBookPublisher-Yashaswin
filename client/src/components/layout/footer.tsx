import { Link } from "wouter";
import { APP_NAME, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";
import logoimage from "../../../../attached_assets/logoimage.svg";
import logoname from "../../../../attached_assets/logoname.svg";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <img
                src={logoimage}
                alt="Logo Image"
                style={{ width: "50px", height: "80px" }}
              />
              <img
                src={logoname}
                alt="Logo Name"
                style={{ width: "200px", height: "150px" }}
              />
            </Link>
            <p className="text-neutral-400 mb-4">
              Empowering authors to publish professionally and reach readers
              worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href={SOCIAL_LINKS.facebook}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/bookstore"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Bookstore
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Publishing Guide
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Marketing Tips
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Author Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Copyright Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Author Agreement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Royalty Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              alt="Stripe"
              className="h-8"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
