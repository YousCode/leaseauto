import { FaCar } from "react-icons/fa";

const brandLogos: Record<string, any> = {
  audi: () => <span className="text-red-600 font-bold text-2xl">A</span>,
  bmw: () => <span className="text-blue-600 font-bold text-2xl">BMW</span>,
  mercedes: () => <span className="text-gray-600 font-bold text-2xl">★</span>,
  volkswagen: () => (
    <span className="text-blue-600 font-bold text-2xl">VW</span>
  ),
  peugeot: () => <span className="text-blue-600 font-bold text-2xl">🦁</span>,
  renault: () => <span className="text-yellow-600 font-bold text-2xl">◆</span>,
  citroen: () => <span className="text-red-600 font-bold text-2xl">▲</span>,
  toyota: () => <span className="text-red-600 font-bold text-2xl">T</span>,
  honda: () => <span className="text-red-600 font-bold text-2xl">H</span>,
  ford: () => <span className="text-blue-600 font-bold text-2xl">F</span>,
};

export default function BrandLogo({ brand }: { brand: string }) {
  const Logo =
    brandLogos[brand?.toLowerCase()] ||
    (() => <FaCar className="w-10 h-10 text-gray-600" />);
  return (
    <div className="w-10 h-10 flex items-center justify-center">
      <Logo />
    </div>
  );
}
