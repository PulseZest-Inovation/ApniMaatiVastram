import Link from "next/link";

type Category = {
  slug: string;
  name: string;
};

type PopularCategoriesProps = {
  categories: Category[];
};

const PopularCategories = ({ categories }: PopularCategoriesProps) => {
  return (
    <div className="w-full md:w-1/4">
      <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
      <ul className="space-y-2">
        {categories.slice(0, 5).map((category) => (
          <li key={category.slug}>
            <Link
              href={`/collection/${category.slug}`}
              className="hover:text-blue-400"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularCategories;
