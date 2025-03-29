import { Link } from "wouter";
import { APP_NAME, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 2H5C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 8H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 2V22" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="ml-2 text-xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>
                {APP_NAME}
              </span>
            </Link>
            <p className="text-neutral-400 mb-4">
              Empowering authors to publish professionally and reach readers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href={SOCIAL_LINKS.facebook} className="text-neutral-400 hover:text-white transition-colors" aria-label="Facebook">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href={SOCIAL_LINKS.twitter} className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href={SOCIAL_LINKS.instagram} className="text-neutral-400 hover:text-white transition-colors" aria-label="Instagram">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href={SOCIAL_LINKS.linkedin} className="text-neutral-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-neutral-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/bookstore" className="text-neutral-400 hover:text-white transition-colors">Bookstore</Link></li>
              <li><Link href="/about" className="text-neutral-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Author Dashboard</Link></li>
              <li><Link href="/services" className="text-neutral-400 hover:text-white transition-colors">Publishing Guide</Link></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Marketing Tips</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Author Community</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Copyright Policy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Author Agreement</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Royalty Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
