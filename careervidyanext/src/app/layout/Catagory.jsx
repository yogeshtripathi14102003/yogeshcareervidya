import { Link } from "react-router-dom";
const Category = ({ title, items }) => {
  return (
    <div className="flex-1 space-y-3">
      <h3 className="text-lg font-semibold border-b-2 pb-1 border-blue-900 text-blue-900">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.href || "#"}
              className="flex items-center space-x-3 hover:text-blue-600 transition"
            >
              {/* <div className="rounded-full bg-slate-200"> */}
              {/* <span className="text-orange-500">{item.icon}</span> */}
              <img src={item.icon} alt="" className="h-10 w-10" />
              {/* </div> */}
              <span className="text-sm text-gray-700">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
