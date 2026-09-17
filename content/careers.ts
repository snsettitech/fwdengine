/** Careers content. Roles are editable here without touching a component. */

export type Role = {
  readonly id: string;
  readonly title: string;
  readonly team: string;
  readonly locations: readonly string[];
  readonly type: "Full-time" | "Contract";
  readonly summary: string;
  readonly whatYouDo: readonly string[];
  readonly whatWeLookFor: readonly string[];
  readonly open: boolean;
};

export const archetype = {
  headline: "The forward deployed archetype",
  body: "A forward deployed engineer sits in front of a Head of Risk on Tuesday and ships the change on Thursday. That requires two things most engineering roles separate: the technical depth to build the system, and the composure to be questioned about it by someone who is accountable for the outcome. We hire for both. The failure mode we screen hardest against is the engineer who is brilliant in a repository and silent in a room.",
  traits: [
    {
      title: "You ship inside constraints you did not choose",
      body: "The change board meets fortnightly. The core is frozen. The data you need is in a system that predates you. This is the job, not an obstacle to the job.",
    },
    {
      title: "You can be wrong in front of a client",
      body: "Being corrected by a domain expert and adjusting in the same meeting is a skill. Defending a bad design because you proposed it is disqualifying.",
    },
    {
      title: "You treat evaluation as engineering",
      body: "You write the harness before you tune the prompt. You know the difference between a benchmark result and evidence that a system works on this institution's cases.",
    },
    {
      title: "You read the regulation",
      body: "Not to become a lawyer. To know which control the design has to satisfy before you pick an architecture that cannot satisfy it.",
    },
  ],
} as const;

export const roles: readonly Role[] = [
  {
    id: "fde-lead-nyc",
    title: "Lead Forward Deployed Engineer",
    team: "Delivery",
    locations: ["New York", "London"],
    type: "Full-time",
    summary:
      "Own a pod inside a client institution. You are the technical authority in the room and the person accountable for what ships.",
    whatYouDo: [
      "Run a three to five person pod embedded in a client's engineering estate",
      "Set the control boundary with the client's risk and security functions before build starts",
      "Write code every week; this is not an oversight role",
      "Carry the weekly ship commitment and the incident pager that comes with it",
    ],
    whatWeLookFor: [
      "Eight or more years building production systems, some of it in or against regulated infrastructure",
      "Direct experience deploying software inside an organisation that was not your employer",
      "Fluency in a conversation with a Head of Risk without an account manager translating",
    ],
    open: true,
  },
  {
    id: "agent-platform-engineer",
    title: "Agent Platform Engineer",
    team: "Platform",
    locations: ["Bengaluru", "London", "Remote (UTC-1 to UTC+6)"],
    type: "Full-time",
    summary:
      "Build the orchestration, isolation and audit layer that every engagement deploys onto.",
    whatYouDo: [
      "Own the execution substrate: task graphs, tool typing, isolation cells, replay",
      "Make the audit record complete enough that an auditor never has to ask us for context",
      "Keep the provider interface genuinely model agnostic as the frontier moves",
      "Drive the latency and cost budget down without loosening a single control",
    ],
    whatWeLookFor: [
      "Distributed systems depth: queues, idempotency, failure semantics under partial outage",
      "Scepticism toward agent frameworks and a clear view of when explicit state machines win",
      "Security instincts on credential scoping, egress control and untrusted input",
    ],
    open: true,
  },
  {
    id: "evaluation-engineer",
    title: "Evaluation Engineer",
    team: "Platform",
    locations: ["London", "Bengaluru"],
    type: "Full-time",
    summary:
      "Decide whether a system is allowed to reach production, and build the machinery that decides it.",
    whatYouDo: [
      "Turn a client's adjudicated case history into an evaluation suite that means something",
      "Build adversarial and prompt-injection corpora per engagement",
      "Own the release gate: a regression blocks the deploy, including when it is inconvenient",
      "Monitor drift against the week-one baseline and raise it early",
    ],
    whatWeLookFor: [
      "Experimental rigour: you know why a held-out set matters and how leakage happens",
      "Comfort disagreeing with delivery pressure while holding a working relationship",
      "Statistics that are actually applied, not recited",
    ],
    open: true,
  },
  {
    id: "domain-engineer-fincrime",
    title: "Domain Engineer, Financial Crime",
    team: "Delivery",
    locations: ["London", "Singapore"],
    type: "Full-time",
    summary:
      "The person on the pod who knows what a SAR narrative has to contain and why the typology matters.",
    whatYouDo: [
      "Translate AML and fraud operating reality into system design an engineer can build",
      "Sit with the alert queue before proposing anything that changes it",
      "Own the relationship with the MLRO through design, build and review",
    ],
    whatWeLookFor: [
      "Operational financial crime experience, ideally on the receiving end of the queue",
      "Enough technical fluency to read the code and argue with the design",
    ],
    open: true,
  },
  {
    id: "general-application",
    title: "General application",
    team: "Any",
    locations: ["Any delivery hub"],
    type: "Full-time",
    summary:
      "If the archetype describes you and no listed role fits, write to us anyway. Tell us about a system you shipped inside someone else's constraints.",
    whatYouDo: [],
    whatWeLookFor: [],
    open: true,
  },
] as const;

export const openRoles = roles.filter((role) => role.open);
