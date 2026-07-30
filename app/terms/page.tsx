import type { Metadata } from 'next'
import { LegalPage, Section } from '@/components/legal/legal-page'
import { BRAND_NAME, WHATSAPP_URL, TELEGRAM_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Terms & Conditions | ${BRAND_NAME}`,
  description: `The terms and conditions governing use of ${BRAND_NAME} and purchase of its products and services.`,
}

const EFFECTIVE_DATE = 'July 30, 2026'
const CONTACT_EMAIL = 'michaelogaje033@gmail.com'

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" effectiveDate={EFFECTIVE_DATE}>
      <p className="text-slate-600 leading-relaxed">
        These Terms & Conditions ("Terms") govern your access to and use of {BRAND_NAME} (the
        "Site"), including any products, custom builds, or services purchased or requested
        through it (together, the "Services"). By browsing the Site, messaging us on WhatsApp or
        Telegram to place an order, or otherwise using the Services, you agree to be bound by
        these Terms. If you do not agree, please do not use the Site or Services.
      </p>

      <Section id="who-we-are" title="1. Who We Are">
        <p>
          {BRAND_NAME} is operated by an independent Python and AI developer based in Nigeria,
          building and selling AI tools, automation systems, digital products, and custom
          software builds. References to "we," "us," or "our" mean {BRAND_NAME}; "you" means
          anyone using the Site or Services.
        </p>
      </Section>

      <Section id="eligibility" title="2. Eligibility">
        <p>
          You must be at least 18 years old, or the age of legal majority in your jurisdiction, to
          purchase products or enter into a custom build agreement with us. By using the Services
          you confirm that you meet this requirement and that any information you provide is
          accurate and complete.
        </p>
      </Section>

      <Section id="products" title="3. Products & Services">
        <p>The Site offers three categories of listings:</p>
        <ul>
          <li>
            <strong>Ready-to-buy products</strong> — pre-built digital tools, templates, or
            systems delivered as-is.
          </li>
          <li>
            <strong>Custom builds</strong> — software, bots, or automation systems built to your
            specification, scoped and priced individually.
          </li>
          <li>
            <strong>Ideas for sale</strong> — concepts, plans, or blueprints sold as intellectual
            property rather than finished software.
          </li>
        </ul>
        <p>
          Product descriptions, screenshots, and demos are provided in good faith to represent
          each product accurately, but minor variations between description and final delivery
          may occur. We reserve the right to modify, discontinue, or update any listing at any
          time without notice.
        </p>
      </Section>

      <Section id="ordering" title="4. Ordering, Pricing & Payment">
        <p>
          Orders are initiated by contacting us via{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{' '}
          or{' '}
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          . Final pricing, delivery timelines, and scope (for custom builds) are confirmed
          directly with you before payment is requested. Prices displayed on the Site are
          indicative and may be adjusted based on customization, urgency, or scope discussed
          during ordering.
        </p>
        <p>
          Payments are processed securely through Paystack. We do not collect or store your card
          or bank details — Paystack handles that directly and is subject to its own terms and
          security standards (including PCI-DSS compliance). Custom builds may require a deposit
          before work begins, with the balance due on or before delivery, as agreed at the time of
          order.
        </p>
      </Section>

      <Section id="delivery" title="5. Delivery">
        <p>
          Ready-to-buy products are typically delivered digitally (file, link, or access
          credentials) after payment is confirmed. Custom builds are delivered according to the
          timeline agreed with you at the start of the engagement. Delivery times are estimates;
          delays caused by scope changes, incomplete information from you, or circumstances
          outside our control are not treated as breach of these Terms.
        </p>
      </Section>

      <Section id="refunds" title="6. Refunds & Cancellations">
        <p>
          Because our products are digital and access or source files are transferred upon
          delivery, all sales are final once a product has been delivered, except where the
          product is materially defective, does not match its description, or fails to work as
          intended — in which case contact us within 7 days of delivery and we will repair,
          replace, or refund at our discretion.
        </p>
        <p>
          For custom builds, cancellation after work has started may forfeit part or all of any
          deposit paid, in proportion to work already completed, unless otherwise agreed in
          writing.
        </p>
      </Section>

      <Section id="ip" title="7. Intellectual Property">
        <p>
          Unless otherwise agreed in writing, we retain ownership of all underlying frameworks,
          reusable code libraries, and pre-existing tooling used to build any product. For
          ready-to-buy products and ideas for sale, you receive a license to use the product for
          your own business purposes; you may not resell, redistribute, or repackage it as your
          own without our written consent. For custom builds, ownership of the final deliverable
          transfers to you upon full payment, unless a different arrangement is agreed in writing
          before the engagement begins.
        </p>
        <p>
          All Site content — including branding, copy, graphics, and design — is owned by{' '}
          {BRAND_NAME} and may not be copied or reused without permission.
        </p>
      </Section>

      <Section id="acceptable-use" title="8. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the Services for any unlawful, fraudulent, or harmful purpose;</li>
          <li>
            Attempt to reverse-engineer, resell, or misrepresent our products as your own
            original work where a license does not permit it;
          </li>
          <li>Interfere with the security or normal operation of the Site;</li>
          <li>Use automated tools to scrape or extract content from the Site.</li>
        </ul>
      </Section>

      <Section id="third-party" title="9. Third-Party Services">
        <p>
          Ordering, communication, and payment rely on third-party platforms, including WhatsApp,
          Telegram, Paystack, and our scheduling and hosting providers. Your use of those
          platforms is also governed by their own terms and privacy policies, and we are not
          responsible for their availability, performance, or handling of your data beyond what is
          described in our{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </Section>

      <Section id="warranty" title="10. Disclaimer of Warranties">
        <p>
          The Services are provided "as is" and "as available." We do not guarantee that any
          product will be error-free, uninterrupted, or fit for every specific purpose beyond what
          was explicitly agreed at the time of order. To the fullest extent permitted by law, we
          disclaim all implied warranties, including merchantability and fitness for a particular
          purpose.
        </p>
      </Section>

      <Section id="liability" title="11. Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, {BRAND_NAME} shall not be liable for
          any indirect, incidental, special, or consequential damages, or for loss of profits,
          data, or business opportunity, arising from your use of the Services. Our total
          liability for any claim arising from a purchase is limited to the amount you actually
          paid for the product or service giving rise to the claim.
        </p>
      </Section>

      <Section id="changes" title="12. Changes to These Terms">
        <p>
          We may update these Terms from time to time to reflect changes in our products, legal
          requirements, or business practices. The "Effective date" above will be updated
          accordingly. Continued use of the Site or Services after changes are posted constitutes
          acceptance of the revised Terms.
        </p>
      </Section>

      <Section id="law" title="13. Governing Law">
        <p>
          These Terms are governed by the laws of the Federal Republic of Nigeria, without regard
          to conflict-of-law principles. Any dispute arising from these Terms or the Services will
          be subject to the exclusive jurisdiction of the courts of Nigeria.
        </p>
      </Section>

      <Section id="contact" title="14. Contact Us">
        <p>
          Questions about these Terms can be sent to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or via{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  )
}
