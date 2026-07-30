import type { Metadata } from 'next'
import { LegalPage, Section } from '@/components/legal/legal-page'
import { BRAND_NAME, WHATSAPP_URL, TELEGRAM_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND_NAME}`,
  description: `How ${BRAND_NAME} collects, uses, stores, and protects your personal data.`,
}

const EFFECTIVE_DATE = 'July 30, 2026'
const CONTACT_EMAIL = 'michaelogaje033@gmail.com'

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate={EFFECTIVE_DATE}>
      <p className="text-slate-600 leading-relaxed">
        This Privacy Policy explains how {BRAND_NAME} ("we," "us," "our") collects, uses,
        discloses, stores, and protects personal data when you visit our website, message us to
        place an order, book a call, or subscribe to our newsletter. We are committed to handling
        your data responsibly and in line with the Nigeria Data Protection Act (NDPA) 2023 and
        applicable data protection principles for visitors outside Nigeria.
      </p>

      <Section id="data-we-collect" title="1. Information We Collect">
        <p>We collect information in the following ways:</p>
        <ul>
          <li>
            <strong>Information you give us directly</strong> — your name, phone number, and any
            details you share when you message us on WhatsApp or Telegram to ask about or order a
            product; your email address and any details you provide when subscribing to our
            newsletter or booking a call through our scheduling link.
          </li>
          <li>
            <strong>Payment information</strong> — when you pay for a product, payment is
            processed by Paystack. Paystack collects your card, bank, or account details directly;
            we never see or store your full card number. We do receive confirmation of payment
            (amount, status, and a transaction reference) so we can fulfill your order.
          </li>
          <li>
            <strong>Order and communication history</strong> — records of the products you've
            inquired about or purchased, and our conversation history with you on WhatsApp or
            Telegram, kept so we can support you and fulfill orders.
          </li>
          <li>
            <strong>Automatically collected data</strong> — when you browse the Site, our hosting
            and analytics provider (Vercel Analytics) automatically collects limited technical
            data such as approximate location (country/region), device and browser type, pages
            viewed, and referring pages. This data is aggregated and does not directly identify
            you by name.
          </li>
        </ul>
      </Section>

      <Section id="how-we-use" title="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to inquiries and fulfill orders for products or custom builds;</li>
          <li>Process payments and prevent fraud, in conjunction with Paystack;</li>
          <li>Deliver purchased products and provide related support;</li>
          <li>Send newsletter content or follow-up communication you've opted into;</li>
          <li>Schedule and manage calls you've booked with us;</li>
          <li>Understand how visitors use the Site so we can improve it;</li>
          <li>Comply with legal, tax, or regulatory obligations.</li>
        </ul>
        <p>
          We do not sell your personal data, and we do not use it for purposes beyond those listed
          above without asking you first.
        </p>
      </Section>

      <Section id="legal-basis" title="3. Legal Basis for Processing">
        <p>
          Where applicable, we process your data on the basis of: your consent (e.g., subscribing
          to the newsletter or booking a call); the necessity of processing to perform a contract
          with you (e.g., fulfilling an order); and our legitimate interest in operating and
          improving the Site, provided this does not override your rights.
        </p>
      </Section>

      <Section id="sharing" title="4. How We Share Your Information">
        <p>We share personal data only with the following categories of third parties, and only as needed to operate the Services:</p>
        <ul>
          <li>
            <strong>Paystack</strong> — to process payments securely.
          </li>
          <li>
            <strong>WhatsApp / Telegram (Meta / Telegram FZ-LLC)</strong> — as the messaging
            platforms you use to contact us; your use of these apps is also subject to their own
            privacy policies.
          </li>
          <li>
            <strong>Scheduling provider</strong> — to manage call bookings made through our
            newsletter or contact pages.
          </li>
          <li>
            <strong>Vercel</strong> — our website hosting and analytics provider.
          </li>
          <li>
            <strong>Legal or regulatory authorities</strong> — where required by law, court order,
            or to protect our rights.
          </li>
        </ul>
        <p>
          We do not share your data with third parties for their own marketing purposes.
        </p>
      </Section>

      <Section id="storage" title="5. How We Store & Protect Your Information">
        <p>
          Order and communication records are kept within WhatsApp/Telegram and our own private
          records (such as order notes and email). Payment details are stored solely by Paystack
          under their PCI-DSS compliant infrastructure — not on our own systems. Website hosting
          and analytics data are stored by Vercel on secure cloud infrastructure, which may be
          located outside Nigeria; where this occurs, we rely on our providers' standard
          contractual and security safeguards to protect your data in transit and at rest.
        </p>
        <p>
          We take reasonable technical and organizational measures — including restricting access
          to personal data to only what is needed to fulfill orders and respond to inquiries — to
          protect your information against unauthorized access, loss, misuse, or alteration.
          However, no method of transmission or storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </Section>

      <Section id="retention" title="6. Data Retention">
        <p>
          We retain personal data only for as long as reasonably necessary to fulfill the purposes
          described in this Policy — for example, order and payment records are kept for as long
          as needed for accounting, tax, and dispute-resolution purposes, and newsletter contact
          details are kept until you unsubscribe or request deletion. When data is no longer
          needed, we take reasonable steps to delete or anonymize it.
        </p>
      </Section>

      <Section id="cookies" title="7. Cookies & Analytics">
        <p>
          The Site uses Vercel Analytics to understand aggregate traffic and usage patterns. This
          may involve lightweight tracking technologies (such as cookies or similar identifiers)
          to distinguish visits without personally identifying you. We do not use this data for
          advertising or to build individual profiles of visitors. You can control cookies through
          your browser settings; disabling them will not prevent you from using the Site, though
          some features may behave differently.
        </p>
      </Section>

      <Section id="rights" title="8. Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Request access to the personal data we hold about you;</li>
          <li>Request correction of inaccurate or incomplete data;</li>
          <li>Request deletion of your personal data, subject to legal or contractual retention needs;</li>
          <li>Object to or restrict certain processing, including newsletter communications;</li>
          <li>Withdraw consent at any time where processing is based on consent;</li>
          <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC) or your local data protection authority.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can unsubscribe from
          newsletter emails at any time using the link provided in those emails.
        </p>
      </Section>

      <Section id="children" title="9. Children's Privacy">
        <p>
          The Services are not directed at, and should not be used by, anyone under the age of 18.
          We do not knowingly collect personal data from children. If you believe a child has
          provided us with personal data, contact us and we will delete it.
        </p>
      </Section>

      <Section id="international" title="10. International Data Transfers">
        <p>
          Because we rely on providers such as Paystack and Vercel, your data may be processed on
          servers located outside Nigeria. Where this happens, we take reasonable steps to ensure
          those providers maintain a comparable standard of data protection to that required under
          the NDPA.
        </p>
      </Section>

      <Section id="changes" title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices
          or legal requirements. The "Effective date" above will be updated accordingly, and
          material changes will be communicated where appropriate.
        </p>
      </Section>

      <Section id="contact" title="12. Contact Us">
        <p>
          For questions about this Privacy Policy or how your data is handled, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or via{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{' '}
          or{' '}
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  )
}
