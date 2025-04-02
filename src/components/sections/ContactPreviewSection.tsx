import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactPreviewSection = () => {
  return (
    <div className="w-full bg-black py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get In <span className="text-[#DA1212]">Touch</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about our vehicles or leasing options? Our team of
            automotive experts is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-900 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-6">
              Send Us a Message
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    className="bg-black border-gray-800 text-white"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    className="bg-black border-gray-800 text-white"
                  />
                </div>
              </div>
              <div>
                <Input
                  placeholder="Subject"
                  className="bg-black border-gray-800 text-white"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  className="bg-black border-gray-800 text-white min-h-[150px]"
                />
              </div>
              <Button className="bg-[#DA1212] hover:bg-[#B50F0F] text-white w-full md:w-auto px-8">
                Send Message
              </Button>
            </form>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-6">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                  <p className="text-gray-400">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-400">info@leaseauto.com</p>
                  <p className="text-gray-400">support@leaseauto.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Location</h4>
                  <p className="text-gray-400">123 Luxury Lane</p>
                  <p className="text-gray-400">Beverly Hills, CA 90210</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Business Hours</h4>
                  <p className="text-gray-400">Monday - Friday: 9am - 7pm</p>
                  <p className="text-gray-400">Saturday: 10am - 5pm</p>
                  <p className="text-gray-400">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPreviewSection;
