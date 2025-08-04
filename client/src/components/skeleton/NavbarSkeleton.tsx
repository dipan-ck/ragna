export default function NavbarSkeleton() {
    return (
      <nav className="flex justify-between items-center border-b border-[#2c2c2c] py-2 w-full px-4">
        {/* Logo */}
        <div className="w-[120px] h-[40px] rounded animate-shimmer"></div>
  
        {/* Search Box */}
        <div className="flex-grow flex justify-center px-8">
          <div className="w-full max-w-md h-[40px] rounded-xl animate-shimmer" />
        </div>
  
        {/* Right section (buttons + avatar) */}
        <div className="flex items-center gap-4">
          <div className="w-[90px] h-[32px] rounded-full animate-shimmer" />
          <div className="w-[80px] h-[32px] rounded-md animate-shimmer" />
          <div className="w-[32px] h-[32px] rounded-full animate-shimmer" />
          <div className="w-[40px] h-[40px] rounded-full animate-shimmer" />
        </div>
      </nav>
    );
  }
  

