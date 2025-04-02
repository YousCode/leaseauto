import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Car,
  RefreshCw,
  Wallet,
  Users,
  Briefcase,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            Lease<span className="text-[#DA1212]">Auto</span>
          </h3>
          <p className="text-gray-400 mb-4">
            Votre partenaire pour l'achat, la vente et le financement de
            véhicules à Épinay-sur-Seine.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#DA1212]">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#DA1212]">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#DA1212]">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-[#DA1212]">
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/vehicles"
                className="text-gray-400 hover:text-[#DA1212]"
              >
                Véhicules
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-gray-400 hover:text-[#DA1212]"
              >
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-400 hover:text-[#DA1212]">
                À Propos
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-[#DA1212]"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Nos Services</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Car size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">Achat de véhicules</span>
            </li>
            <li className="flex items-center">
              <RefreshCw size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">Reprise / vente</span>
            </li>
            <li className="flex items-center">
              <Wallet size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">Financement</span>
            </li>
            <li className="flex items-center">
              <Users size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">Accompagnement</span>
            </li>
            <li className="flex items-center">
              <Briefcase size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">Service Pro</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contactez-Nous</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Phone size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">+33 (0)1 23 45 67 89</span>
            </li>
            <li className="flex items-center">
              <Mail size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">contact@lease-auto.fr</span>
            </li>
            <li className="flex items-center">
              <MapPin size={16} className="mr-2 text-[#DA1212]" />
              <span className="text-gray-400">
                123 Avenue d'Épinay, 93800 Épinay-sur-Seine
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 px-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-gray-500 text-center">
            © {new Date().getFullYear()} Lease Auto. Tous droits réservés.
          </p>
          <p className="text-[#DA1212] font-bold text-center">
            Super Youssouph 👑
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
