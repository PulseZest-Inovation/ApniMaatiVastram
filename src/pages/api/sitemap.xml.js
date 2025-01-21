import  {fetchProducts} from '../../utils/fetchProducts'
import  {fetchCollections} from '../../utils/fetchCollection'


export default async function handler(req, res) {
  const baseUrl = "https://apnimaativastram.com";

  try {
    // Fetch collections dynamically
    const collections = await fetchCollections();

    // Generate URLs for collections and their products dynamically
    const urls = [];

    // Loop over each collection to get its URL and its products
    for (const collection of collections) {
      // Add collection URL
      urls.push(`${baseUrl}/collection/${collection.slug}`);

      // Fetch products for the current collection
      const products = await fetchProducts(collection.slug);

      // Add product URLs for each collection
      for (const product of products) {
        urls.push(`${baseUrl}/collection/${collection.slug}/product/${product.slug}`);
      }
    }

    // Generate the sitemap XML content
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map((url) => {
          return `
        <url>
          <loc>${url}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>`;
        })
        .join("")}
    </urlset>`;

    // Set the headers for the XML response
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap.");
  }
}
