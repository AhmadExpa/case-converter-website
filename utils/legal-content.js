export const SITE_NAME = "QuickTextFormatter";
export const SITE_REFERENCE = "https://www.quicktextformatter.com";
export const CONTACT_EMAIL = "contact@quicktextformatter.com";
export const COMPANY_NAME = "Grova Wellbeing LLC";
export const COMPANY_ADDRESS = "30 N Gould St, Ste R, Sheridan, WY 82801";
export const INCORPORATION_STATE = "Wyoming";
export const EFFECTIVE_DATE = "April 17, 2026";
export const LAST_UPDATED = "February 22, 2026";

const VENUE = "Sheridan County, Wyoming";
const CURRENCY = "USD";

const paragraph = (text) => `<p>${text}</p>`;
const lead = (title, text) => `<p><strong>${title}</strong> ${text}</p>`;
const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
const section = (title, ...blocks) => `<section><h2>${title}</h2>${blocks.join("")}</section>`;
const subsection = (title, ...blocks) => `<h3>${title}</h3>${blocks.join("")}`;
const table = (headers, rows) =>
  `<table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const mailto = (email) => `<a href="mailto:${email}">${email}</a>`;

const buildTermsHtml = ({ siteReference, contactEmail }) =>
  [
    section(
      "Important notice",
      paragraph(
        'These Terms of Use ("Terms") are designed for a U.S.-based business operating multiple websites and digital services. If you access the Services from the EU/EEA, the United Kingdom, Switzerland, India, or other jurisdictions, local consumer, privacy, cookie, marketing, and platform-regulation rules may require additional terms, disclosures, or consent tools. Where required by applicable law, some provisions below may not apply to you or may apply differently.',
      ),
    ),
    section(
      "Definitions",
      paragraph("For purposes of these Terms:"),
      list([
        `"Company," "we," "us," or "our" means ${COMPANY_NAME}, a ${INCORPORATION_STATE} company with its principal place of business at ${COMPANY_ADDRESS}.`,
        `"Sites" means the websites, subdomains, and other online properties where these Terms are posted, including ${siteReference} and any successor or affiliated domains controlled by Company.`,
        '"Services" means all products and services offered through the Sites, including courses, communities, utilities/tools, digital downloads, scoring or assessments, recommendation features, memberships, subscriptions, and related support.',
        '"User" or "you" means any person who visits the Sites or uses the Services.',
        '"Content" means all text, graphics, images, audio, video, quizzes, lesson materials, templates, trackers, planners, calculators, simulations, and other materials made available through the Services, including content generated with the assistance of AI tools.',
        '"User Content" means content you submit, post, upload, transmit, or otherwise provide through the Services, such as community posts, reviews, messages, profile data, or feedback.',
      ]),
    ),
    section(
      "Acceptance of Terms",
      paragraph(
        "By accessing or using the Sites or Services, you agree to be bound by these Terms and any policies incorporated by reference, including our Privacy Policy. If you do not agree, do not use the Sites or Services.",
      ),
    ),
    section(
      "Eligibility and age requirements",
      paragraph("The Services are intended for adults only."),
      paragraph(
        "You must be at least the age of legal majority in your jurisdiction to use the Services. The Services are not directed to children under 13. If we learn we have collected personal information from a child under 13 in a manner subject to COPPA, we will take appropriate steps consistent with applicable law.",
      ),
      paragraph(
        "If local law requires a higher age threshold for certain contract types or digital purchases (e.g., age 18 or 21), you must meet that threshold to complete those transactions.",
      ),
    ),
    section(
      "Account registration, credentials, and security",
      paragraph(
        "Some features require an account (e.g., saved progress, purchases, community participation). You agree to:",
      ),
      list([
        "provide accurate account information and keep it updated;",
        "maintain confidentiality of your credentials and promptly notify us of any suspected unauthorized access; and",
        "accept responsibility for activities conducted under your account, except where prohibited by applicable law.",
      ]),
    ),
    section(
      "Nature of our Services",
      paragraph(
        "Our Services may include content related to finance, health, wellness, mental health, lifestyle, habit change, wellbeing scoring, and self-improvement.",
      ),
      lead(
        "Educational and informational only; no professional advice.",
        "The Services and Content are for educational and informational purposes only and do not constitute medical, mental health, diagnosis, treatment, financial or investment, legal, or accounting advice.",
      ),
      lead(
        "No results guarantee (no outcomes promised).",
        'You understand and agree that Company makes no guarantees regarding emotional, financial, psychological, health, medical, lifestyle, relationship, career, or other outcomes from your use of the Services. Outcomes and results vary widely by individual effort, background, and circumstances. Any examples, case studies, progress stories, "before/after" descriptions, or testimonials are illustrative only and are not promises that you will achieve the same or similar results.',
      ),
      lead(
        "Explicit non-therapeutic / non-clinical boundary (wellbeing protection).",
        "The Services do not provide therapy, psychiatric care, crisis counseling, medical services, or clinical treatment. The company is not a hospital, clinician, therapist, psychiatrist, psychologist, or emergency services provider. No therapist-client, clinician-client, physician-patient, or other special relationship is created by your use of the Services.",
      ),
      lead(
        "No monitoring for crisis signals; no duty to intervene.",
        "The company does not monitor the Services, communities, messages, or User Content for signs of crisis, self-harm risk, or other emergencies, and we do not guarantee that we will identify or respond to such signals. You are responsible for seeking appropriate help when needed.",
      ),
      lead(
        "Emergency disclaimer.",
        "If you think you may be experiencing an emergency (including a mental health crisis) or you believe you may harm yourself or others, contact local emergency services immediately.",
      ),
    ),
    section(
      "AI-generated content and automated features",
      paragraph(
        "The Services may provide AI-assisted or AI-generated outputs (videos, quizzes, explanations, recommendations, summaries, translations, or similar).",
      ),
      lead(
        "AI limitations and user responsibility.",
        "AI-generated content may be incomplete, inaccurate, outdated, biased, or inappropriate. You agree not to rely on automated outputs as your sole basis for making decisions that could impact your health, finances, safety, or legal rights.",
      ),
      lead(
        "Recommendation engines, scoring, and personalization.",
        "We may offer recommendation engines, scoring, assessments, or personalization based on your inputs, activity, purchase history, and engagement. Such outputs are informational tools, not guarantees of outcomes. We may adjust, suspend, or discontinue such features at any time.",
      ),
      lead(
        "AI moderation disclosure.",
        "To help operate and protect the Services, we may use automated tools (including machine learning or AI-enabled systems) to assist with enforcement and moderation-for example, to detect spam, fraud, prohibited content, security threats, or Terms violations. Automated tools may flag content or accounts for human review, limit content visibility, or restrict certain actions. We do not guarantee that automated tools will detect all prohibited behavior or that any decision will be error-free.",
      ),
    ),
    section(
      "Privacy",
      paragraph("Your use of the Services is subject to our Privacy Policy, which is incorporated by reference."),
    ),
    section(
      "Subscriptions and Billing",
      subsection(
        "Merchant of record and payment processing",
        paragraph(
          "We may use a merchant-of-record provider to process payments for subscriptions, memberships, and digital products. When we use Paddle, Paddle is the merchant of record and an authorized reseller of the Product for the Company. This means you purchase the Product from Paddle using Paddle's checkout services, and the Product is licensed to you by Company.",
        ),
        paragraph(
          "Your payment details are collected and processed in accordance with the merchant-of-record provider's terms and privacy disclosures.",
        ),
      ),
      subsection(
        "Pricing and taxes",
        paragraph(
          `Prices are displayed in ${CURRENCY} where available. Taxes (including VAT/GST/sales tax) may be calculated, collected, reported, and remitted by the merchant of record under its model and legal obligations. In Paddle's reseller structure, Paddle handles sales tax collection, reporting, and remittance where required.`,
        ),
      ),
      subsection(
        "Renewals, cancellations, and recurring billing compliance",
        paragraph(
          "If you purchase a subscription or other automatically renewing plan, you authorize recurring charges until you cancel.",
        ),
        paragraph(
          "We intend that material terms (price, renewal interval, cancellation method, and any trial-to-paid conversion) be disclosed clearly before billing, and that you provide express informed consent before any charge is made. We also intend to provide a simple mechanism to stop recurring charges, consistent with the requirements commonly associated with online negative-option billing.",
        ),
        lead(
          "Simple cancellation.",
          `We offer cancellation options in your account settings and via support at ${mailto(contactEmail)}. Cancellation becomes effective at the end of your current billing period unless otherwise stated at checkout or required by law.`,
        ),
      ),
      subsection(
        "Free trials (if applicable)",
        paragraph(
          "If we offer a free trial, the trial duration, the date you will be charged (if you do not cancel), the price after the trial, and how to cancel will be displayed at checkout or sign-up.",
        ),
        paragraph(
          "Unless otherwise disclosed, free trials convert to paid subscriptions automatically at the end of the trial period. To avoid being charged, you must cancel before the end of the trial period using the cancellation method provided.",
        ),
        paragraph("Where required by law, we may provide additional notices or reminders prior to conversion."),
      ),
      subsection(
        "Refunds, chargebacks, and disputes",
        paragraph(
          "Refund handling may be governed by the merchant-of-record provider's processes. Where Paddle is the merchant of record, refunds are processed through Paddle rather than directly by the Company, and Paddle's buyer terms may apply to the transaction.",
        ),
        paragraph(
          'Any separate refund policy we publish ("Refund Policy") is incorporated by reference and applies only to the extent consistent with the merchant-of-record arrangement and applicable law.',
        ),
        lead(
          "Chargebacks.",
          `If you have a billing issue, you agree to contact support first at ${mailto(contactEmail)} so we can try to resolve it. If you initiate a chargeback without first attempting to resolve the issue through support, we may suspend or terminate your access to the Services, subject to applicable law.`,
        ),
      ),
    ),
    section(
      "Dispute Resolution and Arbitration",
      subsection(
        "Governing law for the arbitration agreement",
        paragraph(
          "This section contains a binding arbitration agreement and class action waiver. To the fullest extent permitted by law, this arbitration agreement is governed by the Federal Arbitration Act (Title 9 of the U.S. Code).",
        ),
      ),
      subsection(
        "Informal resolution first",
        paragraph(
          `Before starting arbitration or a court proceeding, you agree to first send a written Notice of Dispute to ${mailto(contactEmail)} with: (1) your name, (2) the email address associated with your account, (3) a description of the dispute, and (4) the relief you seek.`,
        ),
        paragraph(
          "We will attempt to resolve the dispute informally within thirty (30) days after receiving your Notice of Dispute. If we cannot resolve the dispute within that period, either party may proceed as described below.",
        ),
      ),
      subsection(
        "Agreement to arbitrate",
        paragraph(
          "Except for the carve-outs below, you and Company agree that any dispute, claim, or controversy arising out of or relating to these Terms, the Services, or your relationship with Company will be resolved by binding arbitration on an individual basis.",
        ),
      ),
      subsection(
        "Carve-outs",
        paragraph("This arbitration requirement does not apply to:"),
        list([
          "<strong>Small claims court.</strong> Either party may bring an individual action in small claims court if the claim qualifies and remains there.",
          "<strong>Intellectual property and misuse.</strong> The company may seek injunctive or equitable relief in a court of competent jurisdiction to protect its intellectual property rights, trade secrets, confidential information, or to prevent unauthorized access, scraping, abuse, or security breaches.",
          "<strong>Public injunctive relief (where non-waivable).</strong> To the extent applicable law prohibits waiver of certain forms of public injunctive relief, claims seeking such relief will be severed and handled by a court, while the remaining claims proceed in arbitration.",
        ]),
      ),
      subsection(
        "Arbitration administrator, rules, and procedures",
        lead(
          "Administrator.",
          'Arbitration will be administered by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules (where applicable). If the AAA is unwilling or unable to administer the arbitration, the arbitration will be administered by JAMS, under its consumer procedures and standards, to the extent applicable.',
        ),
        lead(
          "Venue and format.",
          `Arbitration may be conducted remotely (video, telephone, or documents-only) unless the arbitrator determines an in-person hearing is necessary. If an in-person hearing is required, it will take place in ${VENUE} unless the parties agree otherwise or applicable law requires a different location.`,
        ),
        lead(
          "Authority.",
          "The arbitrator will have exclusive authority to resolve any dispute relating to the interpretation, applicability, or enforceability of this arbitration agreement, except that a court may decide issues regarding the scope or enforceability of the class action waiver.",
        ),
      ),
      subsection(
        "Fees and costs",
        lead(
          "AAA consumer filing fee cap.",
          "If the AAA Consumer Arbitration Rules apply and you are a consumer, the consumer administrative filing fee is capped (AAA currently describes the cap as $225), and the business pays the arbitrator's compensation under AAA consumer procedures, subject to the provider's rules and any fee waiver process.",
        ),
        lead(
          "JAMS consumer fee standard.",
          "If JAMS administers and consumer standards apply, JAMS states that when a consumer initiates arbitration, the only fee the consumer must pay is $250 (approximately equivalent to court filing fees), and all other costs must be borne by the company.",
        ),
        lead(
          "Attorney's fees.",
          "Each party is responsible for its own attorneys' fees and costs unless applicable law or the arbitrator's award provides otherwise.",
        ),
      ),
      subsection(
        "Class action waiver",
        paragraph(
          "You and Company agree that arbitration (and any court proceedings permitted under the carve-outs above) will be conducted only on an individual basis. Neither you nor the Company may bring a claim as a plaintiff or class member in a class, collective, coordinated, consolidated, representative, or private attorney general action.",
        ),
      ),
      subsection(
        "Opt-out right",
        paragraph(
          `You have the right to opt out of this arbitration agreement within thirty (30) days of the first date you accept these Terms by sending an email to ${mailto(contactEmail)} with the subject line "Arbitration Opt-Out" and including: (1) your full name, (2) the email address associated with your account, and (3) a clear statement that you wish to opt out of arbitration.`,
        ),
        paragraph(
          "If you opt out, neither party will be bound by this arbitration agreement, and disputes will be resolved in court as set forth below.",
        ),
      ),
      subsection(
        "Severability and survival",
        paragraph(
          "If any portion of this arbitration agreement is found unenforceable, that portion will be severed and the remainder will be enforced to the fullest extent permitted by law. If the class action waiver is found unenforceable for a particular claim, then that claim (and only that claim) must proceed in court.",
        ),
        paragraph("This arbitration agreement survives termination of your account and these Terms."),
      ),
    ),
  ].join("");

