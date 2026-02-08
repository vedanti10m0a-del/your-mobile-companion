import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Edit2, 
  Package, 
  Wallet, 
  Star,
  Leaf,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      address: "123 Green Street, Eco City, 110001",
      isDefault: true,
    },
    {
      id: "2",
      label: "Office",
      address: "456 Corporate Park, Business Bay, 110002",
      isDefault: false,
    },
  ]);

  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    avatar: "",
  });

  const stats = {
    totalPickups: 24,
    totalEarnings: 4850,
    co2Saved: 156,
    rating: 4.8,
  };

  const quickLinks = [
    { icon: Package, label: "My Orders", path: "/orders", count: 3 },
    { icon: Wallet, label: "Wallet", path: "/wallet", balance: "₹1,250" },
  ];

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" showMenu />

      <main className="p-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-soft overflow-hidden">
            <div className="h-20 gradient-primary" />
            <CardContent className="pt-0 pb-6 -mt-10">
              <div className="flex items-end gap-4">
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-heading font-bold text-foreground">
                      {profile.name}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1 fill-accent text-accent" />
                      {stats.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Eco Warrior since 2024
                  </p>
                </div>
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        className="w-full gradient-primary"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.totalPickups}</p>
              <p className="text-xs text-muted-foreground">Pickups</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <Wallet className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">₹{stats.totalEarnings}</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <Leaf className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.co2Saved}kg</p>
              <p className="text-xs text-muted-foreground">CO₂ Saved</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Quick Access
          </h3>
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-soft cursor-pointer hover:shadow-medium transition-shadow"
                onClick={() => navigate(link.path)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.count && (
                      <Badge className="bg-accent text-accent-foreground">
                        {link.count}
                      </Badge>
                    )}
                    {link.balance && (
                      <span className="text-sm font-medium text-primary">
                        {link.balance}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Saved Addresses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Saved Addresses
            </h3>
            <Button variant="ghost" size="sm" className="text-primary">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          </div>
          {addresses.map((addr) => (
            <Card key={addr.id} className="border-0 shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mt-0.5">
                      <MapPin className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{addr.label}</span>
                        {addr.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {addr.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!addr.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Profile;
