import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { me, experience, skills, tools, education, projects } from "./data";
gsap.registerPlugin(ScrollTrigger);

const scroll = { p: 0 }; // page scroll progress 0..1, written by GSAP, read by the 3D scene

function Shapes() {
  const knot = useRef(), ico = useRef(), mat = useRef();
  useFrame((s) => {
    const p = scroll.p, t = s.clock.elapsedTime, k = knot.current;
    k.rotation.set(t * 0.12 + p * 6, t * 0.1 + p * Math.PI * 4, 0);
    k.position.x += (Math.sin(p * Math.PI * 2) * 2.4 - k.position.x) * 0.06;
    k.position.y += (s.pointer.y * 0.5 - k.position.y) * 0.05;
    k.scale.setScalar(1.2 + Math.sin(p * Math.PI) * 0.6);
    ico.current.rotation.y = t * 0.4;
    ico.current.position.set(Math.cos(t * 0.5 + p * 8) * 3, Math.sin(t * 0.4) * 1.6, -1);
    mat.current.color.setHSL(0.13 - p * 0.1, 1, 0.5); // yellow -> orange as you scroll
  });
  return (<>
    <mesh ref={knot}><torusKnotGeometry args={[1, 0.32, 160, 20]} /><meshBasicMaterial ref={mat} wireframe transparent opacity={0.45} /></mesh>
    <mesh ref={ico}><icosahedronGeometry args={[0.5, 1]} /><meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.25} /></mesh>
  </>);
}

const Letters = ({ t }) => <span className="line">{t.split("").map((c, i) => <span key={i} className="ch">{c}</span>)}</span>;
const Chips = ({ list }) => <div className="chips">{list.map((x) => <span key={x}>{x}</span>)}</div>;

export default function App() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".ch", { yPercent: 110, stagger: 0.04, duration: 0.9, ease: "power4.out" });
      gsap.from(".hero-sub", { opacity: 0, y: 20, delay: 0.8, duration: 0.8 });
      gsap.utils.toArray(".reveal").forEach((el) =>
        gsap.from(el, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { scroll.p = s.progress; } });
    });
    return () => ctx.revert();
  }, []);

  const [first, ...rest] = me.name.split(" ");
  return (<>
    <Canvas className="bg3d" camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}><Shapes /></Canvas>
    <header className="nav">
      <a href="#top" className="brand">SV.</a>
      <nav>{["about", "experience", "skills", "projects", "contact"].map((s) => <a key={s} href={`#${s}`}>{s}</a>)}</nav>
    </header>

    <main id="top">
      <section className="hero">
        <p className="eyebrow">{me.location}</p>
        <h1><Letters t={first.toUpperCase()} /><Letters t={rest.join(" ").toUpperCase()} /></h1>
        <p className="hero-sub"><b>{me.role}</b><br />{me.tagline}</p>
        <a className="cta hero-sub" href="#contact">Let’s work together ↗</a>
        <span className="scrollhint">SCROLL</span>
      </section>

      <section id="about" className="sec about">
        <img className="photo reveal" src={me.photo} alt={me.name} />
        <div className="reveal"><h2>About</h2><p className="lead">{me.about}</p></div>
      </section>

      <section id="experience" className="sec">
        <h2 className="reveal">Experience</h2>
        <div className="timeline">
          {experience.map((e) => (
            <article key={e.role + e.org} className="card reveal">
              <div className="row"><h3>{e.role}</h3><span className="when">{e.when}</span></div>
              <p className="org">{e.org}</p>
              <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="sec">
        <h2 className="reveal">Skills &amp; Tools</h2>
        <div className="cols">
          {Object.entries({ ...skills, ...tools }).map(([k, v]) => (
            <div key={k} className="card reveal"><h3>{k}</h3><Chips list={v} /></div>
          ))}
        </div>
        <div className="cols edu">
          {education.map((e) => (
            <div key={e.t} className="card reveal"><h3>{e.t}</h3><p className="org">{e.s}</p><span className="when">{e.y}</span></div>
          ))}
        </div>
      </section>

      <section id="projects" className="sec">
        <h2 className="reveal">Selected Work</h2>
        <div className="cols">
          {projects.map((p, i) => (
            <article key={p.title} className="card proj reveal">
              <span className="num">0{i + 1}</span><h3>{p.title}</h3><p>{p.text}</p>
              {p.link && <a href={p.link} target="_blank" rel="noreferrer">View ↗</a>}
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="sec contact">
        <h2 className="big reveal">Have a project<br />in mind?</h2>
        <div className="links reveal">
          <a href={`mailto:${me.email}`}>{me.email}</a>
          <a href={`tel:${me.phone.replace(/\s/g, "")}`}>{me.phone}</a>
          <a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={me.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
        <p className="foot">© {new Date().getFullYear()} {me.name}</p>
      </section>
    </main>
  </>);
}
