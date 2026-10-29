import { CatalogManager } from "@/components/dashboard/catalog-manager";
import { PageTitle } from "@/components/dashboard/dashboard-shell";
import { getI18n } from "@/i18n/server";
import { countByCategory, countByCity, listCategories, listCities } from "@/lib/queries";

export default async function CatalogPage() {
  const { t, lang } = await getI18n();
  return (
    <>
      <PageTitle title={t.admin.catalogTitle} description={t.admin.catalogText} />
      <CatalogManager
        cities={listCities().map((c) => ({ ...c, count: countByCity(c.slug) }))}
        categories={listCategories().map((c) => ({ ...c, count: countByCategory(c.slug) }))}
        t={t.admin.catalog}
        lang={lang}
        businessesLabel={t.common.businesses}
      />
    </>
  );
}
