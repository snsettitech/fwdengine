/** The FDE methodology deep-dive. Opinionated on purpose. */

export const theses: readonly {
  readonly index: string;
  readonly title: string;
  readonly body: readonly string[];
}[] = [
  {
    index: "01",
    title: "Proximity beats specification",
    body: [
      "A requirements document is a lossy compression of what an operator knows. The loss is not evenly distributed: what survives is the process as it is described, and what disappears is the exception handling that is most of the actual work.",
      "An engineer sitting next to the person running the queue recovers that loss in days. No amount of discovery calls recovers it at all, because the operator does not know which of the things they do are surprising.",
    ],
  },
  {
    index: "02",
    title: "Ship weekly or the project is already failing",
    body: [
      "A weekly cadence is not a productivity habit. It is a forcing function on access. If a pod cannot ship something runnable in week two, the reason is almost always that access, environments or the control boundary are unresolved, and those problems do not improve with time.",
      "So we treat the first shipped artefact as a diagnostic. It tells us whether the engagement is real.",
    ],
  },
  {
    index: "03",
    title: "The control boundary is an architectural input",
    body: [
      "Whether a system can produce per-decision reasoning is decided by the architecture, not by a later feature request. The same is true of whether a decision can be replayed, and whether an auditor can see what the model read.",
      "This is why the boundary is agreed in week one with risk and security in the room. Not for governance theatre. Because it determines what we are allowed to build and therefore what we build.",
    ],
  },
  {
    index: "04",
    title: "The gate is the product",
    body: [
      "Every serious institution we work with has the same reservation, and it is correct: a model that can act without review is an unbounded liability. The answer is not a better model. It is a system where the consequential step is structurally reserved for a named human.",
      "Once that is true, the conversation changes from whether to deploy to where the leverage is. The leverage turns out to be enormous, because the expensive part of most decisions is assembling the evidence, not making the call.",
    ],
  },
  {
    index: "05",
    title: "Evaluation before tuning",
    body: [
      "We write the evaluation harness from the institution's own adjudicated history before touching a prompt. A public benchmark tells you how a model performs on someone else's distribution. It says nothing about yours.",
      "The harness then becomes the release gate. A regression blocks the deploy, including when blocking it is inconvenient, which is the only condition under which a gate means anything.",
    ],
  },
  {
    index: "06",
    title: "Handover is a real ending",
    body: [
      "A delivery model that can only end in a renewal is a dependency, not a capability transfer. We price and plan for both outcomes.",
      "Handover means your engineers hold the repository, the harnesses and the runbooks, and we have watched them run an incident before we leave. If that has not happened, the engagement is not finished, whatever the contract says.",
    ],
  },
] as const;

export const podComposition: readonly {
  readonly role: string;
  readonly count: string;
  readonly responsibility: string;
}[] = [
  {
    role: "Lead forward deployed engineer",
    count: "1",
    responsibility:
      "Technical authority in the room and accountable for the weekly ship. Writes code. Holds the relationship with the client's engineering and risk leadership.",
  },
  {
    role: "Platform engineer",
    count: "1 to 2",
    responsibility:
      "Owns the execution substrate inside the client estate: isolation cell, credentials, task graph, audit emission, replay.",
  },
  {
    role: "Domain engineer",
    count: "1",
    responsibility:
      "Knows the operating reality of the process being changed well enough to argue with the design. Sits with the operators before anything is proposed.",
  },
  {
    role: "Evaluation engineer",
    count: "Shared",
    responsibility:
      "Builds the harness from adjudicated history, owns the release gate, and monitors drift against the week-one baseline.",
  },
  {
    role: "Agent fleet",
    count: "Scales with volume",
    responsibility:
      "Stateless planning, retrieval, execution and guardrail agents invoked by the state machine. Operated by the pod, not by a separate managed service.",
  },
] as const;
