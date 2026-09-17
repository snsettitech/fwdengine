/** The four-phase engagement model, rendered as a horizontal timeline. */

export type EngagementPhase = {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly duration: string;
  readonly summary: string;
  /** Concrete artefacts the client holds at the end of the phase. */
  readonly deliverables: readonly string[];
};

export const engagementPhases: readonly EngagementPhase[] = [
  {
    id: "embed",
    index: "01",
    title: "Embed",
    duration: "Week 0 to 2",
    summary:
      "A pod lands inside your estate, not beside it. We take read access to the systems the work actually touches, sit with the operators whose queue we are changing, and write down the control boundary before we write code.",
    deliverables: [
      "Named pod: lead FDE, platform engineer, domain engineer",
      "Access, isolation cell and network path signed off by your security team",
      "Control boundary memo: what an agent may read, propose and never decide",
      "Baseline measurement of the process we are about to change",
    ],
  },
  {
    id: "build",
    index: "02",
    title: "Build",
    duration: "Week 2 to 8",
    summary:
      "Weekly ship cadence against your environment. Every agent gets an evaluation suite before it gets a user, and the suite is written from your own historical cases, not a public benchmark.",
    deliverables: [
      "Evaluation harness seeded with your adjudicated historical cases",
      "Agent graph running in your non-production environment",
      "Human approval gates wired to the roles that hold the authority today",
      "Audit schema emitting to your existing log estate",
    ],
  },
  {
    id: "ship",
    index: "03",
    title: "Ship",
    duration: "Week 8 to 16",
    summary:
      "Production behind a gate, on a slice of real volume, with the rollback path tested before the first live request. Model risk and internal audit review the evidence pack we have been generating since week two, not a retrospective write-up.",
    deliverables: [
      "Production deployment on a bounded traffic slice",
      "Model risk evidence pack assembled from live run data",
      "Tested rollback and kill path with measured recovery time",
      "Operator training run by the engineers who built the system",
    ],
  },
  {
    id: "operate",
    index: "04",
    title: "Operate",
    duration: "Ongoing, or handover",
    summary:
      "We run it, or we hand it over. Both are real endings. Handover means your engineers hold the repository, the evaluation suites and the runbooks, and we have watched them run an incident before we leave.",
    deliverables: [
      "Continuous evaluation against drift, with regression gates on model upgrades",
      "Follow-the-sun on-call across delivery hubs",
      "Quarterly control attestation in the format your auditor accepts",
      "Handover: repository, harnesses, runbooks, and a supervised incident",
    ],
  },
] as const;
