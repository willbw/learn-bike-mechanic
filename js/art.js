/* Bicycle and dirt-bike artwork (uses js/artkit.js). */

/* ---------------------------------------------------------------- BICYCLE */
const BH = { RH: [260, 370], FH: [740, 370], BB: [470, 395], S: [430, 190], HT: [668, 160], HB: [680, 205] };

const ART_BICYCLE = {
  b_rear_wheel: { 1: wheel(260, 370, { tyreR: 150, rimR: 136, knobs: '2 3', spokes: 32, cross: 0.12, hubR: 11 }) },
  b_front_wheel: { 1: wheel(740, 370, { tyreR: 150, rimR: 136, knobs: '2 3', spokes: 32, cross: 0.0, hubR: 9 }) },
  b_frame: {
    3: `<g stroke="${COL.bikeFrame}" stroke-linecap="round" fill="none">
      <line x1="430" y1="190" x2="664" y2="166" stroke-width="11"/>
      <line x1="678" y1="200" x2="470" y2="395" stroke-width="13"/>
      <line x1="470" y1="395" x2="428" y2="178" stroke-width="11"/>
      <line x1="430" y1="192" x2="260" y2="370" stroke-width="7"/>
      <line x1="470" y1="395" x2="260" y2="370" stroke-width="8"/>
      <line x1="665" y1="150" x2="682" y2="214" stroke-width="17" stroke-linecap="butt"/>
    </g>
    <circle cx="470" cy="395" r="13" fill="${COL.bikeFrame}"/>
    <circle cx="260" cy="370" r="8" fill="${COL.bikeFrame}"/>`
  },
  b_fork: {
    3: `<path d="M682 212 L712 318 Q722 352 740 370" stroke="${COL.steel}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="672" y="208" width="22" height="9" rx="3" fill="#7d8792" transform="rotate(15 683 212)"/>
      <rect x="658" y="143" width="20" height="7" rx="2" fill="#3b424b" transform="rotate(15 668 146)"/>
      <circle cx="740" cy="370" r="6" fill="${COL.steel}"/>`
  },
  b_saddle: {
    3: `<line x1="428" y1="178" x2="424" y2="146" stroke="${COL.steel}" stroke-width="7"/>
      <path d="M378 146 Q394 134 430 137 L480 141 Q486 148 476 151 L432 156 Q402 161 380 156 Z" fill="#2a2f36" stroke="#4b5360" stroke-width="1.5"/>`
  },
  b_cassette: {
    4: `${sprocket(260, 370, 20, 28, '#9aa4ae')}
      <circle cx="260" cy="370" r="15" fill="none" stroke="#7b858f" stroke-width="2"/>
      <path d="M262 372 L280 394 L274 434" stroke="#3b424b" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="279" cy="401" r="6" fill="#59616b"/><circle cx="274" cy="430" r="6" fill="#59616b"/>`
  },
  b_chain: {
    4: `<g stroke="${COL.chain}" stroke-width="4" fill="none" stroke-dasharray="5 2">
      <path d="M470 357 L260 348"/>
      <path d="M470 433 L274 437 L281 404 L262 391"/>
      <path d="M470 357 A38 38 0 0 1 470 433" stroke-dasharray="none" opacity=".7"/>
    </g>`
  },
  b_crankset: {
    5: `<line x1="470" y1="395" x2="433" y2="331" stroke="${COL.steel}" stroke-width="9" stroke-linecap="round" opacity=".45"/>
      <rect x="420" y="327" width="26" height="8" rx="2" fill="#2a2f36" opacity=".6"/>
      ${sprocket(470, 395, 36, 40, '#b6bfc8')}
      <circle cx="470" cy="395" r="22" fill="none" stroke="#7d8792" stroke-width="3"/>
      <line x1="470" y1="395" x2="507" y2="459" stroke="${COL.steel}" stroke-width="10" stroke-linecap="round"/>
      <rect x="494" y="455" width="28" height="9" rx="2" fill="#2a2f36" stroke="#59616b"/>
      <circle cx="470" cy="395" r="7" fill="#59616b"/>`
  },
  b_bars: {
    6: `<line x1="668" y1="150" x2="670" y2="138" stroke="#3b424b" stroke-width="10"/>
      <line x1="668" y1="140" x2="698" y2="130" stroke="#3b424b" stroke-width="9" stroke-linecap="round"/>
      <path d="M698 130 Q692 110 662 108" stroke="#3b424b" stroke-width="7" fill="none" stroke-linecap="round"/>
      <line x1="662" y1="108" x2="636" y2="110" stroke="#111" stroke-width="11" stroke-linecap="round"/>`
  },
  b_brakes: {
    6: `<line x1="668" y1="112" x2="696" y2="126" stroke="${COL.steel}" stroke-width="4" stroke-linecap="round"/>
      <path d="M690 122 Q722 170 698 236" stroke="#111" stroke-width="2.5" fill="none"/>
      <path d="M686 120 Q610 150 552 172 L436 186 Q380 220 358 266" stroke="#111" stroke-width="2.5" fill="none"/>
      <rect x="687" y="234" width="14" height="22" rx="3" fill="${COL.gold}" transform="rotate(20 694 245)"/>
      <rect x="347" y="263" width="14" height="22" rx="3" fill="${COL.gold}" transform="rotate(-45 354 274)"/>`
  }
};

