import { HeroSection } from "@/widgets/hero-section/HeroSection";
import { HowToInstall } from "@/widgets/how-to-install/HowToInstall";
import { McpSection } from "@/widgets/mcp-section/McpSection";
import { BookmarkletCatalog } from "@/widgets/bookmarklet-catalog/BookmarkletCatalog";
import { Separator } from "@/shared/ui/separator";

export function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <HeroSection />
      <Separator className="mb-12" />
      <HowToInstall />
      <Separator className="mb-12" />
      <McpSection />
      <Separator className="mb-12" />
      <BookmarkletCatalog />
    </div>
  );
}
