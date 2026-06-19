import { ScrollSequence } from '@/components/ScrollSequence';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Cases } from '@/components/Cases';
import { Results } from '@/components/Results';
import { Skills } from '@/components/Skills';
import { Tools } from '@/components/Tools';
import { Testimonials } from '@/components/Testimonials';
import { Blog } from '@/components/Blog';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import {
  getHero, getAbout, getServices, getCases, getTestimonials,
  getSkillGroups, getSocials, getFooter, getCta, getLatestPosts, getResults, getIntro, getCv,
} from '@/lib/content';

// ISR: rebuild at most once per minute; server actions also revalidate on save
export const revalidate = 60;

export default async function Home() {
  const [hero, about, services, cases, testimonials, skillGroups, socials, footer, cta, posts, results, intro, cv] =
    await Promise.all([
      getHero(), getAbout(), getServices(), getCases(), getTestimonials(),
      getSkillGroups(), getSocials(), getFooter(), getCta(), getLatestPosts(3), getResults(), getIntro(), getCv(),
    ]);

  return (
    <>
      {intro.enabled && <ScrollSequence />}
      <div className="wrap">
        <Hero data={hero} socials={socials} cvUrl={cv.url} />
        <About data={about} />
        <Services items={services} />
        <Cases items={cases} />
        <Results data={results} />
        <Skills groups={skillGroups} />
        <Tools />
        <Testimonials items={testimonials} />
        <Blog posts={posts} />
        <CTA data={cta} />
        <Footer data={footer} socials={socials} />
      </div>
    </>
  );
}
