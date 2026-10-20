/* Soapbox and roadster artwork (uses js/artkit.js). Side view, facing right,
   ground at y=520. The roadster is drawn as an x-ray: the painted body skin
   goes on last and is translucent so the systems underneath stay visible.
   Roadster: rear hub (240, 451), front hub (771, 451), tyre radius 69 px
   (about 230 px per metre). */

const CC = {
  wood: '#b98149', woodDark: '#8a5a2e', steel: '#9aa6b2', structure: '#8c98a6',
  engine: '#a7b1bc', engineDark: '#6c7682', paint: '#d1312f', glass: '#9fd3f5',
  copper: '#c98a4b', rubber: '#16181b', hot: '#b9925a', coolant: '#3fa9f5', fuel: '#e2b13c'
};

function alloyWheel(cx, cy, tyreR, rimR) {
  const band = (tyreR + rimR) / 2;
  let sp = '';
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
    sp += `<line x1="${r1(cx + 9 * Math.cos(a))}" y1="${r1(cy + 9 * Math.sin(a))}" x2="${r1(cx + (rimR - 3) * Math.cos(a))}" y2="${r1(cy + (rimR - 3) * Math.sin(a))}" stroke="#c9d1d9" stroke-width="9" stroke-linecap="round"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${band}" fill="none" stroke="${COL.tyre}" stroke-width="${tyreR - rimR}"/>
    <circle cx="${cx}" cy="${cy}" r="${tyreR - 2}" fill="none" stroke="#24272c" stroke-width="3" stroke-dasharray="4 3"/>
    <circle cx="${cx}" cy="${cy}" r="${tyreR}" fill="none" stroke="${COL.tyreEdge}" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${rimR}" fill="#2b3037" stroke="#d6dde3" stroke-width="3"/>
    ${sp}
    <circle cx="${cx}" cy="${cy}" r="10" fill="#aeb7c1"/><circle cx="${cx}" cy="${cy}" r="4" fill="#4a525c"/>`;
}