/* -------------------------------------------------------------- DIRT BIKE */
// rear hub (235,398) r_tyre 122 ; front hub (768,390) r_tyre 130; ground 520
// fork axis direction u=(0.454,0.891); P(t)=FH - t*u
const FH = [768, 390], RH = [235, 398];
const U = [0.454, 0.891];
const FP = t => [r1(FH[0] - t * U[0]), r1(FH[1] - t * U[1])];

const ART_DIRT = {
  m_rear_wheel: { 1: wheel(235, 398, { tyreR: 122, rimR: 82, rim: '#2f343b', rimW: 7, knobs: '8 6', spokes: 36, cross: 0.22, hubR: 20, spokeW: 1.6 }) },
  m_front_wheel: { 1: wheel(768, 390, { tyreR: 130, rimR: 96, rim: '#2f343b', rimW: 7, knobs: '7 6', spokes: 36, cross: 0.18, hubR: 15, spokeW: 1.5 }) },

  m_rear_sprocket: { 2: sprocket(235, 398, 42, 48, COL.orange, true) },
  m_chain: {
    2: `<g stroke="#5f666e" stroke-width="5" fill="none" stroke-dasharray="6 3">
      <path d="M466 356 L235 354"/><path d="M466 380 L235 442"/>
      <path d="M235 354 A44 44 0 0 0 235 442" stroke-dasharray="none" opacity=".6"/>
    </g>
    <rect x="300" y="360" width="90" height="7" rx="3" fill="#1d2025" transform="rotate(-9 345 363)"/>`
  },
  m_front_sprocket: { 2: sprocket(466, 368, 11, 13, '#9aa4ae') },

  m_rear_brake: {
    2: `${rotor(235, 398, 43)}
      <rect x="244" y="420" width="26" height="18" rx="4" fill="${COL.red}" transform="rotate(30 257 429)"/>
      <path d="M266 432 Q330 425 412 402" stroke="#111" stroke-width="3" fill="none"/>`,
    10: `<rect x="408" y="392" width="10" height="16" rx="2" fill="#3b424b"/>
      <path d="M440 398 L486 410" stroke="${COL.steel}" stroke-width="7" stroke-linecap="round"/>
      <rect x="480" y="404" width="16" height="10" rx="2" fill="#7d8792"/>
      <circle cx="440" cy="398" r="5" fill="#59616b"/>`
  },
  m_swingarm: {
    3: `<polygon points="428,326.6 232.7,390.3 237.3,405.7 436,353.4" fill="${COL.alu}" stroke="#6c7682" stroke-width="2"/>
      <polygon points="300,377 380,352 382,364 304,388" fill="#8e98a3"/>
      <rect x="226" y="390" width="22" height="16" rx="3" fill="#59616b"/>
      <circle cx="235" cy="398" r="7" fill="#d0d6dc"/>
      <path d="M392 357 L420 386 L446 372 Z" fill="#7d8792" stroke="#59616b" stroke-width="2"/>
      <line x1="420" y1="386" x2="468" y2="420" stroke="#7d8792" stroke-width="6"/>
      <circle cx="432" cy="340" r="9" fill="#2a2f36"/><circle cx="432" cy="340" r="4" fill="#c9d1d9"/>`
  },

  m_airbox: {
    4: `<rect x="330" y="192" width="102" height="78" rx="12" fill="#23272d" stroke="#3a414a" stroke-width="2"/>
      <ellipse cx="374" cy="232" rx="30" ry="26" fill="${COL.orange}"/>
      <ellipse cx="374" cy="232" rx="30" ry="26" fill="none" stroke="#b9621c" stroke-width="2" stroke-dasharray="2 3"/>
      <ellipse cx="374" cy="232" rx="12" ry="10" fill="#2a2f36"/>
      <path d="M430 238 Q455 242 478 250" stroke="#191b1f" stroke-width="18" fill="none" stroke-linecap="round"/>`
  },
  m_battery: {
    4: `<rect x="342" y="168" width="36" height="22" rx="3" fill="#2d3238" stroke="#556070" stroke-width="1.5"/>
      <rect x="347" y="164" width="7" height="5" fill="${COL.red}"/><rect x="366" y="164" width="7" height="5" fill="#111"/>
      <rect x="348" y="175" width="24" height="7" rx="1" fill="#4ade80" opacity=".8"/>`
  },
  m_ecu: {
    4: `<rect x="284" y="183" width="32" height="20" rx="3" fill="#1f2328" stroke="#4b5563" stroke-width="1.5"/>
      <rect x="290" y="189" width="20" height="4" fill="#4b5563"/>
      <path d="M316 192 Q440 172 560 184" stroke="#111" stroke-width="2.5" fill="none" stroke-dasharray="1 0"/>`
  },
  m_shock: {
    4: `<rect x="417" y="196" width="18" height="52" rx="7" fill="${COL.gold}" transform="rotate(10 426 222)"/>
      <line x1="420" y1="205" x2="392" y2="357" stroke="#3b424b" stroke-width="16" stroke-linecap="round"/>
      <line x1="406" y1="285" x2="392" y2="357" stroke="${COL.chrome}" stroke-width="6"/>
      <path d="${coil(418, 220, 396, 340, 9, 13)}" stroke="#e5482f" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <circle cx="420" cy="205" r="6" fill="#59616b"/><circle cx="392" cy="357" r="6" fill="#59616b"/>`
  },
  m_frame: {
    4: `<g stroke="${COL.alu}" stroke-linecap="round" fill="none">
      <path d="M445 190 L300 180 L175 182" stroke-width="8"/>
      <path d="M438 282 L330 226 L230 196 L178 186" stroke-width="7"/>
    </g>
    <g stroke="${COL.motoFrame}" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M622 158 L545 172 Q455 185 440 232 L432 340" stroke-width="17"/>
      <path d="M643 202 L600 330 L585 400" stroke-width="14"/>
      <path d="M585 400 Q580 426 555 428 L470 428 Q446 426 440 402 L432 345" stroke-width="10"/>
      <line x1="614" y1="143" x2="645" y2="207" stroke-width="24" stroke-linecap="butt"/>
      <line x1="440" y1="214" x2="424" y2="208" stroke-width="9"/>
    </g>
    <circle cx="432" cy="340" r="9" fill="#24282e"/><circle cx="432" cy="340" r="4" fill="#c9d1d9"/>`
  },

  m_crankcase: {
    5: `<path d="M460 345 Q470 325 510 322 L575 330 Q605 345 602 385 Q598 420 560 425 L488 425 Q458 420 455 395 Z" fill="${COL.alu}" stroke="#6c7682" stroke-width="2.5"/>
      <path d="M470 352 Q520 335 590 350" stroke="#8b95a0" stroke-width="2" fill="none"/>
      ${[[470, 360], [592, 365], [500, 418], [560, 418], [585, 400]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="#59616b"/>`).join('')}`
  },
  m_oil: {
    5: `<circle cx="590" cy="404" r="10" fill="#8f99a3" stroke="#59616b" stroke-width="2"/>
      <circle cx="590" cy="404" r="3" fill="#59616b"/>
      <circle cx="506" cy="414" r="6" fill="#d9a441" stroke="#7d5a14" stroke-width="1.5"/>
      <rect x="520" y="424" width="10" height="7" rx="1" fill="#59616b"/>`
  },
  m_gearbox: {
    5: `<rect x="472" y="380" width="40" height="38" rx="7" fill="#1c2026" stroke="#59616b" stroke-width="2"/>
      ${sprocket(484, 391, 6, 10, '#c9a53a')}${sprocket(499, 391, 4, 8, '#9aa4ae')}
      ${sprocket(484, 408, 4, 8, '#9aa4ae')}${sprocket(499, 408, 6, 10, '#c9a53a')}`
  },
  m_stator: {
    5: `<circle cx="512" cy="366" r="27" fill="#6f7983" stroke="#4b5563" stroke-width="2.5"/>
      <circle cx="512" cy="366" r="18" fill="none" stroke="#86909a" stroke-width="2"/>
      <circle cx="512" cy="366" r="5" fill="#4b5563"/>`
  },
  m_clutch: {
    5: `<ellipse cx="565" cy="382" rx="30" ry="32" fill="#8a949e" stroke="#5f6873" stroke-width="2.5"/>
      <ellipse cx="565" cy="382" rx="20" ry="22" fill="none" stroke="#a7b0b9" stroke-width="2"/>
      ${Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return `<circle cx="${r1(565 + 26 * Math.cos(a))}" cy="${r1(382 + 28 * Math.sin(a))}" r="2" fill="#4b5563"/>`; }).join('')}`
  },
  m_starter: {
    5: `<rect x="482" y="322" width="36" height="18" rx="7" fill="#3b4048" stroke="#59616b" stroke-width="1.5"/>
      <rect x="512" y="324" width="8" height="14" rx="2" fill="#a9b3bd"/>
      <line x1="486" y1="326" x2="486" y2="336" stroke="#59616b" stroke-width="2"/>`
  },
  m_hoses: {
    7: `<circle cx="578" cy="352" r="12" fill="#9aa4ae" stroke="#59616b" stroke-width="2"/>
      <circle cx="578" cy="352" r="4" fill="#59616b"/>
      <path d="M628 215 Q606 214 590 240" stroke="#141619" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M612 300 Q596 326 584 342" stroke="#141619" stroke-width="8" fill="none" stroke-linecap="round"/>`
  },

  m_cylinder: {
    6: `<g transform="rotate(12 540 332)">
      <rect x="512" y="262" width="56" height="72" rx="3" fill="#959fa9" stroke="#6c7682" stroke-width="2"/>
      ${[272, 284, 296, 308, 320].map(y => `<line x1="506" y1="${y}" x2="574" y2="${y}" stroke="#7d8792" stroke-width="4" stroke-linecap="round"/>`).join('')}
    </g>`
  },
  m_head: {
    6: `<g transform="rotate(12 540 332)">
      <rect x="507" y="222" width="66" height="41" rx="4" fill="#a3adb7" stroke="#6c7682" stroke-width="2"/>
      <rect x="514" y="207" width="52" height="18" rx="7" fill="#3a3f46" stroke="#59616b" stroke-width="1.5"/>
      ${[520, 532, 548, 560].map(x => `<circle cx="${x}" cy="216" r="2" fill="#a9b3bd"/>`).join('')}
    </g>`
  },
  m_carb: {
    6: `<rect x="476" y="238" width="36" height="24" rx="4" fill="#b8c1ca" stroke="#6c7682" stroke-width="2"/>
      <rect x="485" y="224" width="18" height="15" rx="3" fill="#9aa4ae" stroke="#6c7682" stroke-width="1.5"/>
      <rect x="482" y="262" width="24" height="20" rx="4" fill="#a3adb7" stroke="#6c7682" stroke-width="1.5"/>
      <path d="M512 250 L527 241" stroke="#191b1f" stroke-width="15" stroke-linecap="round"/>`
  },
  m_plug: {
    6: `<line x1="566" y1="212" x2="570" y2="190" stroke="#111" stroke-width="9" stroke-linecap="round"/>
      <rect x="558" y="174" width="26" height="18" rx="3" fill="#24282e" stroke="#4b5563" stroke-width="1.5"/>
      <rect x="563" y="178" width="16" height="3" fill="${COL.red}"/>`
  },
  m_fuel_line: {
    7: `<path d="M520 194 Q516 220 496 226" stroke="#d8a23a" stroke-width="4" fill="none" opacity=".9"/>
      <rect x="511" y="184" width="18" height="11" rx="2" fill="#4b5563"/>
      <rect x="526" y="186" width="10" height="4" rx="1" fill="#111"/>`
  },
  m_radiator: {
    7: `<g transform="rotate(18 623 258)">
      <rect x="600" y="212" width="46" height="92" rx="3" fill="#5c6570" stroke="#3a414a" stroke-width="3"/>
      ${[608, 616, 624, 632, 640].map(x => `<line x1="${x}" y1="216" x2="${x}" y2="300" stroke="#7a838e" stroke-width="2"/>`).join('')}
      <rect x="626" y="204" width="10" height="9" rx="2" fill="#9aa4ae"/>
    </g>`
  },
  m_header: {
    8: `<path d="M590 254 C632 262 642 312 602 332 C560 352 470 318 440 290 L420 270" stroke="#b9925a" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M590 254 C632 262 642 312 602 332 C560 352 470 318 440 290 L420 270" stroke="#e1c08a" stroke-width="3" fill="none" opacity=".6" transform="translate(-2,-3)"/>`
  },
  m_muffler: {
    8: `<line x1="420" y1="262" x2="246" y2="208" stroke="${COL.steel}" stroke-width="30" stroke-linecap="round"/>
      <line x1="410" y1="252" x2="252" y2="203" stroke="#eef2f5" stroke-width="4" stroke-linecap="round" opacity=".6"/>
      <rect x="408" y="254" width="10" height="26" rx="2" fill="#7d8792" transform="rotate(17 413 267)"/>
      <circle cx="236" cy="205" r="13" fill="#3b424b" stroke="#8b95a0" stroke-width="2"/>
      <circle cx="236" cy="205" r="5" fill="#111"/>`
  },

  m_tank: {
    9: `<path d="M632 140 Q600 108 540 114 Q500 119 470 140 L470 178 L520 187 L612 178 Q632 164 632 140 Z" fill="#dfe6ec" stroke="#9aa6b2" stroke-width="2" opacity=".95"/>
      <path d="M472 160 L472 178 L520 187 L612 178 Q622 170 627 160 Z" fill="#e5c86b" opacity=".55"/>
      <ellipse cx="552" cy="114" rx="13" ry="5" fill="#2a2f36"/>`
  },
  m_fork: {
    9: `<line x1="${FP(100)[0]}" y1="${FP(100)[1]}" x2="${FP(300)[0]}" y2="${FP(300)[1]}" stroke="${COL.gold}" stroke-width="19" stroke-linecap="round"/>
      <line x1="${FP(12)[0]}" y1="${FP(12)[1]}" x2="${FP(110)[0]}" y2="${FP(110)[1]}" stroke="${COL.chrome}" stroke-width="12"/>
      <line x1="${FP(0)[0]}" y1="${FP(0)[1]}" x2="${FP(26)[0]}" y2="${FP(26)[1]}" stroke="#2a2f36" stroke-width="18" stroke-linecap="round"/>
      <line x1="672" y1="186" x2="636" y2="205" stroke="#4b5563" stroke-width="13" stroke-linecap="round"/>
      <line x1="645" y1="132" x2="612" y2="149" stroke="#4b5563" stroke-width="11" stroke-linecap="round"/>
      <circle cx="768" cy="390" r="6" fill="#c9d1d9"/>`
  },
  m_front_brake: {
    9: `${rotor(768, 390, 47)}`,
    10: `<rect x="718" y="358" width="28" height="19" rx="4" fill="${COL.red}" transform="rotate(-30 731 368)"/>
      <path d="M730 358 Q700 300 682 232 Q664 168 614 98" stroke="#111" stroke-width="3" fill="none"/>
      <rect x="604" y="84" width="18" height="11" rx="2" fill="#2a2f36"/>
      <line x1="614" y1="98" x2="648" y2="111" stroke="${COL.steel}" stroke-width="4" stroke-linecap="round"/>`
  },
  m_bars: {
    10: `<rect x="620" y="122" width="16" height="12" rx="2" fill="#4b5563" transform="rotate(-28 628 128)"/>
      <path d="M628 128 L618 104 Q614 95 598 95 L588 95" stroke="#363c44" stroke-width="8" fill="none" stroke-linecap="round"/>
      <line x1="596" y1="95" x2="572" y2="96" stroke="#111" stroke-width="11" stroke-linecap="round"/>
      <rect x="610" y="104" width="22" height="7" rx="3" fill="${COL.red}" transform="rotate(-62 621 108)"/>`
  },
  m_throttle: {
    10: `<line x1="596" y1="95" x2="576" y2="96" stroke="#3a3f46" stroke-width="14" stroke-linecap="round"/>
      <rect x="595" y="88" width="10" height="15" rx="2" fill="#2a2f36"/>
      <path d="M601 103 Q612 160 562 190 Q520 214 498 226" stroke="#111" stroke-width="2.5" fill="none"/>`
  },
  m_clutch_lever: {
    10: `<rect x="606" y="100" width="12" height="8" rx="2" fill="#4b5563"/>
      <line x1="614" y1="104" x2="645" y2="124" stroke="#d3d9df" stroke-width="4" stroke-linecap="round"/>
      <path d="M608 108 Q636 200 600 300 Q588 350 570 370" stroke="#111" stroke-width="2.5" fill="none"/>`
  },
  m_footpegs: {
    10: `<rect x="433" y="401" width="30" height="9" rx="2" fill="#4b5563"/>
      <line x1="434" y1="401" x2="462" y2="401" stroke="#a9b3bd" stroke-width="3" stroke-dasharray="2 2"/>
      <rect x="440" y="406" width="10" height="12" fill="#3b424b"/>`
  },
  m_shifter: {
    10: `<line x1="474" y1="378" x2="512" y2="396" stroke="${COL.steel}" stroke-width="6" stroke-linecap="round"/>
      <rect x="506" y="390" width="14" height="9" rx="2" fill="#7d8792"/>
      <circle cx="474" cy="378" r="5" fill="#59616b"/>`
  },
  m_seat: {
    11: `<path d="M628 133 Q600 140 560 146 L470 156 L300 163 L232 166 Q220 172 230 179 L300 178 L470 172 L560 162 Q608 153 630 146 Z" fill="#3a4250" stroke="#5b6574" stroke-width="2"/>
      <path d="M560 150 L300 166" stroke="#5b6574" stroke-width="1.5" stroke-dasharray="6 5"/>`
  },
  m_plastics: {
    11: `<path d="M672 214 Q760 194 862 246 L854 259 Q760 214 676 229 Z" fill="${COL.plastic}" stroke="#b58f0c" stroke-width="1.5"/>
      <path d="M300 168 L120 178 Q98 182 96 192 L140 190 L300 183 Z" fill="${COL.plastic}" stroke="#b58f0c" stroke-width="1.5"/>
      <path d="M636 132 Q600 132 574 150 L578 202 L612 238 L656 222 L662 180 Z" fill="${COL.plastic}" stroke="#b58f0c" stroke-width="1.5"/>
      <path d="M612 156 L640 168 L640 204" stroke="#b58f0c" stroke-width="2" fill="none"/>
      <path d="M302 179 L420 177 L405 254 L312 249 Z" fill="${COL.white}" stroke="#9aa6b2" stroke-width="1.5"/>
      <text x="358" y="230" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="40" fill="#1d4ed8" text-anchor="middle" transform="rotate(-3 358 222)">42</text>
      <path d="M646 100 Q672 104 694 124 L684 194 Q670 184 658 186 Z" fill="${COL.white}" stroke="#9aa6b2" stroke-width="1.5"/>
      <text x="670" y="160" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="30" fill="#1d4ed8" text-anchor="middle" transform="rotate(14 670 150)">42</text>`
  }
};

const ART = Object.assign({}, ART_BICYCLE, ART_DIRT);
