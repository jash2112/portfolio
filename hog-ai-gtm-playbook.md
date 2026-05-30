# The Hog AI — GTM Playbook

> **Version:** 1.0 · **Date:** May 2026  
> Built for: Seed → Series A growth motion  
> Founders: Hudson Liao & Paulo Nascimento (YC F25)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [ICP — Ideal Customer Profile](#2-icp--ideal-customer-profile)
   - [ICP Discovery Agent](#icp-discovery-agent)
3. [Competitive Landscape](#3-competitive-landscape)
   - [Competitive Intelligence Agent](#competitive-intelligence-agent)
4. [Positioning & Messaging](#4-positioning--messaging)
5. [GTM Motion & Channel Strategy](#5-gtm-motion--channel-strategy)
6. [Funnel Architecture](#6-funnel-architecture)
7. [Metrics & OKRs](#7-metrics--okrs)
8. [90-Day Execution Calendar](#8-90-day-execution-calendar)

---

## 1. Executive Summary

**What The Hog is:**  
An AI-native GTM command center that predicts and converts your next customer *before* they enter the market. At its core sits **The Hog Mind** — a proprietary Contributory Global Graph that fuses real-time social listening (Reddit, LinkedIn, X, forums, review sites) with advanced identity resolution, turning raw internet chatter into ranked, actionable game plans.

**Why now:**  
- Traditional enrichment tools (Clay, ZoomInfo, Apollo) rely on stale B2B databases. Intent signals decay in hours, not months.  
- GTM teams are drowning in point solutions — 12+ tools for data, outreach, and analytics with zero unified intelligence layer.  
- Agentic AI workflows now let a 2-person GTM team operate at the throughput of a 20-person team.

**One-liner:**  
> *"The Hog turns the live internet into your best sales rep."*

**Target ARR milestones:**  
| Phase | Timeline | ARR Target |
|---|---|---|
| Seed traction | Month 0–6 | $250K ARR |
| Series A readiness | Month 6–18 | $2M ARR |
| Series A post | Month 18–30 | $8M ARR |

---

## 2. ICP — Ideal Customer Profile

### Primary ICP: "The Lean GTM Builder"

#### Firmographic Signals

| Dimension | Target |
|---|---|
| **Company stage** | Series A–B ($3M–$30M ARR) |
| **Headcount** | 20–150 employees |
| **GTM team size** | 1–5 person sales/marketing team |
| **Vertical** | B2B SaaS (PLG or hybrid motion) |
| **Geography** | North America primary; Western Europe secondary |
| **Funding** | VC-backed within last 18 months |
| **Tech stack signals** | HubSpot/Salesforce + Clay or Apollo in stack |

#### Psychographic Signals

| Dimension | Detail |
|---|---|
| **Pain** | "We have 8 tools, none of them talk to each other, and our outbound is spray-and-pray" |
| **Aspiration** | Operate like a 20-person GTM team with 3 people |
| **Trigger moments** | Missed a quarterly pipeline number; burned by a bad hire; recently switched CRM |
| **Job title buyers** | Head of Growth, VP Sales, VP Marketing, Founder/CEO (companies <50) |
| **Job title champions** | Growth Engineer, RevOps Lead, SDR Manager |

#### Behavioral / Intent Signals (The Hog's native moat)

These are signals The Hog can detect via its own platform, making ICP refinement self-reinforcing:

1. **Complaining about competitors** — Reddit/LinkedIn posts mentioning "Clay is too expensive," "Apollo data is stale," "ZoomInfo contract renewal"
2. **Hiring signal** — Active JD for SDR, Growth Engineer, or RevOps within last 30 days
3. **Community activity** — Posting in RevGenius, GTMfund Slack, Pavilion with pipeline/attribution questions
4. **Product launch buzz** — Recent Product Hunt launch or G2 review spike suggesting GTM ramp
5. **Funding announcement** — Series A/B press release within last 60 days

#### Secondary ICP: "The Agency Builder"

| Dimension | Target |
|---|---|
| **Company type** | GTM agency or fractional CMO/CRO firm |
| **Client base** | Manages 5–20 B2B SaaS clients |
| **Pain** | Client reporting is manual; competitor tracking is reactive |
| **Value prop** | White-label The Hog's intelligence layer across their book of business |

#### Anti-ICP (Do Not Target)

- Enterprise companies (>1,000 employees) — procurement cycles and security reviews kill velocity
- Non-B2B (e-commerce, D2C, consumer apps) — intent signal model doesn't translate
- Companies with <$1M ARR — no budget, too early for structured GTM
- Teams already running Demandbase or 6sense at scale — switching cost too high

---

### ICP Discovery Agent

**Agent Name:** `hog-icp-agent`  
**Agent Type:** Continuous Refinement Agent (CRA)  
**Trigger:** Runs on a daily cadence + fires on new customer win/loss events

#### Purpose

Most startups define ICP once and forget it. The Hog's own platform makes ICP a *living document* — the ICP Discovery Agent continuously ingests win/loss data, social signals, and product usage to sharpen targeting without human effort.

#### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ICP Discovery Agent                         │
│                                                                 │
│  INPUTS                                                         │
│  ├── CRM win/loss data (HubSpot/Salesforce webhook)            │
│  ├── The Hog Mind API: new customer social footprints          │
│  ├── Product usage telemetry (feature adoption per segment)     │
│  └── Interview transcripts (Gong/Chorus call recordings)        │
│                                                                 │
│  REASONING LOOP                                                 │
│  ├── Step 1: Extract firmographic + behavioral attributes       │
│  │           from all new closed-won accounts                   │
│  ├── Step 2: Cluster accounts by shared signal patterns         │
│  ├── Step 3: Score clusters by LTV, payback period, NPS        │
│  ├── Step 4: Diff against current ICP definition               │
│  └── Step 5: Draft ICP update proposal (human review gate)     │
│                                                                 │
│  OUTPUTS                                                        │
│  ├── Weekly ICP Drift Report → Slack #gtm-intel                │
│  ├── Updated ICP score card (JSON) → CRM auto-tag update       │
│  ├── New signal rules pushed to The Hog Mind monitoring        │
│  └── Flagged anti-ICP accounts for deprioritization            │
└─────────────────────────────────────────────────────────────────┘
```

#### Agent Behavior Specification

| Property | Value |
|---|---|
| **Model** | Claude Opus (reasoning depth required) |
| **Memory** | Persistent — maintains ICP version history |
| **Human-in-loop** | Yes — ICP changes require founder approval before propagation |
| **Cadence** | Daily signal ingestion; weekly synthesis report; monthly ICP review |
| **Tool calls** | Hog Mind API, CRM webhooks, Gong transcript API, Slack output |

#### Sample Agent Prompt (System)

```
You are the ICP Discovery Agent for The Hog. Your job is to continuously 
analyze closed-won customer data and live intent signals to keep our 
Ideal Customer Profile accurate and current.

Each week you will:
1. Pull all new closed-won accounts from the last 7 days
2. Extract firmographic (size, stage, vertical, tech stack) and 
   behavioral attributes (signal type, time-to-close, champion title)
3. Compare against the current ICP definition stored in memory
4. Flag any emerging patterns that deviate from or strengthen the ICP
5. Produce a concise ICP Drift Report with a recommended action 
   (update ICP, maintain ICP, or investigate anomaly)

Never update the ICP autonomously. Always produce a draft and flag 
it for human review before any downstream propagation.
```

#### Success Metrics

- ICP accuracy score (% of closed-won accounts matching ICP at time of first touch): target >75%
- Time from pattern emergence to ICP update: target <7 days
- False positive rate in Hog Mind signal alerts: target <15%

---

## 3. Competitive Landscape

### Market Map

```
                    REAL-TIME INTELLIGENCE
                           ▲
                           │
              [THE HOG]────┼──────[Common Room]
               (social     │      (community-led)
               signals +   │
               identity)   │
                           │
[Bombora]──────────────────┼──────[6sense / Demandbase]
(intent data              │      (ABM / predictive)
 B2B database)            │
                           │
              [Clay]───────┼──────[Apollo]
               (enrichment │      (database +
               workflows)  │       sequences)
                           ▼
                    STATIC DATABASE
```

### Head-to-Head Competitive Table

| Competitor | Core Strength | Core Weakness | The Hog's Wedge |
|---|---|---|---|
| **Clay** | Flexible enrichment waterfall; workflow automation | Data is still pull-based from static sources; no real-time signals; expensive at scale | Hog is push-based — signals find YOU; no manual workflow building |
| **Apollo** | Large contact database; built-in sequences | Data staleness (verified once quarterly); weak intent signals; generic outreach | Hog predicts who's *in-market now*, not who exists in a database |
| **ZoomInfo** | Breadth of B2B data; enterprise trust | Enterprise-only pricing ($20K+/yr); stale data; no social listening; long contracts | Hog is SMB-friendly, real-time, and self-serve |
| **6sense / Demandbase** | Deep ABM intent; account scoring | $60K–$150K ACV; requires large marketing team to operationalize; 6–12 month sales cycles | Hog is 10x cheaper, self-serve in minutes, and works for 5-person GTM teams |
| **Warmly** | Website deanonymization; real-time visitor alerts | Only captures people already on your site; no proactive social listening | Hog captures demand *before* prospects visit your site |
| **Bombora** | Established B2B intent taxonomy; breadth | Lagging signals (aggregated monthly); no identity resolution; no action layer | Hog's signals are hours/days old, not weeks; includes an action layer |
| **Common Room** | Community + product signal fusion | Requires community surface (Slack, Discord, GitHub) to exist; no outbound intelligence | Hog covers any internet surface, not just owned communities |

### Competitive Narrative (Talk Track)

**When prospect mentions Clay:**
> "Clay is great at enriching contacts you already know about. The Hog finds contacts you don't know about yet — people actively complaining about your competitors or asking for exactly what you do on Reddit and LinkedIn right now. They're complementary at first; The Hog feeds Clay the leads."

**When prospect mentions Apollo:**
> "Apollo gives you a database of who *exists*. The Hog tells you who's *in-market this week*. An Apollo record might be verified 90 days ago. The Hog pulled that same person's intent signal 4 hours ago."

**When prospect mentions 6sense:**
> "6sense is incredible — if you have a $60K budget and a 3-person ABM team. The Hog gives you 80% of the value for 10% of the price and zero implementation time. You're up in a day, not a quarter."

---

### Competitive Intelligence Agent

**Agent Name:** `hog-competitive-agent`  
**Agent Type:** Persistent Monitoring Agent (PMA)  
**Trigger:** Always-on with 4-hour sweep cycles + instant alerts on high-signal events

#### Purpose

Competitive positioning rots fast in AI GTM. A competitor can ship a new feature, run a G2 review campaign, or post a teardown thread that reshapes how buyers think — all in 48 hours. The Competitive Intelligence Agent keeps The Hog's positioning razor-sharp without requiring manual research.

#### Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                  Competitive Intelligence Agent                    │
│                                                                    │
│  MONITORING SURFACES (via The Hog Mind API)                       │
│  ├── Reddit: r/sales, r/entrepreneur, r/startups, r/SaaS          │
│  ├── LinkedIn: competitor employee posts, product announcements    │
│  ├── G2 / Capterra: new reviews on Clay, Apollo, ZoomInfo, Warmly │
│  ├── Twitter/X: competitor @mentions, founder threads              │
│  ├── Hacker News: competitor launch posts, Show HN                 │
│  └── Job boards: competitor engineering/GTM hires (product signal) │
│                                                                    │
│  REASONING LOOP (4-hour cycle)                                     │
│  ├── Step 1: Ingest new signal batch from Hog Mind                │
│  ├── Step 2: Classify signal type                                  │
│  │   ├── PRODUCT: new feature/pricing change                       │
│  │   ├── REPUTATION: positive/negative sentiment shift             │
│  │   ├── MARKET: category narrative change                         │
│  │   └── OPPORTUNITY: competitor customer expressing pain          │
│  ├── Step 3: Score signal urgency (P0/P1/P2)                      │
│  ├── Step 4: Draft recommended GTM response                        │
│  └── Step 5: Route to appropriate owner                           │
│                                                                    │
│  OUTPUTS BY SIGNAL TYPE                                           │
│  ├── P0 (act now): Slack DM to founder + suggested response post  │
│  ├── P1 (act this week): Competitive Intel Digest → #gtm-intel    │
│  ├── P2 (track): Weekly competitive brief (Notion doc auto-update) │
│  └── OPPORTUNITY: Hot lead card pushed to CRM with signal context  │
└────────────────────────────────────────────────────────────────────┘
```

#### Signal Classification Rules

| Signal | Type | Urgency | Auto-Action |
|---|---|---|---|
| Competitor announces pricing increase | MARKET | P0 | Draft "switch now" email sequence + LinkedIn post |
| G2 review: "Clay's enrichment is too slow" | OPPORTUNITY | P1 | Identify reviewer → enrich → push to CRM as hot lead |
| Competitor raises Series B | MARKET | P1 | Update competitive battlecard; prep investor FAQ |
| Reddit thread: "Is Apollo worth it?" | OPPORTUNITY | P1 | Draft thoughtful founder reply with Hog positioning |
| Competitor engineer posts about new intent feature | PRODUCT | P0 | Alert founder; schedule competitive teardown |
| "ZoomInfo renewal coming up" LinkedIn post | OPPORTUNITY | P0 | Identify poster → push to CRM as urgent outbound lead |

#### Agent Behavior Specification

| Property | Value |
|---|---|
| **Model** | Claude Sonnet (speed + cost balance for high-frequency sweeps) |
| **Memory** | Persistent — maintains competitor feature changelog and positioning history |
| **Human-in-loop** | P0 requires human approval before public-facing responses; P1/P2 auto-post to internal Slack |
| **Cadence** | 4-hour sweep for signal ingestion; instant push for P0 events |
| **Tool calls** | Hog Mind API, G2 scraper, Slack, HubSpot lead push, Notion doc write |

#### Sample Agent Prompt (System)

```
You are the Competitive Intelligence Agent for The Hog. You monitor 
the live internet for signals about our competitors (Clay, Apollo, 
ZoomInfo, 6sense, Warmly, Bombora, Common Room) and market shifts 
that affect our positioning.

Every 4 hours you will:
1. Ingest new signals from The Hog Mind API for competitor keywords
2. Classify each signal as PRODUCT, REPUTATION, MARKET, or OPPORTUNITY
3. Score urgency: P0 (act in <4 hours), P1 (act this week), P2 (track)
4. For OPPORTUNITY signals: identify the person/company and push a 
   lead card to HubSpot with full signal context
5. For PRODUCT/MARKET signals: update the competitive battlecard 
   in Notion and draft a positioning response for human review
6. Produce a structured digest for #gtm-intel on Slack

Never post publicly or send outbound messages without human approval.
Your job is intelligence + recommendations, not autonomous action.
```

#### Competitive Battlecard Maintenance

The agent auto-maintains a live battlecard for each competitor:

```
┌─────────────────────────────────────────┐
│  CLAY BATTLECARD (auto-updated)         │
│  Last updated: [timestamp]              │
│                                         │
│  Current pricing: $149–$800/mo          │
│  Recent G2 sentiment: 4.2/5 (↓ from 4.4)│
│  Latest product news: [auto-filled]     │
│  Top customer complaints: [auto-filled] │
│  Our win rate against: 68%              │
│  Best talk track: [linked]              │
│  Landmines to avoid: [auto-filled]      │
└─────────────────────────────────────────┘
```

#### Success Metrics

- Time from competitor event to GTM response: target <24 hours for P1, <4 hours for P0
- Competitor-sourced leads per week (OPPORTUNITY signals → CRM): target 15+/week
- Win rate vs tracked competitors: baseline + weekly delta tracking
- Battlecard freshness: all cards updated within 7 days

---

## 4. Positioning & Messaging

### Category Play

The Hog is not a "data enrichment tool" or a "sequencing tool." The Hog is creating a new category:

> **Predictive GTM Intelligence** — software that tells you who to sell to *before* they know they need you.

This is distinct from:
- Intent data (reactive, aggregated, lagging)
- Enrichment (static database lookup)
- Sequencing (assumes you already have the list)

### Messaging Framework

**For Founder/CEO (economic buyer):**
> "Stop guessing who your next customer is. The Hog monitors millions of live conversations to identify high-intent buyers before they raise their hand — so your team hits pipeline goals without adding headcount."

**For Head of Growth / VP Sales (champion):**
> "Your outbound is only as good as your lead list. The Hog replaces gut-feel prospecting with real-time signal intelligence — automatically ranked and ready to act on every morning."

**For RevOps / Growth Engineer (technical champion):**
> "One API. People profiles, company intel, social signals, live sentiment, news, and open web — unified, real-time, and structured for agent consumption. Build your entire outbound intelligence stack in a day."

### Proof Points

- Founded by operators who scaled a startup from $900K to $7M ARR in 3 months as a solo growth hire
- Saved a company facing 2 months of runway by finding and converting the right customers fast
- API-first: structured for AI agent consumption, not just human dashboards

---

## 5. GTM Motion & Channel Strategy

### Phase 1: Seed Traction (Month 0–6, target $250K ARR)

**Primary motion: Founder-led, community-driven**

| Channel | Tactic | Owner |
|---|---|---|
| LinkedIn | Daily founder posts: ICP teardowns, signal examples, "we found this lead from Reddit" stories | Hudson / Paulo |
| Reddit | Be the expert in r/sales, r/entrepreneur — answer questions, never pitch | Founders |
| YC Network | Direct warm intros to F25 portfolio companies in GTM pain | Founders |
| Cold outbound | The Hog eating its own dog food: use platform to identify your own first customers | Self-serve |
| Product Hunt | Launch with demo of finding a live lead in real-time | Founders |

**Conversion path:**
```
Social post → API demo / Loom walkthrough → 14-day free trial → Sales call → Convert
```

**Sales motion:** Founder-led demos only. No SDRs. Goal is 50 discovery calls to sharpen ICP.

### Phase 2: Early Scale (Month 6–18, target $2M ARR)

**Primary motion: Product-led growth + targeted outbound**

| Channel | Tactic | Owner |
|---|---|---|
| Self-serve trial | Free tier with 100 signals/month; upgrade friction at limit | Product |
| Outbound (PLG exhaust) | Identify trial users at ICP companies → targeted outreach | SDR #1 |
| Partner channel | Clay marketplace listing — "Hog feeds Clay workflows" | Growth |
| Content SEO | "How to find [competitor] customers on Reddit" → rank for competitor terms | Content |
| Webinars | "Live prospecting with AI" — show Hog finding leads in real-time | GTM |

**Conversion path:**
```
Self-serve trial → Product-qualified lead (PQL) → SDR touch → AE demo → Convert
```

**PQL definition:** Trial user who has run 3+ searches OR exported a lead within first 7 days.

### Phase 3: Series A Prep (Month 18–30, target $8M ARR)

**Primary motion: Outbound at scale + channel partnerships**

| Channel | Tactic |
|---|---|
| Outbound engine | Full SDR team running Hog-sourced sequences at scale |
| Agency channel | Reseller program for GTM agencies (white-label API) |
| Enterprise lite | Mid-market motion targeting $10K–$30K ACV accounts |
| Category creation | Publish "State of Predictive GTM Intelligence" annual report |

---

## 6. Funnel Architecture

```
AWARENESS
├── LinkedIn organic (founder + employee advocacy)
├── Reddit / Hacker News community presence
├── Word of mouth from YC network
└── SEO content (competitor-intent keywords)
        │
        ▼
ACQUISITION
├── API demo / interactive playground (no-gate)
├── 14-day free trial (email gate only)
└── Direct outbound (Hog-sourced leads via own platform)
        │
        ▼
ACTIVATION
├── "First valuable signal" within 10 minutes of signup
├── Onboarding agent walks user through first search
└── Daily digest email: "Here are 5 leads active right now"
        │
        ▼
CONVERSION
├── Self-serve: limit hit → upgrade prompt
├── Sales-assist: PQL trigger → SDR outreach within 24 hours
└── Annual commitment incentive: 2 months free
        │
        ▼
RETENTION & EXPANSION
├── Seat expansion as team grows
├── API usage expansion as agent workflows deepen
└── Quarterly business reviews for $5K+ ACV accounts
```

### North Star Metric

**Weekly Active Signals Acted On** — the number of Hog-sourced signals that result in an outbound action by the customer. This measures whether customers are actually getting pipeline value, not just logging in.

---

## 7. Metrics & OKRs

### Seed Phase OKRs (Month 0–6)

| Objective | Key Result | Target |
|---|---|---|
| Validate ICP | Closed-won paying customers | 25 |
| Validate value prop | Average time-to-first-value | <10 min |
| Build signal | NPS from paying customers | >55 |
| Pipeline velocity | Median sales cycle length | <14 days |
| Revenue | MRR at end of month 6 | $20K MRR |

### Series A Readiness OKRs (Month 6–18)

| Objective | Key Result | Target |
|---|---|---|
| Repeatable revenue | ARR | $2M |
| Efficient growth | CAC payback period | <9 months |
| Retention | Net Revenue Retention | >115% |
| Market signal | G2 rating | >4.5 with 50+ reviews |
| Team | First 5 hires (2 eng, 1 AE, 1 SDR, 1 CS) | Hired |

---

## 8. 90-Day Execution Calendar

### Month 1: Signal & Foundation

| Week | Priority | Owner |
|---|---|---|
| Week 1 | Deploy ICP Discovery Agent on first 10 closed-won accounts | Founder |
| Week 1 | Set up Competitive Intelligence Agent monitoring all 7 competitors | Founder |
| Week 2 | Ship self-serve trial (email gate → free tier) | Engineering |
| Week 2 | Publish 3 LinkedIn posts showing live signal-to-lead examples | Hudson |
| Week 3 | Run 20 ICP discovery calls — let ICP agent refine after each | Founders |
| Week 4 | Launch on Product Hunt with live demo component | Both founders |

### Month 2: Convert & Learn

| Week | Priority | Owner |
|---|---|---|
| Week 5 | Activate first 5 paying customers on full platform | Founders |
| Week 6 | First competitive win: get a customer from Clay/Apollo territory | Founders |
| Week 7 | Publish competitive teardown: "Why real-time beats enrichment" | Content |
| Week 8 | First agency pilot (test secondary ICP) | Founders |

### Month 3: Systematize

| Week | Priority | Owner |
|---|---|---|
| Week 9 | SDR hire #1 (train on Hog-sourced sequences) | Founders |
| Week 10 | Automate PQL → SDR handoff workflow | RevOps |
| Week 11 | Ship Clay marketplace integration (Hog → Clay workflows) | Engineering |
| Week 12 | Quarterly ICP review with ICP agent synthesis report | All GTM |

---

## Appendix: Agent System Summary

| Agent | Type | Model | Cadence | Human Gate |
|---|---|---|---|---|
| **ICP Discovery Agent** | Continuous Refinement Agent | Claude Opus | Daily ingest / weekly report | Yes — ICP changes require founder approval |
| **Competitive Intelligence Agent** | Persistent Monitoring Agent | Claude Sonnet | 4-hour sweeps / instant P0 alerts | Yes — public responses require approval |

Both agents are powered by The Hog's own platform (The Hog Mind API), making them a living demonstration of the product's value — every time the agents surface an insight, it's proof the product works.

---

*Sources: [The Hog on YC](https://www.ycombinator.com/companies/the-hog) · [TheHog.ai](https://thehog.ai/) · [The Hog launches (Fondo)](https://fondo.com/blog/the-hog-launches) · [Tracxn profile](https://tracxn.com/d/companies/thehog/__F2lwDqw7ej7Gy_l8uliBCJisE4rEezDYGXsSLbmeAYg)*
