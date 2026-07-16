const Footer = () => (
  <footer className="bg-neutral-900 text-neutral-400 text-sm py-8 mt-16">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-white font-semibold mb-1">The Family Store</p>
      <p>Moda, calzado, bolsos y belleza para toda la familia.</p>
      <p className="mt-4 text-neutral-500">&copy; {new Date().getFullYear()} The Family Store</p>
    </div>
  </footer>
);

export default Footer;
