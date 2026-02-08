import { Leaf, Recycle, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Recycle className="h-5 w-5 text-primary" />
          <span className="font-heading font-semibold">ScrapX</span>
          <Leaf className="h-5 w-5 text-primary" />
        </div>

        <p className="text-center text-sm text-secondary-foreground/80 mb-4">
          Making scrap selling transparent, intelligent, and environmentally
          responsible.
        </p>

        <div className="flex items-center justify-center gap-1 text-xs text-secondary-foreground/60">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-accent fill-accent" />
          <span>for a greener planet</span>
        </div>

        <p className="text-center text-xs text-secondary-foreground/40 mt-4">
          © {new Date().getFullYear()} ScrapX. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
