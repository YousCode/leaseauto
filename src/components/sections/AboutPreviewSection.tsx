import { Button } from "@/components/ui/button";

const AboutPreviewSection = () => {
  return (
    <div className="w-full bg-gray-900 py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Luxury Leasing <span className="text-[#DA1212]">Redefined</span>
            </h2>
            <p className="text-gray-400 mb-6">
              At LeaseAuto, we believe that luxury vehicle leasing should be as
              exceptional as the cars themselves. Our premium service is
              designed for discerning clients who demand the very best in
              automotive experiences.
            </p>
            <p className="text-gray-400 mb-8">
              With over 15 years of experience in the luxury automotive market,
              we've built relationships with the world's most prestigious
              manufacturers to bring you an unparalleled selection of vehicles
              at competitive rates.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-black p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  500+
                </div>
                <div className="text-white text-sm">Premium Vehicles</div>
              </div>
              <div className="bg-black p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  15+
                </div>
                <div className="text-white text-sm">Years Experience</div>
              </div>
              <div className="bg-black p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  24/7
                </div>
                <div className="text-white text-sm">Customer Support</div>
              </div>
              <div className="bg-black p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  5000+
                </div>
                <div className="text-white text-sm">Happy Clients</div>
              </div>
            </div>
            <Button className="bg-[#DA1212] hover:bg-[#B50F0F] text-white">
              Learn More About Us
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"
                alt="Luxury car showroom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-2/3 bg-black p-6 rounded-lg shadow-xl">
              <p className="text-white italic mb-4">
                "LeaseAuto provided me with the perfect vehicle for my needs,
                with exceptional service from start to finish."
              </p>
              <div className="flex items-center">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt="Customer"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-white font-medium">John Anderson</p>
                  <p className="text-gray-500 text-sm">CEO, Tech Innovations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPreviewSection;
