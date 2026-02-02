import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/products?category=${category.id}`}
        className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all duration-200"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-light flex items-center justify-center text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-200">
          {category.icon}
        </div>
        <span className="text-sm font-medium text-card-foreground text-center line-clamp-1">
          {category.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {category.product_count} items
        </span>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
