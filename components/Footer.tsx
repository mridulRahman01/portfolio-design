import type { FooterContent, SocialItem } from '@/lib/defaults';
import { SocialIconLinks } from '@/components/SocialIcons';
import { ContactForm } from '@/components/ContactForm';

export function Footer({ data, socials }: { data: FooterContent; socials: SocialItem[] }) {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#home" className="logo"><span className="s">A</span><span className="a">H</span></a>
            <p className="bio">{data.bio}</p>
            <ul className="footer-contact">
              <li>
                <a href={`mailto:${data.contactEmail}`}>{data.contactEmail}</a>
              </li>
              <li>{data.location}</li>
            </ul>
            <div className="footer-socials">
              <SocialIconLinks socials={socials} />
            </div>
          </div>

          <div>
            <h4>Navigate</h4>
            <ul className="footer-links">
              {['Home', 'About', 'Services', 'Portfolio', 'Blog'].map(l => (
                <li key={l}><a href={`#${l === 'Portfolio' ? 'cases' : l.toLowerCase()}`}>{l}</a></li>
              ))}
            </ul>
          </div>

          <div className="news">
            <h4>Start a Conversation</h4>
            <p>Tell me about your offer — I reply to every serious inquiry within 24 hours.</p>
            <ContactForm />
          </div>
        </div>

        <div className="footer-bottom">
          <div>{data.copyright}</div>
          <div>Crafted with <span className="heart">♥</span> in {data.location}</div>
        </div>
      </div>
    </footer>
  );
}
