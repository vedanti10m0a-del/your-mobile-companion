import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown,
  HelpCircle,
  Package,
  Wallet,
  Camera,
  MapPin,
  CreditCard,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { icon: Package, label: "Orders & Pickup", color: "bg-blue-100 text-blue-600" },
    { icon: Camera, label: "AI Scan", color: "bg-purple-100 text-purple-600" },
    { icon: Wallet, label: "Payments", color: "bg-green-100 text-green-600" },
    { icon: MapPin, label: "Addresses", color: "bg-orange-100 text-orange-600" },
    { icon: CreditCard, label: "Wallet", color: "bg-pink-100 text-pink-600" },
    { icon: HelpCircle, label: "General", color: "bg-gray-100 text-gray-600" },
  ];

  const faqs: FAQ[] = [
    {
      id: "1",
      category: "Orders & Pickup",
      question: "How do I schedule a scrap pickup?",
      answer: "To schedule a pickup, go to the 'Book' tab in the bottom navigation. Enter your address, select the scrap categories you want to sell, choose a convenient date and time slot, and confirm your booking. A verified vendor will be assigned to collect your scrap.",
    },
    {
      id: "2",
      category: "Orders & Pickup",
      question: "Can I cancel or reschedule a pickup?",
      answer: "Yes, you can cancel or reschedule a pickup up to 2 hours before the scheduled time. Go to 'Orders', select the pickup you want to modify, and choose the appropriate option. Cancellations made less than 2 hours before may incur a small fee.",
    },
    {
      id: "3",
      category: "AI Scan",
      question: "How does the AI scrap scanner work?",
      answer: "Our AI scanner uses advanced image recognition to identify scrap materials. Simply tap 'Scan' on the home screen, point your camera at the scrap item, and take a photo. The AI will identify the material type, show current market rates, and provide recycling information.",
    },
    {
      id: "4",
      category: "Payments",
      question: "When will I receive payment for my scrap?",
      answer: "Payment is processed immediately after the vendor weighs and collects your scrap. The amount is credited to your ScrapX wallet within minutes. You can then transfer it to your bank account or UPI, which typically takes 1-2 business days.",
    },
    {
      id: "5",
      category: "Payments",
      question: "What payment methods are accepted?",
      answer: "We support UPI payments, direct bank transfers, and wallet balance. You can add and manage your payment methods in the Wallet section. All transactions are secure and encrypted.",
    },
    {
      id: "6",
      category: "General",
      question: "How are scrap prices determined?",
      answer: "Scrap prices are updated daily based on market rates from major recycling centers and metal exchanges. Prices may vary slightly based on quality and quantity. You can view current rates anytime in the 'Prices' section of the app.",
    },
    {
      id: "7",
      category: "Wallet",
      question: "How do I withdraw money from my wallet?",
      answer: "Go to your Wallet, tap 'Withdraw', select your preferred payment method (bank account or UPI), enter the amount, and confirm. Withdrawals are processed within 1-2 business days. Minimum withdrawal amount is ₹100.",
    },
    {
      id: "8",
      category: "Addresses",
      question: "Can I save multiple pickup addresses?",
      answer: "Yes, you can save multiple addresses in your Profile. Go to Profile > Saved Addresses to add, edit, or delete addresses. You can also set a default address for quick bookings.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contactOptions = [
    {
      icon: MessageCircle,
      label: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: Phone,
      label: "Call Us",
      description: "1800-SCRAPX (1800-727-279)",
      action: "Call Now",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Mail,
      label: "Email",
      description: "support@scrapx.com",
      action: "Send Email",
      color: "bg-accent text-accent-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Help & Support" showMenu />

      <main className="p-4 space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-0 bg-muted"
            />
          </div>
        </motion.div>

        {/* Quick Categories */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Browse by Category
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 shadow-soft cursor-pointer hover:shadow-medium transition-shadow"
                  >
                    <CardContent className="p-3 text-center">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2 ${cat.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-medium text-foreground">
                        {cat.label}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Frequently Asked Questions
          </h3>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-0">
                    <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                      <span className="font-medium text-foreground text-sm">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFaqs.length === 0 && (
                <div className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Contact Us
          </h3>
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${option.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{option.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {option.action}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Help;
