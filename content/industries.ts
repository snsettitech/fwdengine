/** Industry verticals. Each becomes a sub-page at /industries/[slug]. */

export type Workstream = {
  readonly title: string;
  readonly mechanism: string;
};

export type Industry = {
  readonly slug: string;
  readonly index: string;
  readonly name: string;
  /** Used in nav, cards and metadata. One line. */
  readonly summary: string;
  /** The specific reason this sector cannot ship AI at speed today. */
  readonly constraint: string;
  readonly workstreams: readonly Workstream[];
  /** The supervisory regimes that shape the control design. */
  readonly regimes: readonly string[];
};

export const industries: readonly Industry[] = [
  {
    slug: "banking",
    index: "01",
    name: "Banking",
    summary:
      "Core-adjacent agents for credit, financial crime and back office, deployed without touching the core's write path.",
    constraint:
      "The systems that hold the answer are the systems nobody is allowed to change. A core banking platform on a decades-old release cadence sits behind a change-advisory board that meets fortnightly, and every AI proposal that requires a core modification dies there. So we do not require one. We deploy into the read plane, take the same feeds your data warehouse takes, and write back only through interfaces your operators already use.",
    workstreams: [
      {
        title: "Credit decisioning support",
        mechanism:
          "Evidence assembly and memo drafting for commercial and SME credit, with the policy manual as a retrieval corpus and the credit officer as the decision authority.",
      },
      {
        title: "Financial crime operations",
        mechanism:
          "Alert triage, narrative drafting and typology matching against your adjudicated case history, sitting in front of the existing rules engine rather than replacing it.",
      },
      {
        title: "Back-office reconciliation",
        mechanism:
          "Break clustering and journal proposal across ledger, custodian and counterparty feeds, posting as drafts against a service account without post rights.",
      },
      {
        title: "Regulatory report assembly",
        mechanism:
          "Schedule population with lineage tracking, prior-period reconciliation and variance commentary, blocking on any figure whose provenance cannot be resolved.",
      },
    ],
    regimes: ["SR 11-7", "OCC Heightened Standards", "PRA SS1/23", "EU AI Act", "DORA"],
  },
  {
    slug: "asset-wealth",
    index: "02",
    name: "Asset & Wealth Management",
    summary:
      "Research and client-servicing agents that respect information barriers at the retrieval layer.",
    constraint:
      "The hard problem is not summarisation. It is that your research corpus, your trading corpus and your client corpus must not leak into one another, and a single shared vector index quietly destroys that separation. Most AI pilots in this sector fail compliance review for exactly this reason. Isolation has to be structural, enforced by which index a request is allowed to reach, not by an instruction in a prompt.",
    workstreams: [
      {
        title: "Research synthesis",
        mechanism:
          "Retrieval across filings, transcripts, internal notes and market data, returning briefs where every claim carries a citation and a source-read timestamp.",
      },
      {
        title: "Client reporting",
        mechanism:
          "Portfolio commentary drafted from position and performance data, routed through the existing supervision and archival stack before distribution.",
      },
      {
        title: "Mandate and guideline monitoring",
        mechanism:
          "Continuous checking of holdings against mandate text, surfacing probable breaches with the clause and the position that triggered them.",
      },
      {
        title: "Advisor desktop orchestration",
        mechanism:
          "One request fans out across CRM, custody and product systems, and returns a single assembled answer with each field attributed to its system of record.",
      },
    ],
    regimes: ["SEC Marketing Rule", "MiFID II", "FINRA 2210", "Information barrier policy"],
  },
  {
    slug: "insurance",
    index: "03",
    name: "Insurance",
    summary:
      "Submission intake, claims triage and actuarial support under state-level AI conduct rules.",
    constraint:
      "Underwriting and claims are where AI conduct regulation is sharpest and most fragmented. The NAIC model bulletin has been adopted state by state, with variation, and several states now require a documented governance programme covering every model that touches a consumer outcome. A system that cannot produce its reasoning per decision is not deployable here, regardless of how well it performs.",
    workstreams: [
      {
        title: "Submission intake",
        mechanism:
          "Extraction from broker submissions of any format into your rating schema, with low-confidence fields routed to a human rather than guessed.",
      },
      {
        title: "Claims triage",
        mechanism:
          "Severity and complexity routing from first notice of loss, with the factors behind each routing decision recorded at decision time.",
      },
      {
        title: "Actuarial and reserving support",
        mechanism:
          "Assembly of experience data and drafting of reserve commentary, with every figure traceable to the extract and the query that produced it.",
      },
      {
        title: "Policy servicing",
        mechanism:
          "Endorsement and cancellation handling drafted against policy wording, held at a gate for licensed review before issue.",
      },
    ],
    regimes: ["NAIC Model Bulletin on AI", "Colorado SB21-169", "NYDFS Circular Letter No. 7", "EU AI Act"],
  },
  {
    slug: "payments",
    index: "04",
    name: "Payments",
    summary:
      "Latency-bounded agents for disputes, exceptions and merchant risk, engineered to a millisecond budget.",
    constraint:
      "Payments has a constraint the rest of finance does not: a hard latency budget on the authorisation path. An agent that takes 800 milliseconds to reason is not slow, it is out of scope for that path entirely. So the engineering question is where the agentic work belongs. It belongs off the critical path, in disputes, exception handling and merchant risk, where the time budget is minutes and the volume is punishing.",
    workstreams: [
      {
        title: "Dispute and chargeback handling",
        mechanism:
          "Evidence pack assembly against network rules and deadlines, drafting the representment with the scheme's own requirement list as the checklist.",
      },
      {
        title: "Exception and return processing",
        mechanism:
          "Classification of failed and returned transactions by cause, with the remediation path proposed and the operator confirming.",
      },
      {
        title: "Merchant onboarding and risk review",
        mechanism:
          "Assembly of the underwriting file from registry, web and transaction signals, flagging the specific prohibited-category evidence rather than returning a score.",
      },
      {
        title: "Scheme change readiness",
        mechanism:
          "Continuous reading of network mandate bulletins against your implementation, producing a diff of what changed and which systems it touches.",
      },
    ],
    regimes: ["PCI DSS 4.0", "Reg E and Reg Z", "PSD2 and PSR", "Card scheme operating rules"],
  },
] as const;

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}