function coilover(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3b424b" stroke-width="9" stroke-linecap="round"/>
    <path d="${coil(x1, y1 + (y2 - y1) * 0.15, x2, y2 - (y2 - y1) * 0.25, 6, 9)}" stroke="#e5482f" stroke-width="4" fill="none"/>
    <line x1="${x1}" y1="${y1}" x2="${r1(x1 + (x2 - x1) * 0.4)}" y2="${r1(y1 + (y2 - y1) * 0.4)}" stroke="${COL.gold}" stroke-width="12" stroke-linecap="round"/>`;
}

/* ------------------------------------------------------------- SOAPBOX */
const ART_SOAPBOX = {
  s_rear_wheels: {
    1: wheel(300, 455, { tyreR: 65, rimR: 52, spokes: 16, cross: 0, hubR: 8 }),
    3: `<rect x="282" y="432" width="36" height="18" rx="3" fill="#59616b"/><circle cx="300" cy="455" r="6" fill="#c9d1d9"/>`
  },
  s_front_wheels: {
    1: wheel(700, 455, { tyreR: 65, rimR: 52, spokes: 16, cross: 0, hubR: 8 }),
    3: `<circle cx="700" cy="455" r="6" fill="#c9d1d9"/>`
  },
  s_plank: {
    2: `<rect x="225" y="418" width="570" height="20" rx="4" fill="${CC.wood}" stroke="${CC.woodDark}" stroke-width="2"/>
      <path d="M240 425 Q400 421 560 427 T780 424" stroke="${CC.woodDark}" stroke-width="1.5" fill="none" opacity=".6"/>
      <path d="M260 432 Q450 429 640 434" stroke="${CC.woodDark}" stroke-width="1" fill="none" opacity=".5"/>`
  },
  s_front_axle: {
    3: `<rect x="672" y="438" width="56" height="16" rx="3" fill="${CC.woodDark}"/>
      <line x1="700" y1="404" x2="700" y2="452" stroke="#c9d1d9" stroke-width="6"/>
      <rect x="690" y="400" width="20" height="7" rx="2" fill="#7d8792"/>
      <circle cx="700" cy="455" r="5" fill="#59616b"/>`
  },
  s_seat: {
    3: `<rect x="290" y="402" width="130" height="16" rx="6" fill="#3b6e8f"/>
      <path d="M292 418 L270 330 L296 326 L316 412 Z" fill="${CC.wood}" stroke="${CC.woodDark}" stroke-width="2"/>`
  },
  s_steering: {
    4: `<line x1="690" y1="420" x2="566" y2="362" stroke="#7d8792" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="562" cy="358" rx="8" ry="36" fill="none" stroke="#2a2f36" stroke-width="7" transform="rotate(-25 562 358)"/>
      <path d="M640 398 Q680 410 676 440 M640 398 Q712 404 724 440" stroke="#d6c08a" stroke-width="2" fill="none"/>`
  },
  s_brake: {
    4: `<line x1="460" y1="350" x2="440" y2="430" stroke="#7d8792" stroke-width="7" stroke-linecap="round"/>
      <circle cx="444" cy="420" r="5" fill="#59616b"/>
      <line x1="440" y1="430" x2="374" y2="452" stroke="#7d8792" stroke-width="4"/>
      <rect x="362" y="440" width="12" height="26" rx="2" fill="#2a2f36"/>
      <rect x="452" y="340" width="16" height="14" rx="4" fill="#d1312f"/>`
  }
};

/* ------------------------------------------------------------- ROADSTER */
const ART_ROADSTER = {
  /* chapter 2: chassis */
  c_rear_wheel: { 1: alloyWheel(240, 451, 69, 44) },
  c_front_wheel: { 1: alloyWheel(771, 451, 69, 44) },
  c_shell: {
    3: `<g stroke="${CC.structure}" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M313 474 L697 474" stroke-width="11"/>
      <path d="M160 462 L78 462 L70 362" stroke-width="8"/>
      <path d="M845 462 L950 462 L955 395" stroke-width="8"/>
      <path d="M560 474 L560 330 L512 258" stroke-width="8"/>
      <path d="M362 474 L362 340" stroke-width="7"/>
      <path d="M362 342 L560 334" stroke-width="6"/>
      <path d="M362 340 L90 352" stroke-width="6"/>
      <path d="M313 470 A80 80 0 1 0 166 470" stroke-width="5"/>
      <path d="M845 470 A80 80 0 1 0 697 470" stroke-width="5"/>
      <rect x="752" y="352" width="38" height="20" rx="3" stroke-width="4"/>
      <rect x="222" y="352" width="36" height="20" rx="3" stroke-width="4"/>
    </g>
    <path d="M560 470 L560 334" stroke="#6f7b88" stroke-width="2" stroke-dasharray="4 4"/>`
  },
  c_front_susp: {
    5: `<rect x="762" y="418" width="18" height="62" rx="4" fill="#7d8792"/>
      <polygon points="728,404 812,404 776,416" fill="#59616b"/>
      <polygon points="720,486 820,486 776,472" fill="#59616b"/>
      ${coilover(780, 478, 771, 362)}`
  },
  c_rear_susp: {
    5: `<rect x="231" y="418" width="18" height="62" rx="4" fill="#7d8792"/>
      <polygon points="196,404 286,404 240,416" fill="#59616b"/>
      <polygon points="190,486 290,486 244,472" fill="#59616b"/>
      <line x1="244" y1="440" x2="330" y2="458" stroke="#59616b" stroke-width="5"/>
      ${coilover(250, 478, 240, 362)}`
  },
  c_arb: {
    5: `<path d="M705 468 Q712 452 740 450 L768 452" stroke="#8a95a3" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="705" cy="468" r="5" fill="#e0a63c"/>
      <path d="M300 466 Q292 452 270 452 L246 454" stroke="#8a95a3" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="300" cy="466" r="5" fill="#e0a63c"/>`
  },
  c_steering: {
    6: `<line x1="507" y1="333" x2="735" y2="430" stroke="#7d8792" stroke-width="6" stroke-linecap="round"/>
      <circle cx="600" cy="373" r="5" fill="#59616b"/>
      <rect x="722" y="420" width="34" height="18" rx="5" fill="#4b5563"/>
      <line x1="756" y1="430" x2="772" y2="434" stroke="#9aa6b2" stroke-width="4"/>
      <ellipse cx="503" cy="330" rx="8" ry="36" fill="none" stroke="#24282e" stroke-width="7" transform="rotate(-22 503 330)"/>`
  },

  /* chapter 3: brakes */
  c_booster: {
    6: `<circle cx="584" cy="364" r="22" fill="#2f353d" stroke="#59616b" stroke-width="2"/>
      <rect x="604" y="357" width="34" height="14" rx="3" fill="#a7b1bc"/>
      <rect x="610" y="345" width="18" height="12" rx="2" fill="#e8e2c8" stroke="#9aa6b2"/>
      <line x1="560" y1="364" x2="540" y2="400" stroke="#7d8792" stroke-width="3"/>`
  },
  c_brake_lines: {
    6: `<g stroke="${CC.copper}" stroke-width="2.5" fill="none">
      <path d="M636 368 Q700 380 740 428"/>
      <path d="M630 371 Q610 420 600 466 L270 466 Q255 462 256 444"/>
      <path d="M632 373 Q600 440 590 468 L300 469"/>
    </g>`
  },
  c_front_brakes: {
    2: `${rotor(771, 451, 36)}`,
    6: `<rect x="733" y="414" width="30" height="20" rx="5" fill="${COL.red}" transform="rotate(-38 748 424)"/>`
  },
  c_rear_brakes: {
    2: `${rotor(240, 451, 32)}`,
    6: `<rect x="204" y="416" width="26" height="18" rx="5" fill="${COL.red}" transform="rotate(38 217 425)"/>
      <path d="M470 446 Q360 452 262 448" stroke="#c9d1d9" stroke-width="1.5" fill="none" stroke-dasharray="5 3"/>`
  },
  c_abs: {
    6: `<rect x="862" y="422" width="34" height="26" rx="4" fill="#3b424b" stroke="#6c7682" stroke-width="1.5"/>
      <rect x="868" y="414" width="22" height="9" rx="2" fill="#24282e"/>
      <path d="M862 432 Q800 400 640 372" stroke="${CC.copper}" stroke-width="2" fill="none"/>`
  },

  /* chapter 4: engine */
  c_block: {
    4: `<rect x="625" y="385" width="140" height="73" rx="5" fill="${CC.engine}" stroke="${CC.engineDark}" stroke-width="2.5"/>
      ${[643, 678, 712, 747].map(x => `<rect x="${x - 14}" y="391" width="28" height="56" rx="2" fill="#2a3038"/>`).join('')}
      <line x1="628" y1="450" x2="762" y2="450" stroke="#59616b" stroke-width="5"/>
      ${[643, 678, 712, 747].map((x, i) => `<circle cx="${x}" cy="${i === 0 || i === 3 ? 444 : 456}" r="4" fill="#c9d1d9"/>`).join('')}`
  },
  c_pistons: {
    5: `${[643, 678, 712, 747].map((x, i) => {
      const up = i === 0 || i === 3, top = up ? 393 : 418, pin = top + 10, crankY = up ? 444 : 456;
      return `<rect x="${x - 12}" y="${top}" width="24" height="17" rx="2" fill="#d5dbe1"/>
        <line x1="${x - 12}" y1="${top + 4}" x2="${x + 12}" y2="${top + 4}" stroke="#7d8792" stroke-width="1.5"/>
        <line x1="${x}" y1="${pin}" x2="${x}" y2="${crankY}" stroke="#94a3b8" stroke-width="6"/>`;
    }).join('')}`
  },
  c_head: {
    4: `<rect x="622" y="357" width="146" height="29" rx="4" fill="#b8c1ca" stroke="${CC.engineDark}" stroke-width="2"/>
      <rect x="628" y="345" width="134" height="14" rx="6" fill="#2f353d" stroke="#59616b" stroke-width="1.5"/>
      ${[643, 678, 712, 747].map(x => `<circle cx="${x - 7}" cy="371" r="4" fill="#6c7682"/><circle cx="${x + 7}" cy="371" r="4" fill="#6c7682"/>`).join('')}`
  },
  c_timing: {
    5: `<rect x="765" y="350" width="12" height="104" rx="4" fill="#2f353d"/>
      <path d="M771 360 L771 446" stroke="#e0a63c" stroke-width="3" stroke-dasharray="4 2"/>
      <circle cx="771" cy="362" r="5" fill="#e0a63c"/><circle cx="771" cy="446" r="5" fill="#e0a63c"/>`
  },
  c_sump: {
    4: `<path d="M632 458 L758 458 L752 492 Q700 498 640 492 Z" fill="#59616b" stroke="#3b424b" stroke-width="2"/>
      <rect x="690" y="490" width="10" height="5" fill="#2a2f36"/>
      <rect x="610" y="430" width="16" height="22" rx="4" fill="#2563eb"/>`
  },

  /* chapter 5: fuel & air */
  c_tank: {
    4: `<rect x="262" y="378" width="92" height="62" rx="10" fill="#4b5563" stroke="#6c7682" stroke-width="2"/>
      <rect x="266" y="408" width="84" height="28" rx="6" fill="${CC.fuel}" opacity=".55"/>
      <line x1="300" y1="378" x2="296" y2="348" stroke="#4b5563" stroke-width="10"/>
      <circle cx="296" cy="348" r="7" fill="#2a2f36"/>`
  },
  c_fuel_pump: {
    5: `<rect x="320" y="400" width="14" height="32" rx="4" fill="#24282e" stroke="#9aa6b2"/>
      <path d="M327 432 L327 468 L610 468 Q622 466 628 452 L630 392" stroke="${CC.fuel}" stroke-width="2.5" fill="none"/>`
  },
  c_injectors: {
    7: `<line x1="636" y1="388" x2="756" y2="388" stroke="${CC.fuel}" stroke-width="5" stroke-linecap="round"/>
      ${[643, 678, 712, 747].map(x => `<rect x="${x - 4}" y="388" width="8" height="12" rx="2" fill="#24282e"/>`).join('')}`
  },
  c_intake: {
    7: `<rect x="800" y="358" width="78" height="44" rx="8" fill="#24282e" stroke="#4b5563" stroke-width="2"/>
      <rect x="808" y="366" width="62" height="28" rx="4" fill="${COL.orange}" opacity=".8"/>
      <path d="M800 380 Q785 382 778 398" stroke="#1c1f24" stroke-width="12" fill="none"/>
      <rect x="788" y="374" width="10" height="12" rx="2" fill="#9aa6b2"/>
      <rect x="630" y="398" width="132" height="14" rx="5" fill="#5f6b78" opacity=".9"/>
      ${[643, 678, 712, 747].map(x => `<path d="M${x} 398 L${x} 386" stroke="#5f6b78" stroke-width="9"/>`).join('')}
      <circle cx="770" cy="402" r="7" fill="#c9d1d9" stroke="#59616b"/>`
  },
  c_ecu: {
    6: `<rect x="514" y="404" width="30" height="20" rx="3" fill="#1f2328" stroke="#4b5563" stroke-width="1.5"/>
      <rect x="519" y="410" width="20" height="4" fill="#4b5563"/>
      <path d="M544 412 Q600 400 640 400" stroke="#111" stroke-width="2" fill="none"/>`
  },

  /* chapter 6: electrics */
  c_battery: {
    4: `<rect x="112" y="404" width="46" height="32" rx="3" fill="#2d3238" stroke="#556070" stroke-width="1.5"/>
      <rect x="118" y="398" width="8" height="6" fill="${COL.red}"/><rect x="144" y="398" width="8" height="6" fill="#111"/>
      <rect x="120" y="414" width="30" height="10" rx="1" fill="#4ade80" opacity=".8"/>`
  },
  c_alternator: {
    7: `<circle cx="792" cy="418" r="13" fill="#9aa6b2" stroke="#59616b" stroke-width="2"/>
      <circle cx="792" cy="418" r="5" fill="#59616b"/>
      <path d="M778 446 L792 431 M786 452 L800 424" stroke="#1c1f24" stroke-width="3"/>`
  },
  c_starter: {
    6: `<rect x="583" y="445" width="34" height="16" rx="7" fill="#3b4048" stroke="#59616b" stroke-width="1.5"/>
      <rect x="612" y="447" width="8" height="12" rx="2" fill="#a9b3bd"/>`
  },
  c_coils: {
    7: `${[643, 678, 712, 747].map(x => `<rect x="${x - 5}" y="336" width="10" height="16" rx="2" fill="#24282e"/><rect x="${x - 4}" y="338" width="8" height="3" fill="${COL.red}"/>`).join('')}`
  },
  c_fusebox: {
    6: `<rect x="508" y="372" width="22" height="16" rx="2" fill="#2a2f36" stroke="#6c7682"/>
      <path d="M135 398 Q200 360 362 352 L520 372" stroke="#111" stroke-width="2.5" fill="none"/>
      <path d="M530 380 Q600 350 640 340" stroke="#111" stroke-width="2.5" fill="none"/>`
  },

  /* chapter 7: cooling & exhaust */
  c_radiator: {
    7: `<rect x="912" y="376" width="26" height="92" rx="3" fill="#5c6570" stroke="#3a414a" stroke-width="2"/>
      ${[384, 396, 408, 420, 432, 444, 456].map(y => `<line x1="914" y1="${y}" x2="936" y2="${y}" stroke="#7a838e" stroke-width="2"/>`).join('')}
      <rect x="898" y="386" width="10" height="72" rx="3" fill="#2a2f36"/>
      <rect x="918" y="368" width="12" height="8" rx="2" fill="#9aa6b2"/>`
  },
  c_hoses: {
    8: `<path d="M914 386 Q850 360 774 365" stroke="#141619" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M914 460 Q860 470 806 398" stroke="#141619" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="800" cy="394" r="9" fill="#9aa6b2" stroke="#59616b" stroke-width="2"/>
      <circle cx="774" cy="365" r="5" fill="${CC.coolant}"/>`
  },
  c_manifold: {
    8: `${[643, 678, 712, 747].map(x => `<path d="M${x} 386 Q${x} 420 ${620 + (x - 643) * 0.2} 470" stroke="${CC.hot}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M622 470 Q615 486 590 490" stroke="${CC.hot}" stroke-width="10" fill="none" stroke-linecap="round"/>`
  },
  c_catalyst: {
    8: `<path d="M590 490 L582 490" stroke="#9aa6b2" stroke-width="8"/>
      <rect x="512" y="481" width="72" height="18" rx="9" fill="#c9d1d9" stroke="#7d8792" stroke-width="2"/>
      <rect x="530" y="486" width="36" height="8" rx="2" fill="#a9b3bd" stroke="#7d8792" stroke-width="1" stroke-dasharray="2 2"/>
      <line x1="582" y1="490" x2="600" y2="490" stroke="#9aa6b2" stroke-width="7"/>`
  },
  c_muffler: {
    8: `<path d="M512 490 L180 492" stroke="#9aa6b2" stroke-width="7" fill="none"/>
      <rect x="92" y="476" width="92" height="26" rx="12" fill="#c9d1d9" stroke="#7d8792" stroke-width="2"/>
      <path d="M92 492 L58 494" stroke="#9aa6b2" stroke-width="9" stroke-linecap="round"/>
      <circle cx="56" cy="494" r="5" fill="#111"/>`
  },

  /* chapter 8: drivetrain */
  c_clutch: {
    5: `<path d="M600 398 L626 392 L626 474 L600 468 Z" fill="#8f99a3" stroke="#59616b" stroke-width="2"/>
      <rect x="608" y="406" width="6" height="56" rx="2" fill="#8b5a2b"/>
      <rect x="616" y="402" width="4" height="64" rx="1" fill="#c9d1d9"/>`
  },
  c_gearbox: {
    5: `<path d="M520 410 L600 400 L600 466 L520 456 Z" fill="#9aa4ae" stroke="#59616b" stroke-width="2"/>
      <path d="M520 420 L500 426 L500 440 L520 446 Z" fill="#8f99a3" stroke="#59616b" stroke-width="1.5"/>
      ${[536, 552, 568, 584].map((x, i) => `<line x1="${x}" y1="${414 - i}" x2="${x}" y2="${452 + i}" stroke="#7d8792" stroke-width="2"/>`).join('')}`
  },
  c_propshaft: {
    3: `<line x1="500" y1="433" x2="270" y2="447" stroke="#7d8792" stroke-width="9" stroke-linecap="round"/>
      <circle cx="497" cy="433" r="6" fill="#59616b"/><circle cx="274" cy="447" r="6" fill="#59616b"/>`
  },
  c_diff: {
    3: `<circle cx="240" cy="451" r="26" fill="#7d8792" stroke="#4b5563" stroke-width="3"/>
      ${sprocket(240, 451, 16, 30, '#c9a53a')}
      <circle cx="263" cy="449" r="6" fill="#9aa6b2"/>`
  },
  c_halfshafts: {
    3: `<line x1="214" y1="466" x2="240" y2="451" stroke="#59616b" stroke-width="7"/>
      <ellipse cx="208" cy="470" rx="10" ry="7" fill="#1c1f24"/>
      <path d="M200 467 L216 473 M201 471 L215 475" stroke="#3b424b" stroke-width="1.5"/>`
  },

  /* chapter 9: controls & body */
  c_pedals: {
    6: `<line x1="532" y1="392" x2="548" y2="450" stroke="#7d8792" stroke-width="5"/>
      <rect x="542" y="446" width="14" height="6" rx="2" fill="#24282e"/>
      <line x1="526" y1="392" x2="538" y2="446" stroke="#5f6b78" stroke-width="4" opacity=".8"/>
      <circle cx="530" cy="392" r="4" fill="#59616b"/>`
  },
  c_gearlever: {
    6: `<line x1="560" y1="410" x2="515" y2="372" stroke="#9aa6b2" stroke-width="5" stroke-linecap="round"/>
      <circle cx="513" cy="370" r="8" fill="#24282e"/>
      <path d="M548 402 Q540 392 528 388" stroke="#1c1f24" stroke-width="10" fill="none" opacity=".7"/>`
  },
  c_dash: {
    7: `<path d="M508 326 L560 330 L560 352 L520 350 Z" fill="#2a2f36" stroke="#4b5563" stroke-width="1.5"/>
      <circle cx="530" cy="338" r="6" fill="#0b131c" stroke="#e0a63c" stroke-width="1.5"/>
      <circle cx="546" cy="339" r="6" fill="#0b131c" stroke="#e0a63c" stroke-width="1.5"/>`
  },
  c_seats: {
    7: `<rect x="392" y="444" width="114" height="20" rx="8" fill="#3a3f46"/>
      <path d="M398 458 L370 332 Q372 322 384 324 L410 450 Z" fill="#3a3f46" stroke="#4b5563" stroke-width="1.5"/>
      <rect x="372" y="320" width="20" height="18" rx="6" fill="#3a3f46"/>
      <path d="M380 340 L500 452" stroke="#c81e1e" stroke-width="3" opacity=".8"/>`
  },
  c_body: {
    11: `<path d="M66 486 L58 405 Q60 354 95 349 L362 338 L560 330 L760 334 Q900 345 950 360 Q968 378 966 420 L962 486 L843 486 A80 80 0 1 0 699 486 L313 486 A80 80 0 1 0 167 486 Z"
        fill="${CC.paint}" fill-opacity=".26" stroke="${CC.paint}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M362 340 L560 332" stroke="#7a1a18" stroke-width="5"/>
      <path d="M370 346 L372 482 M552 340 L552 482" stroke="#7a1a18" stroke-width="1.5"/>
      <rect x="520" y="356" width="18" height="4" rx="2" fill="#e2e8f0"/>
      <path d="M560 331 L512 258 L503 262 L548 334 Z" fill="${CC.glass}" fill-opacity=".45" stroke="#c9d1d9" stroke-width="2"/>
      <ellipse cx="934" cy="372" rx="16" ry="7" fill="#fef3c7" stroke="#c9d1d9" stroke-width="1.5"/>
      <rect x="58" y="368" width="12" height="20" rx="3" fill="#ef4444"/>
      <path d="M940 470 L968 470 L966 488 L940 488 Z" fill="#2a2f36"/>
      <path d="M58 466 L84 466 L84 488 L64 488 Z" fill="#2a2f36"/>`
  }
};

const ART = Object.assign({}, ART_SOAPBOX, ART_ROADSTER);
