import { Component, AfterViewInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

type TimelineItem = { year: string; title: string; subtitle: string; description: string };
type TimelineRow = { left: TimelineItem | null; right: TimelineItem | null };
type SkillGroup = { category: string; colorClass: string; skills: { name: string; level: number }[] };
type CaseStudy = { eyebrow: string; title: string; summary: string; outcome: string; stack: string[] };
type ImpactStat = { value: string; label: string };

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements AfterViewInit {
  protected readonly showScrollTop = signal(false);
  protected readonly formStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
  protected readonly formError = signal('');
  private cooldownTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  protected async submitForm(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (this.formStatus() === 'submitting' || this.formStatus() === 'success') return;

    const form = event.target as HTMLFormElement;
    this.formStatus.set('submitting');

    try {
      const res = await fetch('https://formspree.io/f/mwvazdky', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        this.formStatus.set('success');
        form.reset();
        // reset back to idle after 6s cooldown
        this.cooldownTimer = setTimeout(() => this.formStatus.set('idle'), 6000);
      } else {
        const data = await res.json();
        this.formError.set(data?.errors?.[0]?.message ?? 'Something went wrong. Try again.');
        this.formStatus.set('error');
        setTimeout(() => this.formStatus.set('idle'), 4000);
      }
    } catch {
      this.formError.set('Network error. Please try again.');
      this.formStatus.set('error');
      setTimeout(() => this.formStatus.set('idle'), 4000);
    }
  }

  protected readonly impactStats: ImpactStat[] = [
    { value: '2.5M+', label: 'Users Served' },
    { value: '200K+', label: 'Daily Code Submissions' },
    { value: '6M+', label: 'Monthly Executions' },
    { value: '₹40L+', label: 'Annual Cost Savings' },
    { value: '99.8%', label: 'Payment Success Rate' },
    { value: '40%', label: 'Latency Reduction' },
  ];

  protected readonly timelineRows: TimelineRow[] = [
    {
      left: {
        year: '2016 – 2020',
        title: 'BTech, Information Technology',
        subtitle: 'GGSIPU · Delhi · 8.36 CGPA',
        description: 'Built strong foundation in algorithms, data structures, operating systems, distributed computing, networks, and databases.',
      },
      right: {
        year: 'Jun 2018 – Sep 2018',
        title: 'Data Structures with Java — Teaching Assistant',
        subtitle: 'Coding Ninjas · Delhi',
        description: 'First foray into teaching — resolved doubts and mentored 200+ students through core CS fundamentals and Java programming.',
      },
    },
    {
      left: {
        year: 'Feb 2017',
        title: 'Award of Excellence',
        subtitle: 'Chief Minister of Delhi',
        description: 'Recognized for outstanding academic and technical achievement at the state level.',
      },
      right: {
        year: 'Mar 2019 – Jul 2019',
        title: 'Node.js Content Intern & Teaching Assistant',
        subtitle: 'Coding Ninjas · New Delhi',
        description: 'Designed full course curriculum for Full Stack Web Development with Node.js — problem sets, projects, and content structure. Simultaneously TAed students, resolving technical doubts and guiding capstone projects.',
      },
    },
    {
      left: {
        year: '2019',
        title: 'Ruby on Rails Certification',
        subtitle: 'Coding Ninjas',
        description: 'Completed advanced full-stack development with Ruby on Rails, covering MVC architecture, ActiveRecord, and REST APIs.',
      },
      right: {
        year: 'Jun 2019 – May 2020',
        title: 'Software Engineer Intern',
        subtitle: 'Coding Ninjas · Delhi',
        description: 'Built TA management dashboard (200+ TAs, 30% overhead reduction), ATS-optimized resume builder (15K+ students, 60% adoption), referral tracking system (5K+ referrals, 12% user acquisition), and conducted Locust perf tests simulating 10K concurrent users — identified 8 critical bottlenecks contributing to 35% capacity improvement.',
      },
    },
    {
      left: {
        year: 'Dec 2021',
        title: 'Java Advanced Certification',
        subtitle: 'Cutshort · Credential #59613',
        description: 'Validated advanced expertise in Java enterprise development patterns, concurrency, and distributed system design.',
      },
      right: {
        year: 'Jun 2020 – Mar 2021',
        title: 'Software Engineer',
        subtitle: 'Coding Ninjas · New Delhi',
        description: 'Re-architected e-commerce order system to multi-product bundle architecture (₹5 Cr+ additional annual revenue, 15% AOV increase). Optimized payment pipeline to 99.8% success rate (35% failure reduction). Implemented Angular Universal SSR on AWS Lambda cutting load time 55% (4.2s → 1.9s) and driving 18% lift in organic conversions.',
      },
    },
    {
      left: {
        year: '2021 – 2023',
        title: 'SDE-2 Impact',
        subtitle: 'Key metrics from this period',
        description: '6M+ monthly executions · 150K+ new monthly users · 100K+ competition participants · 45% system perf boost · 15 critical vulnerabilities eliminated.',
      },
      right: {
        year: 'Apr 2021 – Jun 2023',
        title: 'SDE-2',
        subtitle: 'Coding Ninjas · Gurugram · Hybrid',
        description: 'Led zero-downtime Rails 4.2→6.0 upgrade (Ruby 2.3→2.7, Ubuntu 20.04) — 15 CVEs eliminated, 45% performance gain for 50K+ DAU. Expanded compiler to 6 new languages (R, Kotlin, Swift, PHP, Scala, Pascal) taking platform coverage to 6M+ monthly executions. Built ELO-based competition rating for 100K+ participants (38% engagement increase). Architected SSR/SPA compiler platform driving 23% organic traffic increase and 150K+ new monthly users.',
      },
    },
    {
      left: {
        year: '2023 – Present',
        title: 'SDE-3 Impact',
        subtitle: 'Key metrics from this period',
        description: '2.5M+ users · 200K+ daily submissions · ₹40L+ saved annually · 1M+ monthly visitors migrated · 6-agent LLM pipeline · 35% better assessment scores.',
      },
      right: {
        year: 'Jul 2023 – Present',
        title: 'SDE-3',
        subtitle: 'Coding Ninjas · Gurugram · Hybrid',
        description: 'Architected a 6-agent LLM orchestration pipeline (content selection, mastery assessment, doubt resolution, chat analysis) with knowledge graph-based question selection — 35% improvement in assessment scores. Shipped AI teaching assistant and voice-to-code for 50K+ users (90% cost reduction, ₹40L+ saved/year, 10x mobile engagement). Contributed to an agentic on-call RCA system (LLM over Metabase/Sentry/ClickUp/codebase) resolving 70% of incidents in 5 min vs 30-60 min manually. Drove zero-downtime migration to Naukri.com (98% organic traffic, 1M+ visitors). Optimized compiler execution (40% latency reduction, 3x throughput, 200K+ daily submissions).',
      },
    },
  ];

  protected readonly skillGroups: SkillGroup[] = [
    {
      category: 'BACKEND',
      colorClass: 'blue',
      skills: [
        { name: 'Java / Spring Boot', level: 8 },
        { name: 'Ruby on Rails', level: 9 },
        { name: 'Node.js', level: 7 },
        { name: 'Python', level: 6 },
        { name: 'REST APIs', level: 9 },
      ],
    },
    {
      category: 'SYSTEMS',
      colorClass: 'teal',
      skills: [
        { name: 'Distributed Systems', level: 9 },
        { name: 'System Design', level: 9 },
        { name: 'Queue Management', level: 9 },
        { name: 'Microservices', level: 8 },
        { name: 'CI/CD', level: 7 },
      ],
    },
    {
      category: 'AI & AGENTIC',
      colorClass: 'yellow',
      skills: [
        { name: 'LLM Orchestration', level: 8 },
        { name: 'Multi-agent Systems', level: 7 },
        { name: 'Vector Databases', level: 7 },
        { name: 'Knowledge Graphs', level: 6 },
        { name: 'Prompt Engineering', level: 7 },
      ],
    },
    {
      category: 'CLOUD & TOOLS',
      colorClass: 'red',
      skills: [
        { name: 'AWS (EC2, RDS, Lambda, SQS)', level: 9 },
        { name: 'PostgreSQL / Redis / MongoDB', level: 7 },
        { name: 'Sidekiq / Resque', level: 7 },
        { name: 'Docker', level: 6 },
        { name: 'Sentry / Metabase', level: 6 },
      ],
    },
  ];

  protected readonly caseStudies: CaseStudy[] = [
    {
      eyebrow: 'Compiler Platform',
      title: 'Distributed compiler execution at 200K+ daily scale',
      summary: 'Redesigned resource allocation and queue management across compiler worker nodes. Expanded language support from 14 to 20+ languages (R, Kotlin, Swift, PHP, Scala, Pascal). Architected conditional SSR/SPA rendering for the platform.',
      outcome: '40% latency reduction, 3x throughput, 6M+ monthly executions, 150K+ new monthly users, 23% organic traffic increase.',
      stack: ['Rails', 'Worker Queues', 'Sandbox Runtimes', 'AWS Lambda', 'Angular Universal'],
    },
    {
      eyebrow: 'AI Systems',
      title: 'Multi-agent AI tutor for 50K+ active students',
      summary: 'Architected a 6-agent LLM orchestration pipeline (content selection, mastery assessment, doubt resolution, chat analysis) with knowledge graph-based question selection and per-cluster mastery scoring. Separately shipped an AI teaching assistant and voice-to-code pipeline.',
      outcome: '90% support cost reduction (₹40L+ saved annually), 10x mobile engagement, 35% improvement in student assessment scores.',
      stack: ['LLMs', 'Multi-agent', 'Vector DB', 'Knowledge Graph', 'Voice Systems', 'Spring Boot'],
    },
    {
      eyebrow: 'Domain Migration',
      title: 'Zero-downtime migration to Naukri.com',
      summary: 'Designed routing architecture and SEO-preservation strategy for migrating Coding Ninjas Studio to a new domain under Naukri. Coordinated canonical URLs, 301 redirect chains, reverse proxy rules, and sitemap handover — all live with zero outage.',
      outcome: 'Maintained 98% organic traffic throughout the migration for 1M+ monthly visitors.',
      stack: ['Reverse Proxy', 'Routing', 'SEO', 'Canonical URLs', 'Rails'],
    },
    {
      eyebrow: 'Backend Modernization',
      title: 'Zero-downtime Rails & infra upgrade',
      summary: 'Led a full zero-downtime upgrade stack: Rails 4.2→6.0, Ruby 2.3→2.7, Ubuntu 18→20.04 on a 50K+ DAU production platform. Managed dependency chains, deprecated API replacements, and phased rollout strategy.',
      outcome: 'Eliminated 15 critical vulnerabilities, improved system performance by 45% with zero downtime.',
      stack: ['Ruby on Rails', 'PostgreSQL', 'Redis', 'Sidekiq', 'DevOps'],
    },
    {
      eyebrow: 'Agentic AI',
      title: 'On-call RCA system with LLM orchestration',
      summary: 'Contributed to building an agentic on-call Root Cause Analysis system that orchestrates LLM reasoning over live production data — Metabase dashboards, Sentry errors, ClickUp tickets, and the codebase — to automate incident triage end-to-end.',
      outcome: 'Resolved 70% of incidents end-to-end within 5 minutes vs. 30–60 min manually, eliminating most on-call escalations.',
      stack: ['LLMs', 'Agentic AI', 'Metabase', 'Sentry', 'ClickUp', 'Spring Boot'],
    },
    {
      eyebrow: 'AI Integrity',
      title: 'Automated plagiarism detection at scale',
      summary: 'Designed a plagiarism detection microservice using Spring Boot and JPlag to automatically analyse all code submissions across assessments. Built async processing pipelines to handle burst traffic without impacting the main platform.',
      outcome: '90% detection accuracy on 100K+ daily submissions, eliminating 200+ manual review hours monthly.',
      stack: ['Spring Boot', 'JPlag', 'Microservices', 'Java', 'Async Processing'],
    },
    {
      eyebrow: 'AI Proctoring',
      title: 'Real-time AI proctoring for online exams',
      summary: 'Built an AI-powered proctoring system with real-time anomaly detection to enforce academic integrity across online examinations. Integrated computer vision signals with behavioural heuristics to minimise false positives while maximising detection.',
      outcome: '95% cheating detection accuracy across 50K+ assessments, significantly reducing manual invigilation overhead.',
      stack: ['Computer Vision', 'Spring Boot', 'Real-time ML', 'AWS', 'WebSockets'],
    },
  ];

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.initParticles();
    this.initSkillBars();
    this.initFadeIns();
    this.initScrollTop();
  }

  private async initParticles(): Promise<void> {
    await loadSlim(tsParticles);

    await tsParticles.load({
      id: 'tsparticles',
      options: {
        detectRetina: true,
        pauseOnOutsideViewport: true,
        fullScreen: { enable: false },
        particles: {
          number: { value: 75 },
          shape: { type: 'triangle' },
          size: { value: { min: 6, max: 28 } },
          collisions: { enable: true, mode: 'bounce' },
          rotate: {
            value: { min: 0, max: 360 },
            direction: 'random',
            animation: { enable: true, speed: 10, sync: false },
          },
          move: { enable: true, speed: 1.5 },
          stroke: { width: 4, color: '#10b981' },
          color: { value: '#111827' },
        },
        responsive: [
          {
            maxWidth: 768,
            options: {
              particles: {
                number: { value: 40 },
                size: { value: { min: 4, max: 14 } },
              },
            },
          },
        ],
      },
    });
  }

  private initSkillBars(): void {
    const bars = document.querySelectorAll<HTMLProgressElement>('.skill-bar');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target as HTMLProgressElement;
            requestAnimationFrame(() => {
              bar.value = Number(bar.dataset['level']);
            });
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.1 }
    );
    bars.forEach((bar) => {
      bar.value = 0;
      observer.observe(bar);
    });
  }

  private initFadeIns(): void {
    const targets = document.querySelectorAll('.fade-target');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach((el) => observer.observe(el));
  }

  private initScrollTop(): void {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => this.showScrollTop.set(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(hero);
  }
}
