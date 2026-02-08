import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  IndianRupee,
  CreditCard,
  Smartphone,
  Plus,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
  orderId?: string;
}

interface PaymentMethod {
  id: string;
  type: "upi" | "bank" | "card";
  label: string;
  detail: string;
  icon: React.ElementType;
  isDefault: boolean;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    type: "credit",
    amount: 650,
    description: "E-Waste Pickup",
    date: "Feb 8, 2026",
    status: "completed",
    orderId: "SX-2026-002",
  },
  {
    id: "t2",
    type: "credit",
    amount: 410,
    description: "Metal & Paper Pickup",
    date: "Feb 5, 2026",
    status: "completed",
    orderId: "SX-2026-001",
  },
  {
    id: "t3",
    type: "debit",
    amount: 200,
    description: "Withdrawal to UPI",
    date: "Feb 3, 2026",
    status: "completed",
  },
  {
    id: "t4",
    type: "credit",
    amount: 320,
    description: "Plastic & Glass Pickup",
    date: "Jan 28, 2026",
    status: "completed",
    orderId: "SX-2026-000",
  },
  {
    id: "t5",
    type: "credit",
    amount: 180,
    description: "Newspaper & Cardboard",
    date: "Jan 20, 2026",
    status: "pending",
  },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm1",
    type: "upi",
    label: "Google Pay",
    detail: "user@okaxis",
    icon: Smartphone,
    isDefault: true,
  },
  {
    id: "pm2",
    type: "bank",
    label: "SBI Account",
    detail: "••••4521",
    icon: CreditCard,
    isDefault: false,
  },
];

const Wallet = () => {
  const [txFilter, setTxFilter] = useState<"all" | "credit" | "debit">("all");

  const balance = MOCK_TRANSACTIONS.reduce((sum, tx) => {
    if (tx.status !== "completed") return sum;
    return tx.type === "credit" ? sum + tx.amount : sum - tx.amount;
  }, 0);

  const totalEarned = MOCK_TRANSACTIONS.filter(
    (tx) => tx.type === "credit" && tx.status === "completed"
  ).reduce((sum, tx) => sum + tx.amount, 0);

  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    if (txFilter === "all") return true;
    return tx.type === txFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Wallet" />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="gradient-primary overflow-hidden mb-6">
            <CardContent className="p-6">
              <p className="text-white/80 text-sm mb-1">Available Balance</p>
              <div className="flex items-center gap-1 mb-4">
                <IndianRupee className="h-7 w-7 text-white" />
                <span className="text-3xl font-heading font-bold text-white">
                  {balance.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-xl flex-1 backdrop-blur-sm"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1.5" />
                  Withdraw
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl flex-1"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Total Earned
              </p>
              <div className="flex items-center justify-center gap-1">
                <IndianRupee className="h-4 w-4 text-primary" />
                <span className="font-heading font-bold text-lg text-foreground">
                  {totalEarned.toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Pickups Done
              </p>
              <span className="font-heading font-bold text-lg text-foreground">
                {MOCK_TRANSACTIONS.filter((t) => t.type === "credit").length}
              </span>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">
              Payment Methods
            </h3>
          </div>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((pm) => {
              const Icon = pm.icon;
              return (
                <Card key={pm.id} className="border-border">
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {pm.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pm.detail}
                        </p>
                      </div>
                    </div>
                    {pm.isDefault && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary"
                      >
                        Default
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* Transaction History */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">
              Transactions
            </h3>
            <div className="flex gap-1">
              {(["all", "credit", "debit"] as const).map((f) => (
                <Button
                  key={f}
                  variant={txFilter === f ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs rounded-full capitalize px-3",
                    txFilter === f && "gradient-primary text-primary-foreground"
                  )}
                  onClick={() => setTxFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
              >
                <Card className="border-border">
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center",
                          tx.type === "credit"
                            ? "bg-primary/10"
                            : "bg-destructive/10"
                        )}
                      >
                        {tx.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-primary" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {tx.date}
                          </p>
                          {tx.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 text-accent border-accent/30"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "font-heading font-semibold text-sm",
                        tx.type === "credit"
                          ? "text-primary"
                          : "text-destructive"
                      )}
                    >
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Wallet;
