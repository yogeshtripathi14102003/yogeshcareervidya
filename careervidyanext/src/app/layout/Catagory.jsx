import Link from "next/link";
import Image from "next/image";

const Category = ({ title, items }) => {
  return (
    <div className="flex-1 space-y-4">
      {/* Title with consistent branding */}
      <h3 className="text-lg font-bold border-b-2 pb-2 border-[#05347f] text-[#05347f]">
        {title}
      </h3>
      
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx}>
            <Link
              href={item.href || "#"}
              className="flex items-center space-x-3 group transition-all duration-200"
            >
              {/* Optimized Next.js Image Container */}
              <div className="relative h-10 w-10 shrink-0 transition-transform group-hover:scale-110">
                <Image
                  src={item.icon}
                  alt={item.label}
                  fill
                  className="object-contain"
                />
              </div>
              
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;