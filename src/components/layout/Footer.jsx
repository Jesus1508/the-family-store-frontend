const Footer = () => (
  <footer className="bg-brand-dark text-cream/70 text-sm py-8 mt-16">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-gold font-serif font-semibold text-base mb-1">The Family Store</p>
      <p>Moda, calzado, bolsos y belleza para toda la familia.</p>
      <p className="mt-4 text-cream/50">&copy; {new Date().getFullYear()} The Family Store</p>
    </div>
  </footer>
);

export default Footer;
