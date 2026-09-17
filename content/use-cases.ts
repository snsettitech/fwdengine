/**
 * Financial services use cases.
 *
 * House rule for this file: every entry states a MECHANISM, not a benefit.
 * "Drafts the credit memo with each assertion line-linked to its source
 * document" is allowed. "Transforms underwriting with AI" is not.
 */

export type UseCase = {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  /** One sentence. What the system actually does, step by step. */
  readonly mechanism: string;
  /** The control that keeps a regulator comfortable. */
  readonly control: string;
  readonly domain: "Credit" | "Financial crime" | "Operations" | "Servicing" | "Regulatory" | "Treasury" | "Research";
};

export const useCases: readonly UseCase[] = [
  {
    id: "underwriting-copilot",
    index: "01",
    title: "Underwriting copilot",
    mechanism:
      "Assembles the submission, bureau file, financials and the institution's own credit policy into a single evidence set, then drafts the credit memo with every assertion line-linked to the source page it came from.",
    control:
      "The agent never sets a decision flag. It produces a recommendation and an evidence trail; the credit officer signs.",
    domain: "Credit",
  },
  {
    id: "aml-triage",
    index: "02",
    title: "AML and fraud alert triage",
    mechanism:
      "Reads the alert, pulls counterparty history, sanctions hits and prior SAR narratives, and writes a disposition draft that names the typology it matched and the transactions that support it.",
    control:
      "Escalation thresholds stay in the rules engine. The agent reorders the queue and drafts the narrative; it cannot close an alert.",
    domain: "Financial crime",
  },
  {
    id: "reconciliation",
    index: "03",
    title: "Reconciliation and break resolution",
    mechanism:
      "Matches ledger to custodian and counterparty statements, clusters unmatched breaks by probable root cause, and proposes the journal entry with the supporting lines attached.",
    control:
      "Proposed entries land in the ERP as drafts against a service account with post rights withheld.",
    domain: "Operations",
  },
  {
    id: "client-service",
    index: "04",
    title: "Client service orchestration",
    mechanism:
      "Routes an inbound request across retrieval over product terms, a core banking read, and a drafting step, then hands the agent's draft plus its citations to the relationship manager.",
    control:
      "Regulated communications route through the existing supervision and archival stack before a client ever sees them.",
    domain: "Servicing",
  },
  {
    id: "regulatory-reporting",
    index: "05",
    title: "Regulatory report assembly",
    mechanism:
      "Pulls each schedule from system of record, reconciles it against the prior filing, drafts the variance commentary, and flags every figure whose lineage it could not resolve rather than estimating it.",
    control:
      "Unresolved lineage blocks the draft. The agent surfaces the gap; it does not fill it.",
    domain: "Regulatory",
  },
  {
    id: "treasury-monitoring",
    index: "06",
    title: "Treasury and liquidity monitoring",
    mechanism:
      "Watches intraday positions against limits, reconstructs the drivers behind a projected breach, and pages the desk with the exposure decomposition already written.",
    control:
      "Read-only against position systems. Alerting is the output; no agent holds execution rights.",
    domain: "Treasury",
  },
  {
    id: "portfolio-research",
    index: "07",
    title: "Portfolio research copilot",
    mechanism:
      "Runs retrieval across filings, transcripts, internal notes and market data, then returns a thesis brief where each claim carries a citation and a timestamp for when the source was last read.",
    control:
      "Research and trading corpora stay in separate isolation cells. Information-barrier policy is enforced at the retrieval layer, not in the prompt.",
    domain: "Research",
  },
] as const;
