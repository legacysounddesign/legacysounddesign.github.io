import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  AudioLines,
  ArrowRight,
  Blocks,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Ear,
  ExternalLink,
  Home as HomeIcon,
  Menu,
  Megaphone,
  PackageCheck,
  PenTool,
  RadioTower,
  RefreshCw,
  Route as RouteIcon,
  Send,
  Sparkles,
  Users,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { LegacyIdentity } from "./LegacyIdentity";
import { motionEase, motionTimings, navSpring, pageTransition, revealTransition, writeTimings } from "./motion";

const pageLoadSeed = Math.random().toString(36).slice(2);
const revealViewport = { once: true, margin: "0px 0px 90px 0px" } as const;

const navItems: Array<{ label: string; path: string; Icon: LucideIcon }> = [
  { label: "Home", path: "/", Icon: HomeIcon },
  { label: "Work", path: "/work", Icon: BriefcaseBusiness },
  { label: "Services", path: "/services", Icon: Sparkles },
  { label: "Studio", path: "/studio", Icon: RadioTower },
  { label: "Team", path: "/team", Icon: Users },
];

const services = [
  {
    title: "Film and video",
    label: "Scenes / shorts / campaigns",
    body: "Focused sound design for scenes, shorts, trailers, campaigns, and moving-image work. We shape sonic detail around story, rhythm, and emotional point of view.",
    Icon: Clapperboard,
  },
  {
    title: "Brands",
    label: "Launches / activations / motion",
    body: "Sound for brand moments that need to feel distinctive without becoming decorative: launches, activations, motion pieces, installations, and digital experiences.",
    Icon: Megaphone,
  },
  {
    title: "Production",
    label: "Creative and technical support",
    body: "Creative and technical sound support for productions that need clear communication, careful delivery, and a team that can stay close to the work.",
    Icon: Wrench,
  },
  {
    title: "Themed experience",
    label: "Spaces / rooms / journeys",
    body: "Immersive sound for spaces, rooms, installations, and audience journeys where timing, atmosphere, and environmental detail matter.",
    Icon: RouteIcon,
  },
  {
    title: "Focused sound design",
    label: "Textures / transitions / cues",
    body: "We build sound with intention: the textures, transitions, cues, and details that make a world feel coherent.",
    Icon: AudioLines,
  },
  {
    title: "Audio systems and experience design",
    label: "Interactive / spatial systems",
    body: "For interactive or spatial projects, we can think beyond a fixed track and help shape the sound system itself: how it responds, where it lives, and how it supports the audience experience.",
    Icon: Blocks,
  },
];

const process = [
  {
    step: "Step 1",
    title: "Listen",
    body: "We start with the world of the project: story, space, audience, references, constraints, and what the sound needs to make possible.",
    Icon: Ear,
  },
  {
    step: "Step 2",
    title: "Shape",
    body: "We build a focused sonic direction, then test it against the emotion, pacing, and practical needs of the work.",
    Icon: PenTool,
  },
  {
    step: "Step 3",
    title: "Refine",
    body: "We stay close through feedback, revisions, and technical realities, keeping the work clear without sanding off its character.",
    Icon: RefreshCw,
  },
  {
    step: "Step 4",
    title: "Deliver",
    body: "We prepare final materials with the right format, context, and handoff for the production, platform, or space.",
    Icon: PackageCheck,
  },
];

