import Link from "next/link";

type Page = {
  slug: string;
  name: string;
};

type InstantLinksProps = {
  pages: Page[];
};

const InstantLinks = ({ pages }: InstantLinksProps) => {
  return (
    <div className="w-full md:w-1/4">
      <h3 className="text-lg font-semibold mb-4">Instant Links</h3>
      <ul className="space-y-2">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link href={`/${page.slug}`} className="hover:text-blue-400">
              {page.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstantLinks;