const buildPrivacyHtml = ({ contactEmail }) =>
  [
    section(
      "Who we are",
      paragraph(`"Company," "we," "us," or "our" means ${COMPANY_NAME}.`),
      paragraph(`Privacy Contact: ${mailto(contactEmail)}`),
      paragraph(`Mailing Address: ${COMPANY_ADDRESS}`),
    ),
    section(
      "Scope",
      paragraph("This Privacy Policy describes how we collect, use, disclose, retain, and protect information when you:"),
      list([
        "visit our Sites;",
        "create an account;",
        "purchase subscriptions or digital products;",
        "participate in communities/cohorts;",
        "use our tools/utilities; and",
        "interact with our ads, emails, and customer support.",
      ]),
    ),
    section(
      "Data minimization (explicit statement)",
      paragraph(
        "We collect personal data that is reasonably necessary and proportionate to achieve the purposes described in this Privacy Policy. We do not intentionally collect categories of personal data that are not needed for these purposes.",
      ),
    ),
    section(
      "Information we collect",
      paragraph("The exact data collected depends on how you use the Services."),
      subsection(
        "Information you provide directly",
        list([
          "Account and profile information: name (optional or required depending on feature), email address, login/authentication data (typically handled by an authentication provider), country/region, language preference, and community profile details you choose to share.",
          "Purchases and subscription context: products purchased, subscription level, entitlement status, transaction IDs, refunds status, and chargeback status. We generally do not store full payment card details when using a merchant-of-record checkout.",
          "User Content: community posts, comments, messages, reviews/testimonials (if enabled), uploads you submit (if enabled), feedback, and survey responses.",
          "Customer support communications: messages you send us, attachments, and records of support requests and outcomes.",
        ]),
      ),
      subsection(
        "Information collected automatically",
        list([
          'Device and log data: IP address, browser type, device identifiers, operating system, approximate location inferred from IP, pages viewed, clicks, referral URLs, timestamps, and error logs.',
          "Learning and engagement data (when logged in): courses started/completed, quiz attempts and scores, progress tracking, preferences, saved items.",
          'Cookies and similar technologies: see "Cookies, Advertising, and Tracking" below. Consent rules for non-essential cookies are stricter in certain jurisdictions (e.g., UK/EU).',
        ]),
      ),
    ),
    section(
      "How we use information",
      paragraph("We use information for purposes such as:"),
      list([
        "providing and operating the Services (authentication, delivering content/tools, enabling communities, tracking entitlements);",
        "personalization and recommendations (including scoring/assessment features where offered);",
        "payments, subscriptions, and access management (often via the merchant of record);",
        "customer support and operational communications;",
        "marketing and cross-sell (where permitted, with opt-out);",
        "advertising and affiliate monetization (subject to your choices and law); and",
        "safety, integrity, and legal compliance (fraud prevention, enforcement, security, legal requests).",
      ]),
    ),
    section(
      "De-identified / aggregated data",
      paragraph(
        "We may create de-identified or aggregated data from personal data (for example, by removing direct identifiers and applying technical and organizational measures designed to reduce re-identification risk). We may use and retain de-identified or aggregated data for analytics, research, product improvement, security, and operational purposes, to the extent permitted by applicable law.",
      ),
    ),
    section(
      "Data retention",
      paragraph(
        "We retain personal data only as long as reasonably necessary for the purposes described in this Privacy Policy, including account maintenance, service delivery, dispute resolution, enforcing Terms, security logging, fraud prevention, and legal compliance.",
      ),
      paragraph(
        "Final retention periods should be confirmed by legal/finance based on business operations, accounting/tax requirements, and applicable law.",
      ),
      paragraph("We may retain de-identified/aggregated data longer (or indefinitely), as described above."),
    ),
    section(
      "Cookies, Advertising, and Tracking",
      subsection(
        "Cookie categories (structural enhancement)",
        paragraph(
          "We use cookies, pixels, SDKs, and similar technologies. The mix may vary depending on which Sites/Services you use and your settings.",
        ),
        list([
          "<strong>Strictly necessary cookies.</strong> Used for essential functions such as security, authentication, load balancing, and fraud prevention. These are generally required for the Sites/Services to function.",
          "<strong>Functional cookies.</strong> Used to remember preferences (e.g., language) and enable enhanced features.",
          "<strong>Analytics cookies.</strong> Used to understand usage, performance, and improve the Services.",
          "<strong>Advertising cookies.</strong> Used to measure ad performance and (where enabled) personalize ads or support cross-context behavioral advertising, depending on jurisdiction and your choices.",
        ]),
        paragraph(
          "In the UK, the Information Commissioner's Office states that organizations must provide clear information about cookies and obtain consent for cookies that are not strictly necessary.",
        ),
      ),
      subsection(
        "Consent banners and jurisdiction-based controls",
        paragraph(
          "Where legally required (for example, in the EU/EEA and UK for non-essential cookies), we will request consent before placing non-essential cookies. We may use a consent management platform to record and honor your choices.",
        ),
        paragraph(
          "If we use Google tags to measure user behavior for users in the EEA, Google requires that we pass end-user consent choices and obtain legally valid consent for certain cookie/storage uses and ad personalization.",
        ),
      ),
      subsection(
        "Advertising and affiliate disclosures",
        paragraph(
          "We may display ads and use affiliate links. Ad networks and measurement partners may receive cookie identifiers and event data, subject to your consent choices and applicable law.",
        ),
      ),
    ),
    section(
      "Jurisdiction-Specific Rights and International Data Transfers",
      subsection(
        'California privacy rights, "sale/share," and Global Privacy Control',
        paragraph(
          'If you are a California resident and we are a covered business, you may have rights including access/know, deletion (with exceptions), correction, and the right to opt out of "sale" or "sharing" of personal information.',
        ),
        paragraph(
          'Some advertising-related disclosures and identifier sharing may be considered "sharing" (and sometimes "selling") under California privacy law definitions, depending on how our advertising is configured.',
        ),
        paragraph(
          'The California Attorney General states that Global Privacy Control (GPC) is one option for consumers to submit opt-out requests, and covered businesses must honor it as a valid request to stop the sale or sharing of personal information.',
        ),
      ),
      subsection(
        "California automated decision-making technology (ADMT) notice and opt-out concepts",
        paragraph(
          "Because the Services may include recommendation engines and scoring, California's regulatory framework on automated decision-making technology (ADMT) may apply depending on our specific use cases and whether we are subject to the CCPA/CPRA.",
        ),
        paragraph(
          "The California Privacy Protection Agency states that the Agency adopted regulations that implement consumers' rights to access and opt out of businesses' use of ADMT, with an effective date of January 1, 2026.",
        ),
        paragraph("Where applicable, we will provide:"),
        list([
          "information about whether and how we use automated tools for recommendations/scoring;",
          "what inputs are considered and what outputs are intended to do (and not do).",
        ]),
      ),
      subsection(
        "EU/EEA lawful basis mapping (structural enhancement)",
        paragraph(
          "If you are subject to GDPR/UK GDPR, we process personal data only where a lawful basis applies (such as contract necessity, consent, legitimate interests, and legal obligation).",
        ),
        paragraph("A simplified mapping (to be finalized with counsel) may include:"),
        table(
          ["Processing Purpose", "Typical Lawful Basis (EU/EEA/UK)"],
          [
            ["Account creation, delivering Services", "Performance of a contract"],
            ["Subscription access management and support", "Performance of a contract; legitimate interests"],
            ["Security and fraud prevention", "Legitimate interests; legal obligation (where applicable)"],
            ["Marketing emails", "Consent (where required) or legitimate interests (where permitted, with opt-out)"],
            ["Non-essential cookies / ad personalization", "Consent (where required)"],
            ["Legal compliance, tax, disputes", "Legal obligation; legitimate interests"],
          ],
        ),
      ),
      subsection(
        "International data transfers and safeguards",
        paragraph("We are U.S.-based and may process and store information in the United States and other countries."),
        paragraph(
          "Where required for transfers of personal data from the EU/EEA to countries without an adequacy decision, we may rely on recognized safeguards such as the European Commission's Standard Contractual Clauses (SCCs) adopted under Commission Implementing Decision (EU) 2021/914, and additional measures as appropriate.",
        ),
        paragraph(
          "We also use contractual and organizational safeguards with vendors (for example, data processing agreements where required).",
        ),
      ),
      subsection(
        "India DPDP Act notice and grievance handling",
        paragraph(
          "If you are in India, processing of digital personal data may be governed by India's Digital Personal Data Protection Act, 2023 (DPDP).",
        ),
        paragraph(
          "DPDP indicates that consent should be free, specific, informed, unconditional, and unambiguous with a clear affirmative action, limited to personal data necessary for the specified purpose, and that withdrawal should be as easy as giving consent.",
        ),
        paragraph(
          "DPDP also provides for readily available means of grievance redressal by a data fiduciary or consent manager.",
        ),
      ),
    ),
    section(
      "Reviews, testimonials, and endorsements compliance",
      paragraph(
        "If we display reviews or testimonials, we prohibit fake or deceptive reviews and certain review suppression practices.",
      ),
      paragraph(
        "The Federal Trade Commission announced a final rule addressing fake reviews and testimonials, and the Federal Register publication describes prohibitions including fake reviews, certain insider reviews without disclosure, and certain review suppression practices. The FTC also provides guidance and resources on consumer reviews/testimonials compliance. The FTC's endorsement guidance addresses disclosure of material connections in endorsements and testimonials.",
      ),
    ),
    section(
      "Export controls and sanctions compliance (Terms alignment)",
      paragraph(
        "Users may not use the Services in violation of U.S. sanctions or export control laws. The U.S. Department of the Treasury's Office of Foreign Assets Control describes sanctions compliance obligations for U.S. persons and related restrictions, and the U.S. Department of Commerce Bureau of Industry and Security maintains the Export Administration Regulations (EAR).",
      ),
    ),
  ].join("");

export function createLegalContent({
  siteName = SITE_NAME,
  siteReference = SITE_REFERENCE,
  contactEmail = CONTACT_EMAIL,
} = {}) {
  return {
    siteName,
    siteReference,
    contactEmail,
    termsTitle: "Terms of Use",
    privacyTitle: "Privacy Policy",
    termsHtml: buildTermsHtml({ siteReference, contactEmail }),
    privacyHtml: buildPrivacyHtml({ siteReference, contactEmail }),
  };
}