const team = [
  {
    name: "Sebastian Suarez-Solis",
    url: "https://cbassuarez.com",
    displayUrl: "cbassuarez.com",
    image: "/team/seb-suarez.jpg",
    imageAlt: "Portrait of Sebastian Suarez-Solis.",
    signal: "Cybernetic music systems / live performance / sonic and visual art",
    sourceNote: "Public profile source: cbassuarez.com",
    body: [
      "Sebastian Suarez-Solis is a Caracas-born Venezuelan-American sonic and visual artist whose work moves across composition, installation, performance, visual systems, and live cybernetic tools.",
      "At Legacy, Seb helps shape how sound, image, interaction, and system behavior feel as one experience: listening, relaying, adapting, and staying legible to the audience.",
      "Recent public projects and live surfaces include let go / letting go, THE TUB, String, and Praetorius, with a practice grounded in experimental performance, open-source tools, and realtime sonic behavior.",
    ],
  },
  {
    name: "Paul Yorke",
    url: "https://pkyorke.com",
    displayUrl: "pkyorke.com",
    image: "/team/paul-yorke.jpg",
    imageAlt: "Portrait of Paul Yorke.",
    signal: "Theater / percussion / spatial sound / immersive storytelling",
    sourceNote: "Public profile source: pkyorke.com",
    body: [
      "Paul Yorke is a Los Angeles-based sound designer, composer, and percussionist working across theater, multimedia performance, installation, and spatial listening.",
      "His practice treats sound as both craft and storytelling: acoustic instrumentation, field recordings, synthesis, and live electronics become narrative pressure, atmosphere, and architecture.",
      "For Legacy, Paul brings the studio's sound-design center of gravity: close listening, percussion-led rhythm, theatrical timing, and a practical sense of how sound supports the emotional life of a room.",
    ],
  },
  {
    name: "Matthew Cue",
    url: "https://matthewcue.dev",
    displayUrl: "matthewcue.dev",
    image: "/team/matthew-cue.jpg",
    imageAlt: "Portrait of Matthew Cue.",
    signal: "Systems support / documentation / automation / data foundations",
    sourceNote: "Public profile source: matthewcue.dev",
    body: [
      "Matthew Cue brings a calm systems practice to the studio's web and operational layer: troubleshooting, documentation, database basics, small automations, and the maintenance habits that keep tools usable.",
      "His public work focuses on IT support, systems fundamentals, networking, scripting, SQL, cloud basics, and homelab practice: the unglamorous infrastructure that makes creative work easier to ship.",
      "At Legacy, Matthew helps keep the site and supporting systems understandable, maintainable, and ready to grow when the studio needs more technical surface area.",
    ],
  },
];

