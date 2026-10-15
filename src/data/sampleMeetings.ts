import { Meeting, CrossMeetingTrends } from '../types/meeting';

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync',
    date: '2026-10-02',
    duration: '50 mins',
    department: 'Infrastructure & SRE',
    attendees: ['Alex Chen', 'Marcus Vance', 'Elena Rostova', 'Rachel Green'],
    createdAt: '2026-10-02T10:00:00Z',
    transcript: `Alex Chen: Welcome everyone. Today we are locking in the execution blueprint for our multi-cloud database cutover scheduled for the end of the month. Marcus, what is the status of the database read-replica benchmarks?
Marcus Vance: We completed stress tests on the Frankfurt and Virginia clusters. The latency is under 12ms for read queries, but connection pool starvation occurs when traffic hits 45,000 requests per minute during simulated burst windows.
Alex Chen: Understood. That means our connection pooling parameters in PgBouncer need an overhaul. Elena, will the frontend API client gracefully handle transient 503s or retry with exponential backoff?
Elena Rostova: Right now, our frontend client only retries once immediately. I can build an adaptive exponential backoff module with circuit-breaker telemetry by next Tuesday.
Rachel Green: From the security and compliance angle, the new cloud VPC peering must pass strict egress firewall rules and SOC2 audit log streaming before we cut over any production customer data.
Alex Chen: Great call, Rachel. Let's make sure that's a hard prerequisite before we schedule the canary release. Marcus, you will own the PgBouncer tuning and VPC routing. Elena, you take the client retry resiliency. Rachel, you audit the IAM roles and egress policies. Let's aim to have all validation completed by October 10.`,
    summary: {
      tldr: 'Aligned on the multi-cloud database cutover architecture, resolving connection pool bottlenecks under high concurrency and establishing hard compliance gates for VPC peering.',
      keyDecisions: [
        'PgBouncer configuration will be tuned to dynamically scale connection limits up to 80,000 req/min.',
        'Frontend client will introduce circuit breaker patterns and exponential backoff retry logic.',
        'SOC2 audit log streaming and egress firewall verification is established as a blocking gate before cutover.'
      ],
      criticalHighlights: [
        'Virginia and Frankfurt read-replica benchmarks confirmed sub-12ms query response times.',
        'Canary rollout scheduled for mid-October pending compliance sign-off.'
      ],
      sentiment: 'collaborative',
      risksAndBlockers: [
        'Connection pool starvation during peak load bursts requires immediate kernel & pool tuning.',
        'Security egress approvals could delay staging deployment if VPC peering certificates take longer than expected.'
      ]
    },
    actionPlan: [
      {
        id: 'act-1-1',
        meetingId: 'meet-1',
        meetingTitle: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync',
        task: 'Reconfigure PgBouncer connection pooling and simulate 80k req/min load',
        assignee: 'Marcus Vance',
        role: 'Senior SRE & Infrastructure Lead',
        responsibilities: 'Infrastructure reliability, load testing execution, and database connection pooling optimization',
        timeline: 'By Oct 8, 2026',
        deadlineDate: '2026-10-08',
        priority: 'urgent',
        status: 'completed',
        dependencies: 'Staging cluster access',
        deliverable: 'PgBouncer config repository pull request & Grafana load report'
      },
      {
        id: 'act-1-2',
        meetingId: 'meet-1',
        meetingTitle: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync',
        task: 'Implement frontend adaptive retry & circuit breaker module with telemetry',
        assignee: 'Elena Rostova',
        role: 'Staff Systems & Frontend Engineer',
        responsibilities: 'Client-side resilience, transient error handling, and end-user request protection',
        timeline: 'By Oct 6, 2026',
        deadlineDate: '2026-10-06',
        priority: 'high',
        status: 'completed',
        dependencies: 'API gateway error code spec',
        deliverable: 'TypeScript fetch wrapper with exponential backoff and unit tests'
      },
      {
        id: 'act-1-3',
        meetingId: 'meet-1',
        meetingTitle: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync',
        task: 'Audit VPC peering egress rules and verify automated SOC2 audit log ingestion',
        assignee: 'Rachel Green',
        role: 'Head of Security & Compliance',
        responsibilities: 'Regulatory compliance, network perimeter security, and audit trail enforcement',
        timeline: 'By Oct 9, 2026',
        deadlineDate: '2026-10-09',
        priority: 'urgent',
        status: 'completed',
        dependencies: 'Cloud provider IAM credentials',
        deliverable: 'Security sign-off report and SIEM ingestion dashboard'
      },
      {
        id: 'act-1-4',
        meetingId: 'meet-1',
        meetingTitle: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync',
        task: 'Draft canary release protocol and failback rollback checklist',
        assignee: 'Alex Chen',
        role: 'Lead Cloud Architect',
        responsibilities: 'Overall migration architecture, cutover command center orchestration, and rollback safety',
        timeline: 'By Oct 10, 2026',
        deadlineDate: '2026-10-10',
        priority: 'high',
        status: 'completed',
        dependencies: 'All preliminary benchmarks completed',
        deliverable: 'Canary runbook and automated disaster recovery script'
      }
    ],
    teamResponsibilities: [
      {
        member: 'Alex Chen',
        role: 'Lead Cloud Architect',
        primaryResponsibility: 'System architecture, cross-team technical governance, and cutover runbook',
        deliverables: ['Canary rollout runbook', 'Disaster recovery rollback blueprint']
      },
      {
        member: 'Marcus Vance',
        role: 'Senior SRE Lead',
        primaryResponsibility: 'Database clustering, load simulation, and connection pool stabilization',
        deliverables: ['PgBouncer production configs', 'Latency & throughput benchmark suite']
      },
      {
        member: 'Elena Rostova',
        role: 'Staff Systems Engineer',
        primaryResponsibility: 'Client-side resilience, retry policies, and error telemetry',
        deliverables: ['Resilient HTTP client SDK', 'Client-side telemetry hooks']
      },
      {
        member: 'Rachel Green',
        role: 'Head of Security & Compliance',
        primaryResponsibility: 'SOC2 perimeter validation, VPC peering rules, and audit logging compliance',
        deliverables: ['Security verification sign-off', 'SIEM log ingestion stream']
      }
    ],
    topics: [
      {
        name: 'Cloud Infrastructure & Migration',
        category: 'Infrastructure',
        weight: 9,
        sentiment: 'concerned',
        keyPoints: [
          'High concurrency connection pool limits in PgBouncer',
          'VPC peering latency under 12ms across regions'
        ]
      },
      {
        name: 'SOC2 Compliance & Security',
        category: 'Security',
        weight: 8,
        sentiment: 'neutral',
        keyPoints: [
          'Egress firewall rules audit',
          'Audit log streaming into SIEM before production cutover'
        ]
      },
      {
        name: 'Performance & Latency Optimization',
        category: 'Operations',
        weight: 7,
        sentiment: 'positive',
        keyPoints: [
          'Sub-12ms read query response times achieved',
          'Client-side circuit breaker implementation planned'
        ]
      }
    ]
  },
  {
    id: 'meet-2',
    title: 'Product Roadmap, UX Redesign & Design System Alignment',
    date: '2026-10-06',
    duration: '45 mins',
    department: 'Product & Design',
    attendees: ['Sarah Jenkins', 'Elena Rostova', 'Liam Patel', 'Alex Chen'],
    createdAt: '2026-10-06T14:00:00Z',
    transcript: `Sarah Jenkins: Thanks team. Today we are synchronizing the Q4 product roadmap. Feedback from our beta enterprise users shows high enthusiasm for the action plan tracker, but onboarding drop-off is still at 18% during the workspace configuration step.
Liam Patel: I conducted 12 user interviews last week. The friction is primarily cognitive overload: users are presented with 14 input fields upfront. If we streamline it into a progressive 3-step wizard with auto-suggested roles and smart defaults, we project drop-off will drop below 6%.
Elena Rostova: From the frontend engineering side, our design system components are ready for the wizard pattern. What we need is tight API schema alignment so that transcript uploads don't block the UI thread.
Alex Chen: On the backend, we can expose an asynchronous job queue for transcript processing with WebSocket status updates so the UI stays ultra-responsive at 60fps.
Sarah Jenkins: Fantastic. Let's prioritize the progressive onboarding wizard for Sprint 24, followed by the team responsibility matrix export feature. Liam, finish the Figma interactive prototypes by Friday. Elena, start the component scaffold on Monday. Alex, hook up the async processing endpoint.`,
    summary: {
      tldr: 'Addressed the 18% enterprise onboarding friction by approving a progressive 3-step setup wizard, paired with an asynchronous background transcript ingestion pipeline.',
      keyDecisions: [
        'Replace the 14-field onboarding form with a progressive 3-step wizard.',
        'Transition transcript analysis to an asynchronous worker model with live progress updates.',
        'Target Sprint 24 release for the revamped user onboarding flow.'
      ],
      criticalHighlights: [
        'User research demonstrated 18% drop-off was driven by upfront form cognitive overload.',
        'Design tokens and core component library confirmed ready for implementation.'
      ],
      sentiment: 'optimistic',
      risksAndBlockers: [
        'Frontend state management complexity when handling interrupted multi-step wizard sessions.',
        'Coordination between asynchronous worker notifications and client websocket listeners.'
      ]
    },
    actionPlan: [
      {
        id: 'act-2-1',
        meetingId: 'meet-2',
        meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment',
        task: 'Deliver high-fidelity interactive Figma prototype for progressive onboarding wizard',
        assignee: 'Liam Patel',
        role: 'Senior UX Researcher & Product Designer',
        responsibilities: 'User journey mapping, cognitive load minimization, and responsive design prototypes',
        timeline: 'By Oct 10, 2026',
        deadlineDate: '2026-10-10',
        priority: 'high',
        status: 'completed',
        dependencies: 'User interview synthesis findings',
        deliverable: 'Figma interactive prototype & design specification handoff doc'
      },
      {
        id: 'act-2-2',
        meetingId: 'meet-2',
        meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment',
        task: 'Scaffold 3-step onboarding wizard with auto-save and form validation',
        assignee: 'Elena Rostova',
        role: 'Staff Frontend Engineer',
        responsibilities: 'Component architecture, form state persistence, and responsive UI implementation',
        timeline: 'By Oct 14, 2026',
        deadlineDate: '2026-10-14',
        priority: 'urgent',
        status: 'in_progress',
        dependencies: 'Figma prototype approval',
        deliverable: 'React wizard components with unit tests and Storybook documentation'
      },
      {
        id: 'act-2-3',
        meetingId: 'meet-2',
        meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment',
        task: 'Deploy asynchronous transcript processing job queue endpoint with progress events',
        assignee: 'Alex Chen',
        role: 'Lead Systems Architect',
        responsibilities: 'Async queue infrastructure, background worker workers, and event broadcasting',
        timeline: 'By Oct 13, 2026',
        deadlineDate: '2026-10-13',
        priority: 'high',
        status: 'in_progress',
        dependencies: 'Redis broker provisioning',
        deliverable: 'Fast API endpoint with SSE/WebSocket progress dispatcher'
      },
      {
        id: 'act-2-4',
        meetingId: 'meet-2',
        meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment',
        task: 'Define telemetry metrics and conversion funnel dashboard in Mixpanel',
        assignee: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        responsibilities: 'Funnel analytics tracking, KPI definitions, and weekly executive conversion reporting',
        timeline: 'By Oct 15, 2026',
        deadlineDate: '2026-10-15',
        priority: 'medium',
        status: 'todo',
        dependencies: 'Wizard event naming schema',
        deliverable: 'Mixpanel onboarding funnel dashboard and target milestone KPI doc'
      }
    ],
    teamResponsibilities: [
      {
        member: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        primaryResponsibility: 'Product vision, metric definition, and sprint backlog prioritization',
        deliverables: ['PRD for Onboarding 2.0', 'Conversion funnel analytics dashboard']
      },
      {
        member: 'Liam Patel',
        role: 'Senior UX Researcher & Designer',
        primaryResponsibility: 'User research validation, UI micro-interactions, and visual design assets',
        deliverables: ['Interactive wizard prototype', 'Design token guidelines']
      },
      {
        member: 'Elena Rostova',
        role: 'Staff Frontend Engineer',
        primaryResponsibility: 'Client-side implementation, accessibility, and state caching',
        deliverables: ['Production React components', 'Automated end-to-end user flow tests']
      },
      {
        member: 'Alex Chen',
        role: 'Lead Systems Architect',
        primaryResponsibility: 'Backend queue infrastructure and real-time event streaming',
        deliverables: ['Asynchronous API workers', 'Redis job pipeline']
      }
    ],
    topics: [
      {
        name: 'Customer Onboarding Flow',
        category: 'Customer',
        weight: 9,
        sentiment: 'concerned',
        keyPoints: [
          '18% drop-off at initial workspace setup step',
          'Cognitive load reduction to 3-step progressive wizard'
        ]
      },
      {
        name: 'UX Revamp & Modernization',
        category: 'Product',
        weight: 9,
        sentiment: 'positive',
        keyPoints: [
          'Design tokens unified across web dashboards',
          'Responsive interactive export preview components'
        ]
      },
      {
        name: 'Performance & Latency Optimization',
        category: 'Operations',
        weight: 6,
        sentiment: 'positive',
        keyPoints: [
          '60fps UI responsiveness during transcript analysis',
          'Background async worker queue with SSE streaming'
        ]
      }
    ]
  },
  {
    id: 'meet-3',
    title: 'SOC2 Compliance, Security Hardening & Zero-Trust Governance',
    date: '2026-10-09',
    duration: '40 mins',
    department: 'Security & Legal',
    attendees: ['Rachel Green', 'Marcus Vance', 'David Kim', 'Sarah Jenkins'],
    createdAt: '2026-10-09T11:00:00Z',
    transcript: `Rachel Green: Good morning. Our external SOC2 Type II audit begins in 18 days. The primary focus areas are least-privilege role-based access control (RBAC), end-to-end encryption key rotation, and automated audit logging for all transcript exports.
David Kim: In the data layer, all stored transcripts and generated action plans are encrypted with AES-256 with KMS key rotation every 90 days. We also added column-level masking for any PII detected in transcripts.
Marcus Vance: On the Kubernetes side, we have isolated the worker pods with network security policies. No external internet egress is allowed except for the designated AI inference endpoints.
Rachel Green: Excellent. Sarah, what about team member role management in the dashboard? Can organization admins enforce granular view vs edit permissions on action items?
Sarah Jenkins: Currently, permissions are workspace-wide. We need to introduce role-based policies: 'Executive Viewer', 'Team Lead (Editor)', and 'Individual Contributor'. We can ship this in our next release cycle.
Rachel Green: That will satisfy the auditor requirement cleanly. Let's make sure the audit event log captures every export action—CSV, PDF, or Markdown—with the actor's user ID and timestamp.`,
    summary: {
      tldr: 'Prepared for the upcoming SOC2 Type II audit by validating KMS encryption key rotation, network pod isolation, and mandating granular RBAC with audit logging for exports.',
      keyDecisions: [
        'Enforce 3-tier RBAC permissions: Executive Viewer, Team Lead Editor, and Individual Contributor.',
        'Log every transcript export and summary download with cryptographic audit timestamps.',
        'Restrict worker pod egress traffic exclusively to authorized AI endpoints.'
      ],
      criticalHighlights: [
        'AES-256 KMS encryption and automated 90-day key rotation successfully validated.',
        'PII redaction verified across all saved meeting summaries.'
      ],
      sentiment: 'urgent',
      risksAndBlockers: [
        'Strict 18-day timeline before external auditor walkthrough.',
        'Need to verify role enforcement across older exported snapshots.'
      ]
    },
    actionPlan: [
      {
        id: 'act-3-1',
        meetingId: 'meet-3',
        meetingTitle: 'SOC2 Compliance, Security Hardening & Zero-Trust Governance',
        task: 'Implement granular 3-tier RBAC for action plans and dashboard views',
        assignee: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        responsibilities: 'Permission model specifications, user role settings UI, and security matrix documentation',
        timeline: 'By Oct 18, 2026',
        deadlineDate: '2026-10-18',
        priority: 'urgent',
        status: 'in_progress',
        dependencies: 'Security matrix specification',
        deliverable: 'Role management UI and backend authorization policy'
      },
      {
        id: 'act-3-2',
        meetingId: 'meet-3',
        meetingTitle: 'SOC2 Compliance, Security Hardening & Zero-Trust Governance',
        task: 'Implement audit logging pipeline for export actions (PDF, CSV, JSON)',
        assignee: 'David Kim',
        role: 'Data Platform Lead',
        responsibilities: 'Immutable audit ledger integration, event schemas, and SIEM forwarding',
        timeline: 'By Oct 16, 2026',
        deadlineDate: '2026-10-16',
        priority: 'high',
        status: 'todo',
        dependencies: 'Event stream schema',
        deliverable: 'Structured audit logger middleware and SIEM forwarding pipeline'
      },
      {
        id: 'act-3-3',
        meetingId: 'meet-3',
        meetingTitle: 'SOC2 Compliance, Security Hardening & Zero-Trust Governance',
        task: 'Apply strict Kubernetes NetworkPolicies to lock worker pod egress',
        assignee: 'Marcus Vance',
        role: 'Senior SRE Lead',
        responsibilities: 'Cluster network security, ingress/egress policy verification, and automated vulnerability scanning',
        timeline: 'By Oct 14, 2026',
        deadlineDate: '2026-10-14',
        priority: 'high',
        status: 'completed',
        dependencies: 'AI endpoint domain allowlist',
        deliverable: 'Kubernetes network policy manifests and egress penetration test report'
      },
      {
        id: 'act-3-4',
        meetingId: 'meet-3',
        meetingTitle: 'SOC2 Compliance, Security Hardening & Zero-Trust Governance',
        task: 'Compile SOC2 Type II readiness dossier for external audit firm',
        assignee: 'Rachel Green',
        role: 'Head of Security & Compliance',
        responsibilities: 'Audit compliance evidence collection, risk register updates, and executive briefing',
        timeline: 'By Oct 21, 2026',
        deadlineDate: '2026-10-21',
        priority: 'urgent',
        status: 'todo',
        dependencies: 'Completion of RBAC and audit logging tasks',
        deliverable: 'SOC2 Type II Evidence Binder & Auditor Walkthrough Deck'
      }
    ],
    teamResponsibilities: [
      {
        member: 'Rachel Green',
        role: 'Head of Security & Compliance',
        primaryResponsibility: 'Audit lead, security policy governance, and compliance sign-offs',
        deliverables: ['SOC2 Compliance Package', 'Third-party auditor evidence log']
      },
      {
        member: 'David Kim',
        role: 'Data Platform Lead',
        primaryResponsibility: 'Data encryption, KMS rotation, and immutable audit trails',
        deliverables: ['Export audit trail service', 'PII detection and masking filter']
      },
      {
        member: 'Marcus Vance',
        role: 'Senior SRE Lead',
        primaryResponsibility: 'Zero-trust network perimeter and container security policies',
        deliverables: ['NetworkPolicy manifests', 'Vulnerability scanning reports']
      },
      {
        member: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        primaryResponsibility: 'RBAC user experience and role configuration workflows',
        deliverables: ['RBAC PRD and access management settings']
      }
    ],
    topics: [
      {
        name: 'SOC2 Compliance & Security',
        category: 'Security',
        weight: 10,
        sentiment: 'concerned',
        keyPoints: [
          'External audit starts in 18 days',
          'AES-256 KMS automated key rotation validated',
          'Immutable audit logging required for all data exports'
        ]
      },
      {
        name: 'Access Control & RBAC',
        category: 'Security',
        weight: 8,
        sentiment: 'neutral',
        keyPoints: [
          'Three-tier role hierarchy: Viewer, Editor, Contributor',
          'Granular permissions per meeting dashboard'
        ]
      },
      {
        name: 'Cloud Infrastructure & Migration',
        category: 'Infrastructure',
        weight: 6,
        sentiment: 'positive',
        keyPoints: [
          'Kubernetes NetworkPolicies enforce zero-trust egress',
          'Isolated worker pods for AI processing'
        ]
      }
    ]
  },
  {
    id: 'meet-4',
    title: 'Customer Onboarding Friction & Latency Incident Post-Mortem',
    date: '2026-10-12',
    duration: '60 mins',
    department: 'Incident Response & Quality',
    attendees: ['Sarah Jenkins', 'Marcus Vance', 'Alex Chen', 'Elena Rostova'],
    createdAt: '2026-10-12T16:00:00Z',
    transcript: `Marcus Vance: Let's review the incident from October 11 at 14:20 UTC. A batch of 80 enterprise customers simultaneously uploaded quarterly all-hands meeting transcripts. The spike caused CPU saturation on our database primary, resulting in 9.4s P99 latency and 42 failed requests.
Alex Chen: Root cause analysis revealed that the database full-text search index was rebuilding synchronously during bulk transcript insert queries. We need to decouple the raw transcript storage from the search indexing via an asynchronous event bus.
Sarah Jenkins: This directly impacted the onboarding cohort we discussed in last week's meeting. Two enterprise clients flagged the delay in chat support.
Elena Rostova: On the frontend dashboard, when requests took longer than 5 seconds, the UI didn't show a clear progress breakdown, leading users to repeatedly click the 'Analyze' button, worsening the traffic surge!
Alex Chen: Good catch. Elena, can we add optimistic debouncing and a live multi-stage progress indicator ('Parsing Transcript', 'Extracting Roles & Action Plan', 'Synthesizing Trends')?
Marcus Vance: And on backend infrastructure, I will provision read-replicas for search queries and set an autoscaling threshold triggered at 65% CPU.
Sarah Jenkins: Excellent resolution plan. Let's make sure this post-mortem is documented and all preventative actions are tracked on our high-priority board.`,
    summary: {
      tldr: 'Conducted post-mortem on the Oct 11 latency incident, identifying synchronous full-text search indexing as the root cause of CPU saturation, and committing to architectural decoupling and frontend debouncing.',
      keyDecisions: [
        'Decouple transcript ingestion from search indexing using asynchronous event queuing.',
        'Add UI debouncing and a multi-stage real-time progress indicator to prevent repeat submission floods.',
        'Scale read-replicas automatically when database CPU exceeds 65%.'
      ],
      criticalHighlights: [
        'P99 latency surged to 9.4s during synchronous batch processing before recovery.',
        'No customer data was corrupted; all 42 failed requests were recovered via dead-letter retry.'
      ],
      sentiment: 'critical',
      risksAndBlockers: [
        'Customer confidence risk if latency spikes recur during upcoming enterprise onboarding wave.',
        'Database replication lag must remain under 50ms during asynchronous indexing.'
      ]
    },
    actionPlan: [
      {
        id: 'act-4-1',
        meetingId: 'meet-4',
        meetingTitle: 'Customer Onboarding Friction & Latency Incident Post-Mortem',
        task: 'Decouple full-text search indexing into background worker queue',
        assignee: 'Alex Chen',
        role: 'Lead Systems Architect',
        responsibilities: 'Event queue architecture, indexing worker decoupling, and transaction isolation',
        timeline: 'By Oct 15, 2026',
        deadlineDate: '2026-10-15',
        priority: 'urgent',
        status: 'in_progress',
        dependencies: 'Event bus worker queue',
        deliverable: 'Asynchronous indexing microservice & test benchmark'
      },
      {
        id: 'act-4-2',
        meetingId: 'meet-4',
        meetingTitle: 'Customer Onboarding Friction & Latency Incident Post-Mortem',
        task: 'Implement multi-stage upload progress stepper and button click debouncing',
        assignee: 'Elena Rostova',
        role: 'Staff Frontend Engineer',
        responsibilities: 'UI loading states, debounced form actions, and multi-stage user progress feedback',
        timeline: 'By Oct 14, 2026',
        deadlineDate: '2026-10-14',
        priority: 'urgent',
        status: 'completed',
        dependencies: 'UI design specifications',
        deliverable: 'Multi-stage progress stepper component with auto-lock on submission'
      },
      {
        id: 'act-4-3',
        meetingId: 'meet-4',
        meetingTitle: 'Customer Onboarding Friction & Latency Incident Post-Mortem',
        task: 'Configure database autoscaling alerts and read-replica offloading for queries',
        assignee: 'Marcus Vance',
        role: 'Senior SRE Lead',
        responsibilities: 'Database scaling rules, alerting policies, and failover health checks',
        timeline: 'By Oct 16, 2026',
        deadlineDate: '2026-10-16',
        priority: 'high',
        status: 'todo',
        dependencies: 'Cloud database metrics API',
        deliverable: 'Terraform autoscaling rules & PagerDuty notification policies'
      },
      {
        id: 'act-4-4',
        meetingId: 'meet-4',
        meetingTitle: 'Customer Onboarding Friction & Latency Incident Post-Mortem',
        task: 'Draft incident transparency note and communicate resolution to affected clients',
        assignee: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        responsibilities: 'Customer success communications, executive incident summary, and retention assurance',
        timeline: 'By Oct 13, 2026',
        deadlineDate: '2026-10-13',
        priority: 'high',
        status: 'completed',
        dependencies: 'Incident RCA approval',
        deliverable: 'Customer-facing Root Cause Analysis letter & customer success briefing'
      }
    ],
    teamResponsibilities: [
      {
        member: 'Alex Chen',
        role: 'Lead Systems Architect',
        primaryResponsibility: 'System decoupling, asynchronous architecture, and database write resilience',
        deliverables: ['Search indexing background pipeline', 'Queue performance report']
      },
      {
        member: 'Elena Rostova',
        role: 'Staff Frontend Engineer',
        primaryResponsibility: 'User feedback during heavy processing, debouncing, and perceived performance',
        deliverables: ['Multi-stage progress indicator', 'Form submission guardrails']
      },
      {
        member: 'Marcus Vance',
        role: 'Senior SRE Lead',
        primaryResponsibility: 'Database resource scaling, CPU alerting, and cluster high availability',
        deliverables: ['Autoscaling configurations', 'Grafana incident telemetry dashboard']
      },
      {
        member: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        primaryResponsibility: 'Customer communication, SLA protection, and feature quality assurance',
        deliverables: ['Customer RCA communications', 'SLA impact assessment']
      }
    ],
    topics: [
      {
        name: 'Performance & Latency Optimization',
        category: 'Operations',
        weight: 10,
        sentiment: 'concerned',
        keyPoints: [
          'P99 latency spiked to 9.4s under concurrent transcript batch processing',
          'Synchronous search indexing identified as primary root cause'
        ]
      },
      {
        name: 'Customer Onboarding Flow',
        category: 'Customer',
        weight: 8,
        sentiment: 'concerned',
        keyPoints: [
          'Customer onboarding cohort directly exposed to processing latency',
          'Transparent incident communication dispatched'
        ]
      },
      {
        name: 'Cloud Infrastructure & Migration',
        category: 'Infrastructure',
        weight: 7,
        sentiment: 'neutral',
        keyPoints: [
          'Database read-replicas offloading search traffic',
          'Autoscaling threshold set at 65% CPU'
        ]
      }
    ]
  },
  {
    id: 'meet-5',
    title: 'Executive Strategy & Q4 Delivery Milestones Review',
    date: '2026-10-15',
    duration: '50 mins',
    department: 'Executive Leadership',
    attendees: ['Michael Scott', 'Sarah Jenkins', 'Alex Chen', 'Rachel Green'],
    createdAt: '2026-10-15T09:00:00Z',
    transcript: `Michael Scott: Welcome leadership team. We are at the midpoint of October. Today we need a holistic view of where our team time and energy is going, how we are tracking against Q4 deliverables, and whether our cross-functional priorities align.
Sarah Jenkins: On the product front, the onboarding redesign wizard is in staging, and user testing confirms drop-off collapsed from 18% down to 4.2%! We also rolled out exportable action plan dashboards in CSV, PDF, and Markdown formats.
Alex Chen: From engineering and infrastructure, the database search indexing decoupling is live. Latency has dropped from 9.4s back down to 310ms P99, and our cloud migration readiness score is currently at 94%.
Rachel Green: Security-wise, the 3-tier RBAC framework is in code review, and our SOC2 audit evidence packet is 85% populated. The auditor walkthrough will proceed as planned next week.
Michael Scott: This is outstanding execution across all fronts. Looking at our trend trajectory, the common themes that occupied our attention over the past three weeks—cloud migration, onboarding UX, latency fixes, and SOC2 compliance—are all transitioning from high-risk blockers into stabilized operational assets. Let's ensure the action plan dashboard remains the single source of truth for all assignees.`,
    summary: {
      tldr: 'Executive leadership reviewed cross-functional Q4 milestones: onboarding drop-off plummeted to 4.2%, P99 latency dropped to 310ms, and SOC2 audit readiness reached 85%.',
      keyDecisions: [
        'Greenlit the public release of the redesigned onboarding wizard for all new organizations.',
        'Approved the final SOC2 audit schedule with external evaluation team.',
        'Established the Action Plan Dashboard as the mandatory single source of truth across all product engineering squads.'
      ],
      criticalHighlights: [
        'Onboarding conversion surged: drop-off dropped from 18% to 4.2%.',
        'P99 latency stabilized at 310ms following asynchronous architecture rollout.',
        'Cloud migration readiness evaluated at 94% ahead of final cutover.'
      ],
      sentiment: 'optimistic',
      risksAndBlockers: [
        'Ensure continuous monitoring during the SOC2 audit week to avoid code freeze friction.',
        'Team bandwidth needs buffer following intense incident remediation sprint.'
      ]
    },
    actionPlan: [
      {
        id: 'act-5-1',
        meetingId: 'meet-5',
        meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review',
        task: 'Publish company-wide Q4 Milestone Progress report and executive dashboard',
        assignee: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        responsibilities: 'Executive reporting, company alignment, and milestone communication',
        timeline: 'By Oct 19, 2026',
        deadlineDate: '2026-10-19',
        priority: 'high',
        status: 'todo',
        dependencies: 'Final engineering metrics confirmation',
        deliverable: 'Executive summary slide deck and public changelog entry'
      },
      {
        id: 'act-5-2',
        meetingId: 'meet-5',
        meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review',
        task: 'Execute final dry-run cutover rehearsal for multi-cloud database',
        assignee: 'Alex Chen',
        role: 'Lead Cloud Architect',
        responsibilities: 'Dry-run coordination, DNS TTL adjustments, and latency monitoring during failover',
        timeline: 'By Oct 20, 2026',
        deadlineDate: '2026-10-20',
        priority: 'urgent',
        status: 'todo',
        dependencies: 'All staging tests passing',
        deliverable: 'Dry-run post-mortem report and cutover sign-off certificate'
      },
      {
        id: 'act-5-3',
        meetingId: 'meet-5',
        meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review',
        task: 'Finalize auditor interview scheduling and evidence repository access',
        assignee: 'Rachel Green',
        role: 'Head of Security & Compliance',
        responsibilities: 'Auditor management, evidence access permissions, and compliance liaison',
        timeline: 'By Oct 18, 2026',
        deadlineDate: '2026-10-18',
        priority: 'urgent',
        status: 'todo',
        dependencies: 'RBAC code merge',
        deliverable: 'Confirmed auditor schedule and evidence access logs'
      },
      {
        id: 'act-5-4',
        meetingId: 'meet-5',
        meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review',
        task: 'Review team sprint capacity and schedule post-migration wellness day',
        assignee: 'Michael Scott',
        role: 'VP of Engineering & Operations',
        responsibilities: 'Team health, burnout prevention, and resource sustainability',
        timeline: 'By Oct 22, 2026',
        deadlineDate: '2026-10-22',
        priority: 'medium',
        status: 'todo',
        dependencies: 'Cutover completion',
        deliverable: 'Team capacity plan for Q1 2027 and wellness schedule'
      }
    ],
    teamResponsibilities: [
      {
        member: 'Michael Scott',
        role: 'VP of Engineering',
        primaryResponsibility: 'Executive leadership, team resource allocation, and organizational velocity',
        deliverables: ['Executive roadmap approval', 'Team capacity allocation plan']
      },
      {
        member: 'Sarah Jenkins',
        role: 'Principal Product Manager',
        primaryResponsibility: 'Product delivery tracking, customer sentiment synthesis, and milestone sign-offs',
        deliverables: ['Company-wide Q4 Milestone Report', 'Feature release documentation']
      },
      {
        member: 'Alex Chen',
        role: 'Lead Cloud Architect',
        primaryResponsibility: 'Cloud cutover governance, architectural resilience, and failover validation',
        deliverables: ['Dry-run cutover report', 'Architecture sign-off certificate']
      },
      {
        member: 'Rachel Green',
        role: 'Head of Security & Compliance',
        primaryResponsibility: 'SOC2 external audit leadership and zero-trust policy enforcement',
        deliverables: ['SOC2 Audit Readiness Binder', 'Auditor walkthrough schedule']
      }
    ],
    topics: [
      {
        name: 'Cloud Infrastructure & Migration',
        category: 'Infrastructure',
        weight: 9,
        sentiment: 'positive',
        keyPoints: [
          'Readiness evaluated at 94%',
          'Final dry-run cutover scheduled for Oct 20'
        ]
      },
      {
        name: 'Customer Onboarding Flow',
        category: 'Customer',
        weight: 8,
        sentiment: 'positive',
        keyPoints: [
          'Drop-off reduced from 18% to 4.2%',
          'Enterprise feedback overwhelmingly positive'
        ]
      },
      {
        name: 'Performance & Latency Optimization',
        category: 'Operations',
        weight: 8,
        sentiment: 'positive',
        keyPoints: [
          'P99 latency down to 310ms',
          'Decoupled search indexing running smoothly'
        ]
      },
      {
        name: 'SOC2 Compliance & Security',
        category: 'Security',
        weight: 8,
        sentiment: 'positive',
        keyPoints: [
          'Evidence packet 85% complete',
          'Auditor walkthrough on track for next week'
        ]
      }
    ]
  }
];

