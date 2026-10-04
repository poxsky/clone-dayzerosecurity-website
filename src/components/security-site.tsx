"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { services, type ServiceId } from "@/lib/services";
import { QuoteDialog } from "@/components/quote-dialog";

function ServiceIcon({ name, className = "" }: { name: string; className?: string }) {
  return <i className={`service-icon ${name} ${className}`} aria-hidden="true" />;
}

export function SecuritySite() {
  const [activeService, setActiveService] = useState<ServiceId>("pentestingservice");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const service = services.find((item) => item.id === activeService)!;

  useEffect(() => {
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 200);
      if (Math.abs(y - lastScroll) > 5) {
        setHeaderHidden(y > 100 && y > lastScroll);
        lastScroll = y;
      }
    };
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      const match = services.find((item) => item.id === hash);
      if (match) {
        setActiveService(match.id);
        window.requestAnimationFrame(() => {
          document.getElementById("services")?.scrollIntoView({ behavior: "instant", block: "start" });
        });
      }
    };
    onHashChange();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  function selectService(id: ServiceId) {
    setActiveService(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % services.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + services.length) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault();
    selectService(services[next].id);
    tabsRef.current[next]?.focus();
  }

  return (
    <>
      <a className="skip-link" href="#services">Skip to services</a>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}${headerHidden ? " is-hidden" : ""}`}>
        <a className="brand" href="#top" aria-label="0day Security home">0day Security</a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <canvas id="fluid-canvas" className="fluid-canvas" aria-hidden="true" />
          <div className="hero-text">
            <h1 id="hero-title">We break it<br />before they do.</h1>
            <p className="hero-subtitle">Offensive security specialists</p>
          </div>
          <a href="#services" className="scroll-down" aria-label="Explore our services">
            <i className="ti-mouse" aria-hidden="true" />
          </a>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="services-heading"><h2 id="services-title">Services</h2></div>
          <div className="service-tabs" role="tablist" aria-label="Security services">
            {services.map((item, index) => (
              <button
                type="button"
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={activeService === item.id}
                aria-controls={item.id}
                tabIndex={activeService === item.id ? 0 : -1}
                className={`service-tab${activeService === item.id ? " is-active" : ""}`}
                ref={(element) => { tabsRef.current[index] = element; }}
                onClick={() => selectService(item.id)}
                onKeyDown={(e) => handleTabKey(e, index)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="service-panels">
            {services.map((item) => {
              if (item.id !== activeService) return null;
              return (
                <div key={item.id} id={item.id} role="tabpanel" aria-labelledby={`tab-${item.id}`} className="service-panel is-active">
                  <div className="service-tiles">
                    {item.tiles.map((row, i) => (
                      <div className="tile-row" key={i}>
                        {row.map((tile) => (
                          <div className="service-tile" key={tile.label}>
                            <ServiceIcon name={tile.icon} />
                            <span>{tile.label}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="service-details">
                    <h3>{item.name}</h3>
                    {item.features.map((feature) => (
                      <div className="service-feature" key={feature.title}>
                        <ServiceIcon name={feature.icon} className="feature-icon" />
                        <div className="feature-copy">
                          <h4>{feature.title}</h4>
                          <p>{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer" id="quote">
        <div className="site-container">
          <div className="footer-columns">
            <div className="footer-brand-column">
              <a href="#top" className="footer-brand" aria-label="0day Security, back to top">0day Security</a>
              <p className="footer-tagline">Serious Security for<br />Serious Businesses.<br />From day zero.</p>
            </div>
            <div className="footer-contact">
              <h2><button className="quote-heading" type="button" onClick={() => setQuoteOpen(true)} aria-haspopup="dialog">Get a quote</button></h2>
              <p className="contact-intro"><button type="button" onClick={() => setQuoteOpen(true)}>Contact us for free scoping and a quote</button></p>
              <a className="contact-link" href="tel:+917309435990">+91 7309435990</a>
              <a className="contact-link" href="mailto:contact@0daysecurity.tech?subject=0day%20Security%20Quote%20Request">contact@0daysecurity.tech</a>
            </div>
          </div>
          <div className="footer-bottom"><p>© 2026 0day Security.</p></div>
        </div>
      </footer>

      <a href="#top" className={`back-to-top${scrolled ? " is-visible" : ""}`} aria-label="Back to top" tabIndex={scrolled ? 0 : -1}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
      </a>

      <QuoteDialog open={quoteOpen} service={service.value} onClose={() => setQuoteOpen(false)} />
      <Script src="/effects/purple-fluid.js" strategy="afterInteractive" />
    </>
  );
}
