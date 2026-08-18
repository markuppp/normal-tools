import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Normal Tools handles tool data, analytics, cookies, and advertising.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-width legal-main">
        <header className="legal-header">
          <p className="eyebrow">Normal Tools</p>
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated August 17, 2026</p>
        </header>

        <section className="legal-section" aria-labelledby="privacy-summary">
          <h2 id="privacy-summary">The short version</h2>
          <p className="legal-callout">
            Normal Tools does not save the content you enter into tools or the
            results those tools produce. Most tools do their work entirely in
            your browser. Website analytics, when enabled, are separate from
            tool contents and are described below.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="tool-data">
          <h2 id="tool-data">Tool inputs, files, and results</h2>
          <p>
            Calculators, converters, generators, checkers, text utilities, file
            processors, and hardware tests run on your device using browser
            code. Normal Tools does not operate a database that receives or
            stores the values, text, files, filenames, or results used in these
            tools. Files you download are created by your browser.
          </p>
          <p>
            The Domain Age Checker is the exception to local-only processing.
            When you run that tool, your browser sends the domain name you
            entered to the public RDAP service at rdap.org and receives public
            registration data in response. Normal Tools does not save the query
            or response. The RDAP provider receives the request directly and may
            process technical request data, including your IP address, under its
            own practices.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="vercel-analytics">
          <h2 id="vercel-analytics">Vercel hosting and Web Analytics</h2>
          <p>
            Normal Tools may be hosted by Vercel. When you visit the site,
            Vercel may process technical request information needed to deliver,
            secure, and operate it, such as your IP address, requested URL,
            browser or device information, and request time, under the
            <a href="https://vercel.com/legal/privacy-notice"> Vercel Privacy Notice</a>.
          </p>
          <p>
            Normal Tools may also use Vercel Web Analytics to measure traffic
            and understand how the site is used. Web Analytics may record page
            views, timestamps, visited paths, filtered query parameters,
            referrers, approximate location, browser, operating system, device
            type, and custom events if those events are configured. Normal Tools
            does not intentionally include tool inputs, tool results, uploaded
            files, filenames, or other sensitive information in analytics events.
          </p>
          <p>
            Vercel states that Web Analytics does not use cookies. It identifies
            a visitor using a hash generated from the incoming request, resets
            that identifier each day, and reports anonymized, aggregated data
            rather than associating analytics records with an individual or IP
            address. Learn more in Vercel&apos;s
            <a href="https://vercel.com/docs/analytics/privacy-policy"> Web Analytics privacy documentation</a>.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="google-analytics">
          <h2 id="google-analytics">Google Analytics</h2>
          <p>
            Normal Tools may use Google Analytics to understand which pages are
            visited and how the site performs. When enabled, Google Analytics
            may use first-party cookies and collect page views, session data,
            approximate location, browser and device information, referrer data,
            and interactions with the site. Normal Tools does not intentionally
            send tool inputs, tool results, uploaded files, filenames, or account
            information to Google Analytics.
          </p>
          <p>
            Google receives an IP address as part of the network request and
            states that Google Analytics 4 does not log or store IP addresses.
            Google processes Analytics data to provide measurement reports.
            Learn more about <a href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites that use its services</a> and read the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.
          </p>
          <p>
            You can limit analytics through browser cookie controls or the
            <a href="https://tools.google.com/dlpage/gaoptout"> Google Analytics opt-out browser add-on</a>.
            Where consent is legally required, optional analytics cookies will
            be handled through an appropriate consent choice.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="advertising">
          <h2 id="advertising">Advertising</h2>
          <p>
            Normal Tools may add Google AdSense or a similar advertising service
            in the future. If advertising is enabled, Google and other ad vendors
            may place or read cookies, use device identifiers, or use web beacons
            to deliver, measure, limit, and protect ads. Depending on your region
            and choices, ads may be contextual or based on previous visits to
            this and other websites.
          </p>
          <p>
            You can manage Google ad personalization in
            <a href="https://adssettings.google.com/"> Google Ads Settings</a> and
            review industry opt-out choices at
            <a href="https://optout.aboutads.info/"> YourAdChoices</a>. Before
            serving personalized Google ads where required, Normal Tools will
            use the consent controls and consent-management platform required by
            applicable law and Google policy.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="cookies">
          <h2 id="cookies">Cookies and browser storage</h2>
          <p>
            The tools themselves do not need cookies to perform their main job,
            and Vercel Web Analytics does not use cookies. Google Analytics,
            advertising services, or future preference features may use cookies
            and similar technologies as described above. You can block or delete
            cookies in your browser, although doing so may limit those features
            if they are enabled.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="sharing-retention">
          <h2 id="sharing-retention">Sharing and retention</h2>
          <p>
            Normal Tools does not sell tool inputs, files, or results. Because
            those contents are not received by Normal Tools, Normal Tools does
            not retain them. Vercel, Google, or another enabled service may
            retain hosting, analytics, or advertising data according to that
            provider&apos;s terms, the site&apos;s configuration, and your consent choices.
            Information may also be disclosed when required by law or necessary
            to protect the site and its users.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="children-rights">
          <h2 id="children-rights">Children and privacy rights</h2>
          <p>
            Normal Tools is a general-audience utility site and is not directed
            to children under 13. Normal Tools does not knowingly collect
            personal information from children through tool inputs.
          </p>
          <p>
            Depending on where you live, you may have rights concerning personal
            data processed through analytics or advertising, including access,
            deletion, correction, objection, restriction, or withdrawal of
            consent. Browser controls and the provider links above offer direct
            ways to limit those services. These rights do not apply to tool
            contents that Normal Tools never receives or stores.
          </p>
        </section>

        <section className="legal-section" aria-labelledby="policy-changes">
          <h2 id="policy-changes">Changes to this policy</h2>
          <p>
            This policy may be updated when the site, its tools, or its service
            providers change. The date at the top will show the latest revision.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
