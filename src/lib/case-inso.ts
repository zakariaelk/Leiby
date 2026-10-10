// INSO case study, top section content in two versions for comparison (10 Oct 2026):
//   v3   docs/inso-app-case-study-content.md (v3) throughout   → /next/case-v3/
//   mix  the page's current text, v3 only where the new layout
//        needs something the page doesn't have                  → /next/case-mix/
// Both drop the three numbers v3 flags as unsourced (~30% understood, 100% task success, ~13s).
import type { CollectionEntry } from 'astro:content';

export type CaseContent = 'v3' | 'mix';

const NUMBERS = [
  { value: '79%', label: 'rated ease of use 4 or 5 out of 5', note: '23 of 29 partners' },
  { value: '24 of 31', label: 'rated installation and onboarding 4 or 5 out of 5', note: 'average 4.1/5' },
  { value: '93%', label: 'named alert notifications the most important feature', note: '28 of 30 partners' },
];

const CONSTRAINTS = [
  'No access to partners before launch, so I researched through country-office colleagues acting as proxies.',
  'Only designer, working with two engineers and no project manager or product owner, so I also kept the planner and followed up with the developers.',
  'Field conditions: low connectivity, high stress, no room for confusion.',
  'Remote testing of an unfamiliar prototype: some participants expected a native app and tapped everywhere. I briefed them in the intro and by email, used scenario tasks, and read heatmaps with that in mind.',
];

const ROLE = [
  { label: 'Research and strategy', text: 'heuristic evaluation, sharing findings with the team, an action plan and work planner for existing and new features.' },
  { label: 'Design', text: 'sketching, UI design and prototyping.' },
  { label: 'Testing', text: 'usability campaigns on Maze and in moderated sessions, including sourcing and organising participants.' },
  { label: 'Delivery', text: 'implementation review with feedback to engineering, and defining the Firebase analytics events and metrics.' },
  { label: 'Launch', text: 'the landing page (app.ngosafety.org) and app store visuals.' },
];

export function caseTop(content: CaseContent, d: CollectionEntry<'projects'>['data']) {
  if (content === 'v3') {
    return {
      title: 'Mitigating risk with location-based alerts',
      subtitle: 'The INSO mobile app is a location-based incident alerts tool for NGOs, in real time.',
      meta: [
        { label: 'Role', value: 'Sole product designer' },
        { label: 'Team', value: 'Two engineers, with a department lead who occasionally mediated with stakeholders on strategic decisions' },
        { label: 'Timeline', value: 'Dec 2022 to June 2023 for the first release, with a further iteration in early 2025' },
      ],
      glance: [
        { label: 'Problem', text: "INSO's incident-alerts app had been built engineering-first and felt technical to the humanitarian workers who rely on it." },
        { label: 'What I did', text: 'As the sole designer, I ran a heuristic evaluation and redesigned onboarding, alerts, alert detail and three map modes, testing with INSO colleagues on Maze and in moderated sessions.' },
        { label: 'Outcome', text: 'In a post-launch survey of 31 partners, ease of use averaged 4.1/5 and alert notifications were the most valued feature (93%). Geofence, a specialist tool, was not formally retested.' },
      ],
      numbers: NUMBERS, constraints: CONSTRAINTS, role: ROLE,
    };
  }
  return {
    title: d.headline,
    subtitle: d.summary,
    meta: [
      { label: 'Role', value: d.role },
      { label: 'Team', value: d.team },
      { label: 'Timeline', value: d.duration },
    ].filter((m) => m.value) as { label: string; value: string }[],
    glance: [
      { label: 'Problem', text: d.problem },
      { label: 'What I did', text: d.did },
      { label: 'Outcome', text: d.result },
    ].filter((g) => g.text) as { label: string; text: string }[],
    numbers: NUMBERS, constraints: CONSTRAINTS, role: ROLE,
  };
}