export const INITIAL_TRENDS: CrossMeetingTrends = {
  commonTopics: [
    {
      topic: 'Cloud Infrastructure & Migration',
      category: 'Infrastructure',
      totalMentions: 4,
      trend: 'rising',
      averageIntensity: 8.0,
      summaryInsight: 'Central architectural initiative discussed across 4 meetings. Progressed from connection pool bottlenecks to 94% cutover readiness.',
      meetingsAppeared: [
        { meetingId: 'meet-1', meetingTitle: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync', date: '2026-10-02', intensity: 9, sentiment: 'concerned' },
        { meetingId: 'meet-2', meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment', date: '2026-10-06', intensity: 6, sentiment: 'positive' },
        { meetingId: 'meet-3', meetingTitle: 'SOC2 Compliance, Security Hardening & Zero-Trust Governance', date: '2026-10-09', intensity: 6, sentiment: 'positive' },
        { meetingId: 'meet-5', meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review', date: '2026-10-15', intensity: 9, sentiment: 'positive' }
      ]
    },
    {
      topic: 'Performance & Latency Optimization',
      category: 'Operations',
      totalMentions: 4,
      trend: 'steady',
      averageIntensity: 7.8,
      summaryInsight: 'Spiked during the Oct 11 incident (9.4s P99), successfully resolved down to 310ms through asynchronous search index decoupling.',
      meetingsAppeared: [
        { meetingId: 'meet-1', meetingTitle: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync', date: '2026-10-02', intensity: 7, sentiment: 'positive' },
        { meetingId: 'meet-2', meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment', date: '2026-10-06', intensity: 6, sentiment: 'positive' },
        { meetingId: 'meet-4', meetingTitle: 'Customer Onboarding Friction & Latency Incident Post-Mortem', date: '2026-10-12', intensity: 10, sentiment: 'concerned' },
        { meetingId: 'meet-5', meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review', date: '2026-10-15', intensity: 8, sentiment: 'positive' }
      ]
    },
    {
      topic: 'Customer Onboarding Flow',
      category: 'Customer',
      totalMentions: 3,
      trend: 'rising',
      averageIntensity: 8.3,
      summaryInsight: 'Direct user journey optimization. Transformed from an 18% drop-off bottleneck into a high-converting 3-step progressive wizard with 4.2% drop-off.',
      meetingsAppeared: [
        { meetingId: 'meet-2', meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment', date: '2026-10-06', intensity: 9, sentiment: 'concerned' },
        { meetingId: 'meet-4', meetingTitle: 'Customer Onboarding Friction & Latency Incident Post-Mortem', date: '2026-10-12', intensity: 8, sentiment: 'concerned' },
        { meetingId: 'meet-5', meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review', date: '2026-10-15', intensity: 8, sentiment: 'positive' }
      ]
    },
    {
      topic: 'SOC2 Compliance & Security',
      category: 'Security',
      totalMentions: 3,
      trend: 'rising',
      averageIntensity: 8.7,
      summaryInsight: 'Strict external audit gate. Progressed from VPC egress policies to 3-tier RBAC and 85% audit evidence binder completion.',
      meetingsAppeared: [
        { meetingId: 'meet-1', meetingTitle: 'Q4 Infrastructure Architecture & Multi-Cloud Migration Sync', date: '2026-10-02', intensity: 8, sentiment: 'neutral' },
        { meetingId: 'meet-3', meetingTitle: 'SOC2 Compliance, Security Hardening & Zero-Trust Governance', date: '2026-10-09', intensity: 10, sentiment: 'concerned' },
        { meetingId: 'meet-5', meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review', date: '2026-10-15', intensity: 8, sentiment: 'positive' }
      ]
    },
    {
      topic: 'UX Revamp & Modernization',
      category: 'Product',
      totalMentions: 2,
      trend: 'steady',
      averageIntensity: 8.0,
      summaryInsight: 'Unified design tokens and interactive action plan dashboards implemented with high user delight.',
      meetingsAppeared: [
        { meetingId: 'meet-2', meetingTitle: 'Product Roadmap, UX Redesign & Design System Alignment', date: '2026-10-06', intensity: 9, sentiment: 'positive' },
        { meetingId: 'meet-5', meetingTitle: 'Executive Strategy & Q4 Delivery Milestones Review', date: '2026-10-15', intensity: 7, sentiment: 'positive' }
      ]
    }
  ],
  sentimentTimeline: [
    { date: '2026-10-02', meetingTitle: 'Cloud Migration Sync', optimismScore: 78, urgencyScore: 65 },
    { date: '2026-10-06', meetingTitle: 'Roadmap & UX Alignment', optimismScore: 86, urgencyScore: 50 },
    { date: '2026-10-09', meetingTitle: 'SOC2 Compliance Sync', optimismScore: 68, urgencyScore: 88 },
    { date: '2026-10-12', meetingTitle: 'Latency Post-Mortem', optimismScore: 48, urgencyScore: 94 },
    { date: '2026-10-15', meetingTitle: 'Executive Review', optimismScore: 92, urgencyScore: 42 }
  ],
  recurringBlockers: [
    'Database search indexing contention under synchronous bulk uploads (Resolved via async worker decoupling)',
    'Cognitive overload in initial user onboarding form (Resolved via 3-step progressive wizard)',
    'Tight timeline constraints ahead of the external SOC2 Type II audit (Mitigated with automated audit trail ingestion)'
  ],
  executiveTakeaways: [
    'Cross-functional agility is exceptionally high: latency incidents were diagnosed, decoupled, and tested within a 72-hour window.',
    'Systematic shift from reactive bug-fixing to proactive compliance hardening and user-centric UX redesign.',
    'Action item accountability is sharply defined with explicit member roles, timelines, and deliverables.'
  ]
};

export const SAMPLE_TRANSCRIPT_PRESETS = [
  {
    name: 'Growth & Marketing Strategy Sync',
    department: 'Marketing & Growth',
    suggestedTitle: 'Q4 Enterprise Inbound & Product-Led Growth Review',
    transcript: `Jessica Taylor: Good morning team. Today we need to tackle our Q4 enterprise acquisition funnel. Currently, MQL-to-SQL conversion is at 14%, below our 22% target.
Tom Bradley: Our analysis shows that enterprise leads request a custom security and compliance whitepaper before booking an executive demo. Right now, our sales reps send a generic 2-page PDF.
Maya Lin: If we create an automated interactive compliance assessment tool on our website, prospects can self-certify requirements in 2 minutes. We can also integrate it with HubSpot.
Jessica Taylor: Love that idea. Maya, can you design the interactive assessment prototype by Oct 24?
Tom Bradley: I will write the enterprise compliance copy and coordinate with Rachel Green from SecOps for technical validation.
Jessica Taylor: Perfect. I will set up the HubSpot routing workflow and tracking dashboards so sales reps get instant alerts when an enterprise lead completes the assessment.`
  },
  {
    name: 'Mobile App Beta Launch Readiness',
    department: 'Mobile Engineering',
    suggestedTitle: 'iOS & Android Beta Launch Readiness & Bug Triage',
    transcript: `Carlos Mendez: Alright team, TestFlight beta build 42 is out. We have 450 active beta testers. Overall crash rate is 0.12%, well below our 0.5% threshold.
Aisha Patel: The main issue reported is push notification delivery lag in low-power mode on iOS 18. Apple's APNs priority needs to be set to 'immediate' for urgent action item reminders.
Carlos Mendez: Let's make sure that fix is in build 43. Aisha, can you push that APNs payload update today?
Aisha Patel: Yes, will submit PR by 3 PM.
Kevin Zhao: What about the offline storage sync? When users go offline in the subway, pending task edits were failing to re-sync when network returned.
Carlos Mendez: Kevin, you own the SQLite synchronization layer. Can you add persistent transactional queuing by Friday?
Kevin Zhao: Absolutely, already drafted the state machine.
Carlos Mendez: Great, let's target public release for the first week of November.`
  }
];
