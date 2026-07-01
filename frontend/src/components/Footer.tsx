import {
  footerCompany,
  footerConnect,
  footerStudio,
  siteConfig,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="logo">
              <span className="dot" />
              {siteConfig.name}
            </a>
            <p>{siteConfig.description}</p>
          </div>

          <div className="footer-col">
            <h5>Studio</h5>
            {footerStudio.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            {footerCompany.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
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
          <span>
            © 2026 Digital Wilderness. <span className="accent">Built in the wild.</span>
          </span>
          <span>
            LAT <span className="accent">{siteConfig.coordinates.lat}</span> · LON{" "}
            <span className="accent">{siteConfig.coordinates.lon}</span> · {siteConfig.coordinates.city}
          </span>
        </div>
      </div>
    </footer>
  );
}
