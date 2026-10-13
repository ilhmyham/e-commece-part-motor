import { listProducts } from "@/server/queries/products";
import { getCategoryTree } from "@/server/queries/categories";
import { getVehicleTree } from "@/server/queries/vehicles";
import { listProductsParamsSchema } from "@/validators/catalog";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { FilterDialog } from "@/components/catalog/filter-dialog";
import { ProductGrid } from "@/components/catalog/product-grid";

export const instant = false;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  // Parse params from URL
  const rawParams = {
    categorySlug: searchParams.category ? (Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category) : undefined,
    q: searchParams.q ? (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) : undefined,
    variantId: searchParams.variant ? (Array.isArray(searchParams.variant) ? searchParams.variant[0] : searchParams.variant) : undefined,
    sort: searchParams.sort ? (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) : undefined,
    page: searchParams.page ? (Array.isArray(searchParams.page) ? parseInt(searchParams.page[0], 10) : parseInt(searchParams.page, 10)) : undefined,
    pageSize: 12,
  };

  const parsed = listProductsParamsSchema.safeParse(rawParams);
  const params = parsed.success ? parsed.data : {};

  // Fetch data
  const [products, categoryTree, vehicleTree] = await Promise.all([
    listProducts(params),
    getCategoryTree(),
    getVehicleTree(),
  ]);

  // Find variant name if selected
  let fitmentVariantName: string | undefined;
  if (params.variantId) {
    const variant = vehicleTree
      .flatMap((b) =>
        b.models.flatMap((m) =>
          m.variants.map((v) => ({ ...v, modelName: m.name }))
        )
      )
      .find((v) => v.id === params.variantId);
    if (variant) {
      fitmentVariantName = `${variant.modelName} ${variant.name}`;
    }
  }

  // Flatten category tree for filter
  const flatCategories = categoryTree.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    children: cat.children,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Produk</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - desktop only */}
        <div className="hidden lg:block">
          <FilterSidebar categories={flatCategories} vehicleTree={vehicleTree} />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Filter dialog - mobile only */}
          <div className="lg:hidden">
            <FilterDialog categories={flatCategories} vehicleTree={vehicleTree} />
          </div>

          {/* Products */}
          <ProductGrid
            products={products.items}
            total={products.total}
            page={products.page}
            pageSize={products.pageSize}
            fitmentVariantName={fitmentVariantName}
          />
        </div>
      </div>
    </div>
  );
}
