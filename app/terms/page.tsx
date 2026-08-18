import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using Normal Tools and its browser-based utilities.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width legal-main">
        <header className="legal-header">
          <p className="eyebrow">Normal Tools</p>
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last updated August 17, 2026</p>
        </header>

        <section className="legal-section" aria-labelledby="terms-acceptance">
          <h2 id="terms-acceptance">Acceptance of these terms</h2>
          <p>
            By accessing or using Normal Tools, you agree to these Terms of
            Service and the <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use the
            site. You must be legally able to agree to these terms in the place
            where you live.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="terms-service">
          <h2 id="terms-service">What Normal Tools provides</h2>
          <p>
            Normal Tools provides free browser-based calculators, converters,
            generators, checkers, file processors, tests, and other utilities.
            Most tools run entirely on your device. The Domain Age Checker sends
            the domain you request to a public RDAP service. Normal Tools does
            not save tool inputs, files, or results.
          </p>
          <p>
            Tools may be changed, corrected, limited, suspended, or removed at
            any time. Availability is not guaranteed, and a tool may behave
            differently across browsers, devices, source files, or operating
            systems.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="terms-results">
          <h2 id="terms-results">Results, estimates, and advice</h2>
          <p className="legal-callout">
            Tool results are provided for general information and convenience.
            They may be incomplete, outdated, rounded, unsupported, or wrong.
            You are responsible for checking a result before relying on it.
          </p>
          <p>
            Normal Tools does not provide legal, tax, accounting, investment,
            medical, engineering, construction, electrical, safety, nutritional,
            or other professional advice. Platform fees, laws, codes, prices,
            product specifications, financial rates, and technical standards can
            change. Consult a qualified professional or authoritative source when
            a decision affects money, health, safety, legal rights, compliance,
            property, or equipment.
          </p>
          <p>
            File converters and generators can lose formatting, metadata,
            fidelity, or unsupported features. Keep an original copy and inspect
            output before replacing, publishing, printing, machining, building,
            sending, or uploading anything.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="terms-use">
          <h2 id="terms-use">Your responsibilities</h2>
          <ul>
            <li>Use the site only for lawful purposes.</li>
            <li>Do not use a tool with content or files you have no right to process.</li>
            <li>Do not interfere with the site, bypass limits, introduce malicious code, or attempt unauthorized access.</li>
            <li>Do not rely on a random, generated, or estimated result where independent verification is required.</li>
            <li>Protect your own device, browser, files, backups, and network connection.</li>
          </ul>
        </section>

        <section className="legal-section" aria-labelledby="terms-third-party">
          <h2 id="terms-third-party">Third-party services and links</h2>
          <p>
            The site may link to or communicate with third-party services,
            including RDAP providers, Google Analytics, advertising providers,
            and linked reference pages. Third-party services have their own
            terms and privacy practices. Normal Tools does not control and is not
            responsible for those services, their availability, or their content.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="terms-ownership">
          <h2 id="terms-ownership">Site ownership and permitted use</h2>
          <p>
            Normal Tools and its original site design, text, and code are
            protected by applicable intellectual-property laws. You may use the
            tools and their ordinary outputs for personal or commercial work,
            subject to any rights that apply to the material you provide. These
            terms do not transfer ownership of the site or its source code.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="terms-warranty">
          <h2 id="terms-warranty">No warranties</h2>
          <p>
            To the fullest extent permitted by law, Normal Tools is provided
            &quot;as is&quot; and &quot;as available,&quot; without warranties of accuracy,
            reliability, fitness for a particular purpose, merchantability,
            non-infringement, availability, compatibility, or security. Normal
            Tools does not promise that the site will be uninterrupted or free
            from errors or harmful components.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="terms-liability">
          <h2 id="terms-liability">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Normal Tools and its owner,
            operators, contributors, and service providers will not be liable for
            any indirect, incidental, special, consequential, exemplary, or
            punitive damages, or for lost profits, revenue, data, files,
            opportunities, or business, arising from use of or inability to use
            the site or reliance on a tool result. Where liability cannot be
            excluded, it will be limited to the greater of the amount you paid to
            use Normal Tools during the prior 12 months or 10 US dollars.
          </p>
          <p>
            Some jurisdictions do not allow certain warranty exclusions or
            liability limits. In those places, these provisions apply only to
            the extent allowed by law.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="terms-changes">
          <h2 id="terms-changes">Changes and severability</h2>
          <p>
            These terms may be updated as the site changes. The revision date at
            the top identifies the current version. Continued use after an update
            means you accept the revised terms. If one provision is found
            unenforceable, the remaining provisions continue to apply.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