function App() {
  return (
    <div className="site-shell">
      <LegacyCursor />
      <Header />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

function LegacyCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncEnabled() {
      setEnabled(hoverQuery.matches && !motionQuery.matches);
    }

    syncEnabled();
    hoverQuery.addEventListener("change", syncEnabled);
    motionQuery.addEventListener("change", syncEnabled);

    return () => {
      hoverQuery.removeEventListener("change", syncEnabled);
      motionQuery.removeEventListener("change", syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    let frame = 0;
    let x = 0;
    let y = 0;

    function moveCursor() {
      frame = 0;
      cursorRef.current?.style.setProperty("--cursor-x", `${x}px`);
      cursorRef.current?.style.setProperty("--cursor-y", `${y}px`);
    }

    function handlePointerMove(event: PointerEvent) {
      x = event.clientX;
      y = event.clientY;
      setVisible(true);
      if (!frame) {
        frame = window.requestAnimationFrame(moveCursor);
      }
    }

    function handlePointerOver(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      setInteractive(Boolean(target?.closest("a, button, input, select, textarea, [role='tab']")));
    }

    function handlePointerLeave() {
      setVisible(false);
      setInteractive(false);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`legacy-cursor ${visible ? "is-visible" : ""} ${interactive ? "is-interactive" : ""}`}
      aria-hidden="true"
    >
      <span className="legacy-cursor-ring" />
      <span className="legacy-cursor-dot" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services" element={<Services />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <Link to="/" className="brand-link" aria-label="Legacy Sound Design home">
        <LegacyIdentity surface="avatar" className="brand-mark" seed={`${pageLoadSeed}:header`} showBackground={false} />
        <span className="brand-copy">
          <span className="brand-name">Legacy</span>
          <span className="brand-descriptor">Sound design</span>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className="nav-link">
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.span
                    className="nav-active-capsule"
                    layoutId="nav-active-pill"
                    transition={navSpring}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="nav-link-content">
                  <item.Icon size={17} aria-hidden="true" />
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="header-cta">
        <ButtonLink to="/contact" variant="primary">
          Get updates
        </ButtonLink>
      </div>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: motionTimings.standard, ease: motionEase }}
          >
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className="mobile-nav-link">
                <item.Icon size={17} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/contact" className="mobile-nav-link mobile-contact">
              <Send size={17} aria-hidden="true" />
              Get updates
            </NavLink>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

type WriteTag = "p" | "h1" | "h2" | "h3";

function WriteLines({
  as: Tag = "p",
  id,
  className,
  lines,
  delay = 0,
  stagger = writeTimings.stagger,
  duration = writeTimings.line,
}: {
  as?: WriteTag;
  id?: string;
  className?: string;
  lines: string[];
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, revealViewport);
  const shouldShow = reducedMotion || isInView;
  const label = lines.join(" ");
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  return (
    <Tag ref={setRef} id={id} className={className ? `write-lines ${className}` : "write-lines"} aria-label={label}>
      {lines.map((line, index) => {
        const lineDelay = delay + index * stagger;

        return (
          <span className="write-line" aria-hidden="true" key={`${line}-${index}`}>
            <motion.span
              className="write-line-text"
              initial={reducedMotion ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0.24 }}
              animate={shouldShow ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : { clipPath: "inset(0 100% 0 0)", opacity: 0.24 }}
              transition={{ duration: reducedMotion ? 0 : duration, ease: motionEase, delay: reducedMotion ? 0 : lineDelay }}
            >
              {line}
            </motion.span>
            <motion.span
              className="write-edge"
              initial={reducedMotion ? false : { left: "0%", opacity: 0 }}
              animate={shouldShow && !reducedMotion ? { left: "100%", opacity: [0, 0.34, 0] } : { left: "0%", opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : duration, ease: motionEase, delay: reducedMotion ? 0 : lineDelay }}
            />
          </span>
        );
      })}
    </Tag>
  );
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, revealViewport);
  const shouldShow = reducedMotion || isInView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={shouldShow ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : motionTimings.standard, ease: motionEase, delay: reducedMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

function DrawIcon({
  Icon,
  delay = 0,
  className,
}: {
  Icon: LucideIcon;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, revealViewport);
  const shouldShow = reducedMotion || isInView;
  const style = { "--draw-delay": `${reducedMotion ? 0 : delay}s` } as CSSProperties;

  return (
    <span
      ref={ref}
      className={className ? `draw-icon ${className} ${shouldShow ? "is-visible" : ""}` : `draw-icon ${shouldShow ? "is-visible" : ""}`}
      style={style}
      aria-hidden="true"
    >
      <Icon size={26} strokeWidth={1.8} />
    </span>
  );
}

function Home() {
  return (
    <Page>
      <section className="hero-section" aria-labelledby="home-title">
        <div className="hero-copy-block">
          <WriteLines as="p" className="eyebrow" lines={["Now opening"]} delay={0.04} />
          <WriteLines
            as="h1"
            id="home-title"
            lines={["Legacy Sound Design", "is now opening."]}
            delay={0.14}
          />
          <WriteLines
            as="p"
            lines={[
              "We are a small sound design atelier",
              "for stories, spaces, brands, and live experiences.",
              "More is coming soon: studio notes, process pieces,",
              "and a careful work archive.",
              "Our team brings real practice across composition,",
              "performance, systems, and production.",
            ]}
            delay={0.44}
          />
          <FadeIn className="hero-actions" delay={0.82}>
            <ButtonLink to="/contact" variant="primary" superButton>
              Join the updates list
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Reach out
            </ButtonLink>
          </FadeIn>
        </div>
      </section>

      <section className="statement-band">
        <WriteLines
          lines={[
            "We are opening as a small, hands-on studio for careful sonic work.",
            "Join the updates list for launch notes and process pieces,",
            "or reach out now if there is a project we should hear about.",
          ]}
        />
      </section>

      <SectionIntro
        eyebrow="What is opening"
        title="Focused sound worlds, built around attention."
        body="Legacy is opening for projects that need sound to carry story, space, identity, or atmosphere with intention."
      />
      <ServiceList items={services.slice(0, 4)} />

      <SectionIntro
        eyebrow="How we work"
        title="Listen closely. Shape the world. Refine the details."
        body="The studio is intentionally small: direct conversations, close collaboration, and makers staying connected to the details."
      />
      <ProcessGrid />

      <section className="split-section">
        <div>
          <WriteLines as="p" className="eyebrow" lines={["The team"]} />
          <WriteLines as="h2" lines={["Qualified hands,", "close collaboration."]} delay={0.1} />
        </div>
        <div>
          <WriteLines
            lines={[
              "Legacy is being built by three makers with overlapping practices",
              "in composition, sound, systems, performance, and production.",
            ]}
            delay={0.22}
          />
          <FadeIn delay={0.42}>
            <ButtonLink to="/team" variant="secondary">
              Meet the team
            </ButtonLink>
          </FadeIn>
        </div>
      </section>

      <section className="archive-note">
        <div>
          <WriteLines as="p" className="eyebrow" lines={["Selected work"]} />
          <WriteLines as="h2" lines={["Project archive coming soon."]} delay={0.1} />
          <WriteLines
            lines={[
              "We are building the archive carefully so each project can be shown with the right context:",
              "what the work needed, how the sound was shaped, and what the final experience asked of the audience.",
            ]}
            delay={0.24}
          />
        </div>
        <FadeIn className="archive-action" delay={0.42}>
          <ButtonLink to="/contact" variant="primary" superButton>
            Join the updates list
          </ButtonLink>
        </FadeIn>
      </section>
    </Page>
  );
}

function Work() {
  return (
    <Page>
      <PageHero
        eyebrow="Selected work"
        titleLines={["The work archive", "opens soon."]}
        bodyLines={[
          "We are preparing the archive with care so each project can be shown with the right context.",
          "Until then, join the updates list or reach out if there is something you are making now.",
        ]}
      />
      <ServiceList items={services.slice(0, 4)} />
      <section className="split-section">
        <div>
          <WriteLines as="p" className="eyebrow" lines={["Process note"]} />
          <WriteLines as="h2" lines={["Opening carefully,", "without overclaiming."]} delay={0.1} />
        </div>
        <WriteLines
          lines={[
            "This site introduces the studio, the team,",
            "and the kinds of sound work we are opening conversations around now.",
          ]}
          delay={0.22}
        />
      </section>
      <ContactCta />
    </Page>
  );
}

function Services() {
  return (
    <Page>
      <PageHero
        eyebrow="Services"
        titleLines={["Sound shaped for scenes,", "systems, rooms,", "and audiences."]}
        bodyLines={[
          "We are opening for projects where every cue has a job:",
          "pull the audience closer, clarify the moment, and make the world feel more complete.",
        ]}
      />
      <ServiceList items={services} />
      <ContactCta />
    </Page>
  );
}

function Studio() {
  return (
    <Page>
      <PageHero
        eyebrow="Studio"
        titleLines={["A boutique atelier", "opening now."]}
        bodyLines={[
          "Legacy Sound Design is opening as a small studio for immersive sound across film, video, brand work, production, and themed environments.",
          "The archive will grow; the way of working is already clear.",
        ]}
      />
      <section className="studio-body">
        <WriteLines
          lines={[
            "Our studio combines artistic sound design, performance practice, systems thinking, and technical production.",
            "That mix lets us approach sound as both craft and experience: what the audience hears,",
            "how it moves through a scene or space, and how it supports the emotional architecture of the project.",
          ]}
        />
        <WriteLines
          lines={[
            "We are intentionally small from the start.",
            "Early collaborators work directly with the team shaping the sound, from first conversation through final delivery.",
          ]}
          delay={0.18}
        />
      </section>
      <ProcessGrid />
      <ContactCta />
    </Page>
  );
}

function Team() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activePerson = team[activeIndex] ?? team[0];

  function showPreviousPerson() {
    setActiveIndex((current) => (current - 1 + team.length) % team.length);
  }

  function showNextPerson() {
    setActiveIndex((current) => (current + 1) % team.length);
  }

  return (
    <Page>
      <PageHero
        eyebrow="Team"
        titleLines={["The people", "shaping the signal."]}
        bodyLines={[
          "Legacy is a three-person atelier: small enough for direct collaboration,",
          "broad enough to bring together sound, performance, systems, and technical production.",
        ]}
      />
      <section className="team-carousel" aria-label="Legacy team profiles">
        <div className="team-selector" role="tablist" aria-label="Team members">
          {team.map((person, index) => (
            <button
              className={`team-selector-button ${index === activeIndex ? "is-active" : ""}`}
              key={person.name}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="active-team-profile"
              onClick={() => setActiveIndex(index)}
            >
              <span className="team-selector-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="team-selector-photo" aria-hidden="true">
                <img src={person.image} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="team-selector-copy">
                <span>{person.name}</span>
                <span>{person.signal}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="team-profile-stage">
          <div className="team-profile-controls" aria-label="Change featured team member">
            <button type="button" onClick={showPreviousPerson} aria-label="Show previous team member">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(team.length).padStart(2, "0")}</span>
            <button type="button" onClick={showNextPerson} aria-label="Show next team member">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              id="active-team-profile"
              role="tabpanel"
              className="team-profile"
              key={activePerson.name}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : motionTimings.page, ease: motionEase }}
            >
              <motion.figure
                className="team-profile-photo"
                initial={reducedMotion ? false : { opacity: 0, clipPath: "inset(0 18% 0 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: reducedMotion ? 0 : motionTimings.settle, ease: motionEase }}
              >
                <img src={activePerson.image} alt={activePerson.imageAlt} loading="eager" decoding="async" />
              </motion.figure>

              <div className="team-profile-copy">
                <WriteLines as="p" className="meta-label" lines={[activePerson.signal]} duration={0.24} />
                <WriteLines as="h2" lines={[activePerson.name]} delay={0.08} />
                <div className="team-profile-bio">
                  {activePerson.body.map((paragraph, index) => (
                    <WriteLines
                      key={paragraph}
                      lines={[paragraph]}
                      delay={0.2 + index * 0.12}
                      duration={0.24}
                    />
                  ))}
                </div>
                <FadeIn className="team-profile-link-wrap" delay={0.6}>
                  <a href={activePerson.url} target="_blank" rel="noreferrer" className="text-link">
                    {activePerson.displayUrl}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </FadeIn>
                <FadeIn delay={0.68}>
                  <p className="team-source-note">{activePerson.sourceNote}</p>
                </FadeIn>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      <section className="team-roster" aria-label="Team overview">
        {team.map((person, index) => (
          <motion.button
            className={`team-roster-item ${index === activeIndex ? "is-active" : ""}`}
            key={person.name}
            type="button"
            onClick={() => setActiveIndex(index)}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={revealViewport}
            transition={revealTransition(index)}
          >
            <img src={person.image} alt="" loading="lazy" decoding="async" />
            <div>
              <span>{person.name}</span>
              <span>{person.signal}</span>
            </div>
          </motion.button>
        ))}
      </section>

      <section className="statement-band compact">
        <WriteLines
          lines={[
            "Small team, close collaboration, careful work.",
            "Clients work directly with the people shaping the sound, the systems, and the final delivery.",
          ]}
        />
      </section>
    </Page>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xpqgarkj", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Formspree submission failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Page>
      <PageHero
        eyebrow="Contact"
        titleLines={["Get updates,", "or start a conversation."]}
        bodyLines={[
          "Join the updates list for studio notes and archive news, or tell us what you are making now.",
          "We will respond with next steps, availability, and the clearest path forward.",
        ]}
      />
      <section className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <FadeIn className="form-field" delay={0.06}>
              <label>
                Name
                <input name="name" type="text" autoComplete="name" required />
              </label>
            </FadeIn>
            <FadeIn className="form-field" delay={0.14}>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </FadeIn>
          </div>
          <div className="form-row">
            <FadeIn className="form-field" delay={0.22}>
              <label>
                Project type
                <select name="project_type" required defaultValue="">
                  <option value="" disabled>
                    Select one
                  </option>
                  <option>Film and video</option>
                  <option>Brand</option>
                  <option>Production</option>
                  <option>Themed experience</option>
                  <option>Interactive or spatial system</option>
                  <option>Studio updates / newsletter</option>
                </select>
              </label>
            </FadeIn>
            <FadeIn className="form-field" delay={0.3}>
              <label>
                Timeline
                <input name="timeline" type="text" placeholder="Delivery window, launch date, or updates request" required />
              </label>
            </FadeIn>
          </div>
          <FadeIn className="form-field" delay={0.38}>
            <label>
              Budget range <span>Optional, but useful for matching scope to approach.</span>
              <input name="budget_range" type="text" placeholder="Optional" />
            </label>
          </FadeIn>
          <FadeIn className="form-field" delay={0.46}>
            <label>
              Where the work will live
              <textarea name="where_it_lives" rows={4} placeholder="Film, installation, campaign, venue, or just studio updates." required />
            </label>
          </FadeIn>
          <FadeIn className="form-field" delay={0.54}>
            <label>
              What the sound needs to do
              <textarea name="sound_needs" rows={5} placeholder="Project needs, questions, or the updates you want to receive." required />
            </label>
          </FadeIn>
          <input type="hidden" name="_subject" value="Legacy Sound Design contact or updates request" />
          <WriteLines
            as="p"
            className="form-helper"
            lines={["A rough brief or a note that you want studio updates is enough. We can shape the rest in conversation."]}
            delay={0.62}
            duration={0.24}
          />
          <FadeIn className="submit-wrap" delay={0.72}>
            <button
              className="submit-button"
              type="submit"
              disabled={status === "submitting"}
            >
              <CtaChrome icon={<Send size={18} aria-hidden="true" />}>
                {status === "submitting" ? "Sending" : "Send note"}
              </CtaChrome>
            </button>
          </FadeIn>
          {status === "success" ? (
            <p className="form-status success">
              <CheckCircle2 size={18} aria-hidden="true" />
              Thanks. We received your note and will follow up with a practical next step.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="form-status error">
              Something went wrong. Please email the team directly and include the same project details.
            </p>
          ) : null}
        </form>
        <aside className="contact-aside">
          <LegacyIdentity surface="stacked-lockup" className="contact-identity" seed={`${pageLoadSeed}:contact`} />
          <div>
            <WriteLines as="p" className="meta-label" lines={["Signal path"]} />
            <WriteLines
              lines={[
                "Clear scope, direct conversation, careful listening,",
                "and a team that stays connected to the creative intent.",
              ]}
              delay={0.12}
            />
          </div>
        </aside>
      </section>
    </Page>
  );
}

function NotFound() {
  return (
    <Page>
      <PageHero
        eyebrow="404"
        titleLines={["That route is not", "in the signal path."]}
        bodyLines={["The page you are looking for does not exist."]}
      />
      <ButtonLink to="/" variant="primary">
        Return home
      </ButtonLink>
    </Page>
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div className="page" {...pageTransition}>
      {children}
    </motion.div>
  );
}

function PageHero({ eyebrow, titleLines, bodyLines }: { eyebrow: string; titleLines: string[]; bodyLines: string[] }) {
  return (
    <section className="page-hero">
      <WriteLines as="p" className="eyebrow" lines={[eyebrow]} />
      <WriteLines as="h1" lines={titleLines} delay={0.12} />
      <WriteLines lines={bodyLines} delay={0.34} />
    </section>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="section-intro">
      <div>
        <WriteLines as="p" className="eyebrow" lines={[eyebrow]} />
        <WriteLines as="h2" lines={[title]} delay={0.1} />
      </div>
      <WriteLines lines={[body]} delay={0.24} />
    </section>
  );
}

function ServiceList({ items }: { items: Array<{ title: string; label: string; body: string; Icon: LucideIcon }> }) {
  return (
    <section className="service-list">
      {items.map((item, index) => (
        <article
          className="service-item"
          key={item.title}
        >
          <div className="list-icon-row">
            <DrawIcon Icon={item.Icon} delay={index * writeTimings.section} />
            <div className="list-heading-copy">
              <WriteLines as="p" className="meta-label" lines={[item.label]} delay={index * writeTimings.section + 0.04} />
              <WriteLines as="h3" lines={[item.title]} delay={index * writeTimings.section + 0.08} />
            </div>
          </div>
          <WriteLines lines={[item.body]} delay={index * writeTimings.section + 0.18} duration={0.26} />
        </article>
      ))}
    </section>
  );
}

function ProcessGrid() {
  return (
    <section className="process-grid">
      {process.map((item, index) => (
        <article
          key={item.step}
          className="process-item"
        >
          <div className="list-icon-row process-icon-row">
            <DrawIcon Icon={item.Icon} delay={index * writeTimings.section} />
            <div className="list-heading-copy">
              <WriteLines as="p" className="process-step" lines={[item.step]} delay={index * writeTimings.section + 0.04} />
              <WriteLines as="h3" lines={[item.title]} delay={index * writeTimings.section + 0.08} />
            </div>
          </div>
          <WriteLines lines={[item.body]} delay={index * writeTimings.section + 0.18} duration={0.26} />
        </article>
      ))}
    </section>
  );
}

function ContactCta() {
  return (
    <section className="contact-cta">
      <div>
        <WriteLines as="p" className="eyebrow" lines={["Start a conversation"]} />
        <WriteLines as="h2" lines={["Follow the opening,", "or bring us a project."]} delay={0.1} />
        <WriteLines lines={["Join the updates list, or tell us what you are making and what the sound needs to do."]} delay={0.24} />
      </div>
      <FadeIn className="contact-cta-action" delay={0.42}>
        <ButtonLink to="/contact" variant="primary" superButton>
          Join the updates list
        </ButtonLink>
      </FadeIn>
    </section>
  );
}

function ButtonLink({
  to,
  variant,
  children,
  superButton = false,
}: {
  to: string;
  variant: "primary" | "secondary";
  children: ReactNode;
  superButton?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`button-link ${variant}`}
      data-super-button={superButton ? "true" : undefined}
    >
      <CtaChrome icon={<ArrowRight size={18} aria-hidden="true" />}>{children}</CtaChrome>
    </Link>
  );
}

function CtaChrome({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <>
      <span className="button-material" aria-hidden="true" />
      <span className="button-highlight" aria-hidden="true" />
      <span className="button-sheen" aria-hidden="true" />
      <span className="button-signal" aria-hidden="true" />
      <span className="button-label">{children}</span>
      <span className="button-icon-shell">{icon}</span>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <LegacyIdentity surface="horizontal-lockup" className="footer-identity" seed={`${pageLoadSeed}:footer`} />
      <p>Legacy Sound Design is opening for stories, spaces, brands, and experiences.</p>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            {item.label}
          </Link>
        ))}
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  );
}

export default App;
