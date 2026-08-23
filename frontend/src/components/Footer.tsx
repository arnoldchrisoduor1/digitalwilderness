import Link from "next/link";
import { LogoMark } from "@/components/graphics/LogoMark";
import { affiliateNote, footerCompany, footerConnect, footerLab, siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <LogoMark className="mark" />
              {siteConfig.name}
            </Link>
            <p>{siteConfig.description}</p>
            <p className="footer-note">{affiliateNote}</p>
          </div>

          <div className="footer-col">
            <h5>Lab</h5>
            {footerLab.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            {footerCompany.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h5>Connect</h5>
            {footerConnect.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Digital Wilderness.</span>
          <span>{siteConfig.coordinates.city}</span>
        </div>
      </div>
    </footer>
  );
}
