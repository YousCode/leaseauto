export default function BrandLogo({ brand }: { brand: string }) {
  return (
    <img
      src={`/logos/${brand.toLowerCase()}.svg`}
      alt={brand}
      className="h-6 object-contain inline-block ml-2"
    />
  );
}
