import { Hero } from '@/components/home/hero'
import { ShopByCategory } from '@/components/home/shop-by-category'
import { Bestsellers } from '@/components/home/bestsellers'
import { SpecialOffers } from '@/components/home/special-offers'
import { FeaturedCollections } from '@/components/home/featured-collections'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { Testimonials } from '@/components/home/testimonials'
import { InstagramGallery } from '@/components/home/instagram-gallery'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopByCategory />
      <Bestsellers />
      <SpecialOffers />
      <FeaturedCollections />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
    </>
  )
}
