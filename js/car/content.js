/* Soapbox to Sports Car: parts, chapters, quizzes and game config. */

const PARTS = {
  /* ======================== CHAPTER 1: SOAPBOX ======================== */
  s_plank: {
    name: 'Chassis Plank', role: 'The backbone everything hangs off',
    zone: { x: 510, y: 428, r: 30 }, requires: [],
    hint: 'The long board running the length of the cart.',
    body: `
      <p>A soapbox's chassis is one stiff plank. It has to carry the driver's weight between two axles without sagging, like a bridge.</p>
      <p>A plank is <b>stiff when the load pushes on its edge</b> and floppy when it pushes on its face. That's why floor joists stand on edge, and why car chassis rails are tall box sections.</p>
      <div class="callout moto"><b>In a car:</b> the job is the same, but the "plank" becomes a welded steel shell. Early cars used a <b>ladder frame</b>: two long rails joined by cross-members, which is literally a plank split in two.</div>`
  },
  s_rear_wheels: {
    name: 'Rear Axle & Wheels', role: 'Carry the weight and roll',
    zone: { x: 300, y: 455, r: 42 }, requires: ['s_plank'],
    hint: 'Under the back of the plank.',
    body: `
      <p>A solid steel axle runs across the cart with a wheel on each end, held in <b>bearings</b> so it spins freely.</p>
      <p>On a soapbox, gravity is the only engine. Every bit of friction you lose is speed you keep, so racers obsess over <b>bearings</b>, <b>tyre pressure</b>, and wheel alignment.</p>
      <h4>Rolling resistance</h4>
      <p>A tyre flattens where it meets the ground, and flexing rubber turns energy into heat. Harder, higher-pressure tyres flex less and roll further. Softer tyres grip better. Every vehicle balances these two.</p>
      <div class="callout moto"><b>In a car:</b> the rear axle becomes a pair of driveshafts with a <b>differential</b> in the middle (Chapter 8), because the two wheels need to turn at different speeds in a corner.</div>`
  },
  s_front_axle: {
    name: 'Front Axle & King Bolt', role: 'The simplest possible steering',
    zone: { x: 700, y: 404, r: 16 }, requires: ['s_plank'],
    hint: 'A single bolt through the front of the plank, holding a cross-beam.',
    body: `
      <p>The whole front axle swivels on one bolt in the middle, the <b>king bolt</b>. This is <b>centre-pivot steering</b>, the same as a farm cart or a child's wagon.</p>
      <h4>Why cars don't do this</h4>
      <ul>
        <li>As the axle swings, one wheel moves <b>back under the cart</b>. The supporting base shrinks and the cart tips over more easily.</li>
        <li>A bump on one wheel yanks the whole axle, and the steering wheel with it.</li>
        <li>It needs a lot of space to swing.</li>
      </ul>
      <p>The fix is to steer each wheel on its own pivot (a <b>kingpin</b> or <b>knuckle</b>) and link them together. That's what you'll test in the lab.</p>`
  },
  s_front_wheels: {
    name: 'Front Wheels', role: 'Steer, and point the way',
    zone: { x: 700, y: 472, r: 34 }, requires: ['s_front_axle'],
    hint: 'They go on the ends of the front axle.',
    body: `
      <p>The front wheels set the direction. Each one rolls happily forward but strongly resists being dragged sideways. That sideways grip is what pushes the cart around a corner.</p>
      <p>When a tyre is steered, its contact patch twists slightly behind the direction it's pointing. This is the <b>slip angle</b>, and it's how every tyre generates cornering force.</p>
      <div class="callout"><b>Wheel size:</b> big wheels roll over cracks and stones more easily and spin slower for the same speed (less bearing drag). That's why soapbox racers love large, thin wheels.</div>`
  },
  s_seat: {
    name: 'Seat', role: 'Puts the driver\'s weight in the right place',
    zone: { x: 330, y: 375, r: 26 }, requires: ['s_plank'],
    hint: 'Towards the back of the plank, with a backrest.',
    body: `
      <p>The driver is the heaviest part of a soapbox, so where they sit decides how the cart behaves.</p>
      <ul>
        <li><b>Low</b> lowers the centre of gravity, so the cart is harder to tip over in corners.</li>
        <li><b>Further back</b> puts more weight on the rear wheels, which makes it more stable at speed but less keen to turn.</li>
      </ul>
      <div class="callout moto"><b>In a car:</b> engineers spend fortunes on <b>weight distribution</b>. A sports car aims for about 50:50 front to rear, with the heavy engine pushed back behind the front axle and the driver sitting low in the middle.</div>`
  },
  s_steering: {
    name: 'Steering Wheel & Column', role: 'Lets the driver turn the axle',
    zone: { x: 566, y: 360, r: 24 }, requires: ['s_front_axle'],
    hint: 'A column from the front axle up to the driver\'s hands.',
    body: `
      <p>Turning the wheel winds a rope (or cable) around the bottom of the column, which pulls one end of the front axle forward and the other back.</p>
      <p>A big steering wheel and a thin drum at the bottom give <b>mechanical advantage</b>: a light push on the rim turns into a strong pull on the axle. The cost is that you have to turn the wheel further.</p>
      <div class="callout moto"><b>In a car:</b> the column ends in a <b>rack and pinion</b>: a small gear (pinion) moves a toothed bar (rack) sideways, pushing the wheels left and right. About 2.5 turns takes you from full left to full right.</div>`
  },
  s_brake: {
    name: 'Friction Brake', role: 'A lever that drags on the tyre',
    zone: { x: 458, y: 360, r: 18 }, requires: ['s_rear_wheels'],
    hint: 'A hand lever beside the seat, linked to a pad that presses on a rear tyre.',
    body: `
      <p>Pull the lever and a pad rubs on the rear tyre. Friction turns the cart's movement energy into heat, which is all any brake does.</p>
      <p>The lever multiplies your pull: a long handle and a short distance to the pivot means a small force at your hand becomes a big force on the pad.</p>
      <div class="callout"><b>The problem:</b> push too hard and the wheel <b>locks</b>. A sliding tyre grips less than a rolling one, and you can't steer with a locked wheel. Cars solve this with ABS (Chapter 3).</div>`
  },

  /* ======================== CHAPTER 2: CHASSIS ======================== */
  c_shell: {
    name: 'Monocoque Body Shell', role: 'The car\'s skeleton, made of its own skin',
    zone: { x: 450, y: 400, r: 32 }, requires: [],
    hint: 'The steel structure: floor, sills, bulkheads and windscreen frame.',
    body: `
      <p>Almost every modern car is a <b>monocoque</b> (or unibody): there's no separate frame. The floor, sills, bulkheads, and pillars are pressed steel panels spot-welded into one stiff box. A typical shell has about 4,000 spot welds.</p>
      <ul>
        <li><b>Sills</b>: the tall box sections under the doors, the main "planks" of the car.</li>
        <li><b>Bulkhead</b> (firewall): separates the engine bay from the cabin.</li>
        <li><b>Strut towers</b>: strong mounting points for the top of the suspension.</li>
      </ul>
      <h4>Stiff middle, soft ends</h4>
      <p>The cabin is a rigid <b>safety cell</b>. The front and rear are <b>crumple zones</b>, designed to fold up in a crash and absorb energy, so the people inside slow down more gently.</p>
      <div class="callout moto"><b>Roadsters</b> have no roof to stiffen the box, so they need extra-strong sills and a central tunnel to stop the body twisting.</div>`
  },
  c_front_susp: {
    name: 'Front Suspension (Double Wishbone)', role: 'Lets the front wheel move up and down while staying upright',
    zone: { x: 771, y: 395, r: 22 }, requires: ['c_shell'],
    hint: 'Two triangular arms and a coil-over above the front wheel.',
    body: `
      <p>Two A-shaped arms, an upper and a lower <b>wishbone</b>, hold the wheel's <b>upright</b> (knuckle). As the wheel rises, the arms swing on rubber bushes and keep the tyre close to upright, so the contact patch stays flat on the road.</p>
      <p>The upright also pivots for steering. The line through its two ball joints is the <b>steering axis</b>.</p>
      <p>The <b>coil-over</b> combines the spring (red) and the damper (gold). The spring holds the car up; the damper controls how fast it moves. About 150&nbsp;mm of travel.</p>
      <div class="callout"><b>Unsprung mass:</b> wheel, tyre, brakes, and upright move with the road; everything above the spring doesn't. The lighter the unsprung parts, the better the tyre can follow bumps.</div>
      <div class="callout moto"><b>Cheaper cars</b> use a <b>MacPherson strut</b>: the damper itself is the upper locating arm, which saves space and cost.</div>`
  },
  c_rear_susp: {
    name: 'Rear Suspension (Multi-link)', role: 'Locates the driven rear wheels',
    zone: { x: 240, y: 395, r: 22 }, requires: ['c_shell'],
    hint: 'Links and a coil-over above the rear wheel.',
    body: `
      <p>Several links (here, wishbones and a trailing link) hold the rear upright. Each one controls a different direction of movement, so engineers can tune exactly how the wheel moves under acceleration, braking, and cornering.</p>
      <p>The rear wheels drive this car, so the links also have to stop the axle twisting (<b>wind-up</b>) when the engine pushes hard.</p>
      <div class="callout"><b>Toe and camber:</b> look down at the car from above. If the wheels point slightly inward that's <b>toe-in</b>, which helps stability. If the tops of the wheels lean inward that's <b>negative camber</b>, which helps cornering grip. Tiny angles, big effects.</div>`
  },
  c_rear_wheel: {
    name: 'Rear Wheel & Tyre', role: 'Puts the power down',
    zone: { x: 240, y: 462, r: 28 }, requires: ['c_rear_susp'],
    hint: 'Bolts to the rear hub.',
    body: `
      <p>A cast <b>alloy wheel</b> (lighter than steel, so less unsprung mass) with a <b>radial tyre</b>.</p>
      <p>Read the sidewall: <b>205/45 R16</b> means 205&nbsp;mm wide, sidewall height 45% of the width, Radial construction, for a 16-inch rim.</p>
      <p>The contact patch, the bit actually touching the road, is only about the size of your hand. All the acceleration, braking, and cornering forces go through four of them.</p>
      <div class="callout tip"><b>Tread depth:</b> the grooves pump water out from under the tyre. Below about 3&nbsp;mm, wet grip drops sharply. The legal minimum in many countries is 1.6&nbsp;mm.</div>`
  },
  c_front_wheel: {
    name: 'Front Wheel & Tyre', role: 'Steering and most of the braking',
    zone: { x: 771, y: 462, r: 28 }, requires: ['c_front_susp'],
    hint: 'Bolts to the front hub.',
    body: `
      <p>Same wheel, but the front tyres do extra jobs: they steer, and under braking the car's weight pitches forward onto them, so they do most of the stopping.</p>
      <p>Tyres are rated with a load index and speed letter, such as <b>87V</b>: up to 545&nbsp;kg each and 240&nbsp;km/h.</p>
      <div class="callout"><b>Understeer vs oversteer:</b> if the front tyres run out of grip first, the car runs wide (understeer). If the rears go first, the tail swings out (oversteer). Weight distribution, tyres, and suspension settings decide which.</div>`
  },
  c_arb: {
    name: 'Anti-roll Bars', role: 'Stop the body leaning in corners',
    zone: { x: 705, y: 470, r: 13 }, requires: ['c_front_susp'],
    hint: 'A U-shaped bar linking the suspension near the front wheel.',
    body: `
      <p>A torsion bar runs across the car, linked to the suspension on both sides. When both wheels rise together (a speed bump) it just rotates and does nothing. When one side rises and the other falls (body roll in a corner) the bar <b>twists</b> and resists.</p>
      <p>So you get soft springs for comfort over bumps but a flat, stable body in corners.</p>
      <div class="callout"><b>Tuning trick:</b> a stiffer <i>front</i> bar makes a car understeer more; a stiffer <i>rear</i> bar makes it oversteer more. Racers adjust these to balance a car.</div>`
  },
  c_steering: {
    name: 'Rack & Pinion Steering', role: 'Turns the steering wheel into a sideways push',
    zone: { x: 610, y: 380, r: 20 }, requires: ['c_front_susp'],
    hint: 'A column from the steering wheel down through the bulkhead to the front axle line.',
    body: `
      <p>The steering column ends in a small gear, the <b>pinion</b>, meshing with a toothed bar, the <b>rack</b>, that runs across the car. Turn the wheel and the rack slides sideways; <b>tie rods</b> on each end push and pull the wheel uprights.</p>
      <p>The steering arms are angled so the inside wheel turns more than the outside wheel. That's the <b>Ackermann</b> geometry you met in the soapbox lab.</p>
      <p>A <b>universal joint</b> lets the column bend around the engine. In a crash it collapses so the wheel doesn't spear the driver.</p>
      <div class="callout moto"><b>Power steering</b> adds an electric motor (or, in older cars, a hydraulic pump) that helps push the rack, especially when parking.</div>`
  },

  /* ======================== CHAPTER 3: BRAKES ========================= */
  c_booster: {
    name: 'Brake Servo & Master Cylinder', role: 'Turns your foot into hydraulic pressure, with help',
    zone: { x: 584, y: 364, r: 20 }, requires: [],
    hint: 'A round drum on the engine side of the bulkhead, with a cylinder poking forward.',
    body: `
      <p>The brake pedal pushes a rod into the <b>master cylinder</b>. Its piston pressurises brake fluid; the reservoir on top keeps it topped up.</p>
      <h4>The servo (brake booster)</h4>
      <p>The round drum is a <b>vacuum servo</b>. Engine intake vacuum sits on one side of a big diaphragm. Press the pedal and a valve lets air in behind it, and the pressure difference pushes on the master cylinder too. It roughly <b>triples</b> your foot force. Try switching it off in the lab.</p>
      <div class="callout"><b>Two circuits:</b> the master cylinder has two pistons feeding two separate circuits, usually diagonally (front-left with rear-right). If one leaks, the other still stops the car.</div>`
  },
  c_brake_lines: {
    name: 'Brake Lines', role: 'Carry the pressure to every wheel',
    zone: { x: 450, y: 467, r: 18 }, requires: ['c_booster'],
    hint: 'Thin metal pipes along the floor from the master cylinder to each wheel.',
    body: `
      <p>Rigid steel or copper-nickel pipes run along the floor, with flexible rubber hoses at each wheel so the suspension and steering can move.</p>
      <p>Fluid can't be squashed, and <b>pressure is the same everywhere</b> in the system (Pascal's law). So the 60–100&nbsp;bar you create at the pedal arrives at all four wheels at once.</p>
      <div class="callout tip"><b>Brake fluid absorbs water</b> from the air. Water boils at a lower temperature, and steam bubbles <i>can</i> be squashed, so the pedal goes soft after hard use. Change the fluid every two years.</div>`
  },
  c_front_brakes: {
    name: 'Front Disc Brakes', role: 'Do most of the stopping',
    zone: { x: 771, y: 451, r: 26 }, requires: ['c_brake_lines'],
    hint: 'A disc on the front hub, with a caliper over it.',
    body: `
      <p>A cast-iron <b>disc</b> (rotor) spins with the wheel. The <b>caliper</b> straddles it; fluid pressure pushes a piston that squeezes two pads onto the disc.</p>
      <p>This is a <b>floating caliper</b>: one big piston on the inside, and the caliper body slides on pins to pull the outer pad in too.</p>
      <h4>Why the fronts are bigger</h4>
      <p>Braking pitches the car's weight forward, so the front tyres can take about <b>70%</b> of the braking. Front discs are larger and often <b>vented</b> (two faces with cooling vanes between) to cope with the heat: a stop from 100&nbsp;km/h dumps about 450&nbsp;kJ into the brakes.</p>`
  },
  c_rear_brakes: {
    name: 'Rear Brakes & Handbrake', role: 'The rest of the stopping, plus parking',
    zone: { x: 240, y: 451, r: 26 }, requires: ['c_brake_lines'],
    hint: 'A smaller disc on the rear hub, and a cable running forward.',
    body: `
      <p>Smaller discs (some cars use <b>drum brakes</b> at the rear, where shoes push outward inside a drum). A valve limits rear pressure so the lightly-loaded rear wheels don't lock first, which would spin the car.</p>
      <p>The <b>handbrake</b> (parking brake) is a separate <b>mechanical</b> cable to the rear brakes, so it still works if the hydraulics fail.</p>
      <div class="callout tip"><b>Hill starts:</b> the handbrake holds the car while you bring the clutch up to its biting point. You'll need that skill in the drive.</div>`
  },
  c_abs: {
    name: 'ABS Unit', role: 'Stops the wheels locking',
    zone: { x: 879, y: 435, r: 16 }, requires: ['c_brake_lines'],
    hint: 'A block of valves in the engine bay, plumbed into the brake lines.',
    body: `
      <p>A tyre grips best when it's turning slightly slower than the road speed, about <b>10–20% slip</b>. Lock the wheel (100% slip) and grip drops, and a skidding front tyre can't steer at all.</p>
      <p>Each wheel has a <b>speed sensor</b>. If one wheel is slowing much faster than the car, the ABS computer opens valves to drop pressure to that brake for an instant, then re-applies it, up to <b>15 times a second</b>. That's the buzzing you feel through the pedal.</p>
      <p>The result: the shortest stop the tyres can give, and you can still steer. The same unit also runs <b>traction control</b> and <b>stability control</b>.</p>`
  },

  /* ======================== CHAPTER 4: ENGINE ========================= */
  c_block: {
    name: 'Engine Block & Crankshaft', role: 'The foundation of the engine',
    zone: { x: 695, y: 447, r: 15 }, requires: [],
    hint: 'The big block sitting in the engine bay behind the front axle.',
    body: `
      <p>A cast aluminium or iron block with four <b>bores</b> (cylinders) in a row. This is an <b>inline-four</b>, the most common car engine. It sits <b>longitudinally</b> (along the car) here because the rear wheels are driven.</p>
      <p>The <b>crankshaft</b> runs along the bottom in five main bearings. Its four crankpins are arranged so pistons 1 and 4 move together, and 2 and 3 move together, 180° apart.</p>
      <p>A 2.0-litre four has four cylinders of 500&nbsp;cc each.</p>
      <div class="callout moto"><b>Front-wheel-drive cars</b> turn the engine <b>transversely</b> (across the car), with the gearbox and differential combined into one <b>transaxle</b> beside it.</div>`
  },
  c_pistons: {
    name: 'Pistons & Connecting Rods', role: 'Four of them, taking turns',
    zone: { x: 695, y: 412, r: 15 }, requires: ['c_block'],
    hint: 'They slide in the four cylinder bores of the block.',
    body: `
      <p>Each piston is sealed by rings and joined to the crank by a <b>connecting rod</b>. Look closely: pistons 1 and 4 are at the top while 2 and 3 are at the bottom.</p>
      <h4>Why four cylinders?</h4>
      <p>A single cylinder fires once every two turns of the crank, a jerky series of bangs. With four cylinders firing in turn, there's a power stroke <b>every half turn</b>, so delivery is much smoother. The firing order is usually <b>1–3–4–2</b>, which spreads the load along the crankshaft.</p>
      <p>Smaller pistons are also lighter, so the engine can rev higher than one giant cylinder of the same total size.</p>`
  },
  c_head: {
    name: 'Cylinder Head (DOHC, 16 valves)', role: 'Lets the engine breathe',
    zone: { x: 695, y: 370, r: 15 }, requires: ['c_pistons'],
    hint: 'Bolts on top of the block, under a black cam cover.',
    body: `
      <p>The head caps all four cylinders. Each cylinder has <b>four valves</b>, two intake and two exhaust, so 16 in total. More, smaller valves flow more air than two big ones.</p>
      <p>Two <b>camshafts</b> (DOHC: double overhead cam) sit on top, one for intake and one for exhaust. Each lobe opens one valve once per four-stroke cycle.</p>
      <p>A <b>head gasket</b> seals the head to the block. When it fails, coolant and oil can mix or leak into the cylinders.</p>
      <div class="callout"><b>Variable valve timing</b> lets the engine rotate its cams slightly while running. It opens valves earlier at high rpm for power and later at low rpm for smoothness and economy.</div>`
  },
  c_timing: {
    name: 'Timing Belt / Chain', role: 'Keeps the valves in step with the pistons',
    zone: { x: 771, y: 405, r: 13 }, requires: ['c_head'],
    hint: 'At the front of the engine, linking the crankshaft to the camshafts.',
    body: `
      <p>A toothed rubber <b>belt</b> or a steel <b>chain</b> drives the camshafts from the crankshaft at exactly <b>half speed</b>, because each valve opens once every two crank revolutions.</p>
      <p>It must never slip a tooth. In an <b>interference engine</b>, the valves and pistons share the same space at different times. If the belt snaps, the pistons hit open valves and wreck the engine.</p>
      <div class="callout tip"><b>Service item:</b> rubber belts are replaced on schedule, typically every 100,000&nbsp;km or so. Chains usually last the life of the engine.</div>`
  },
  c_sump: {
    name: 'Sump, Oil Pump & Filter', role: 'Keeps every bearing floating on oil',
    zone: { x: 695, y: 485, r: 12 }, requires: ['c_block'],
    hint: 'The pan under the block, plus the blue filter on its side.',
    body: `
      <p>The <b>sump</b> (oil pan) holds about 4 litres of oil. A pump driven by the crank pushes it through the <b>filter</b> and into galleries drilled through the block to the crank and cam bearings, at 2–5&nbsp;bar.</p>
      <p>The spinning parts ride on a film of oil thinner than a hair. Metal never actually touches metal.</p>
      <p>The oil also cools the pistons, carries away dirt, and stops corrosion. The <b>oil pressure warning light</b> on the dashboard is the most urgent light in the car: stop at once.</p>
      <div class="callout tip"><b>Check it:</b> pull the dipstick with the engine cold and the car level. The level should sit between the min and max marks.</div>`
  },

  /* ======================== CHAPTER 5: FUEL & AIR ===================== */
  c_tank: {
    name: 'Fuel Tank', role: 'Carries about 45 litres of energy',
    zone: { x: 308, y: 410, r: 24 }, requires: [],
    hint: 'Behind the seats, above the rear axle.',
    body: `
      <p>Moulded plastic or steel, mounted in the safest place in a crash, usually ahead of or above the rear axle. The filler neck has a one-way valve, and the tank is vented through a <b>charcoal canister</b> that traps petrol vapour instead of letting it into the air.</p>
      <p>45 litres of petrol holds about 1,450&nbsp;MJ of energy, the same as about 400&nbsp;kWh. A typical engine turns only 25–35% of that into motion.</p>`
  },
  c_fuel_pump: {
    name: 'Fuel Pump & Line', role: 'Pushes fuel forward to the engine',
    zone: { x: 440, y: 468, r: 16 }, requires: ['c_tank'],
    hint: 'An electric pump inside the tank, with a line along the floor to the engine bay.',
    body: `
      <p>Fuel injection needs fuel under pressure, so an <b>electric pump</b> sits inside the tank (the fuel around it keeps it cool and quiet). It pushes fuel along the floor to the engine at about <b>3–4&nbsp;bar</b>, or over 200&nbsp;bar for direct-injection engines.</p>
      <p>When you turn the key you may hear it hum for a second as it primes the system.</p>
      <div class="callout tip"><b>Running on empty</b> is bad for the pump: it relies on surrounding fuel for cooling.</div>`
  },
  c_intake: {
    name: 'Air Intake & Throttle Body', role: 'Measures and controls the air',
    zone: { x: 839, y: 380, r: 22 }, requires: [],
    hint: 'The air filter box at the front of the engine bay, with a pipe to the engine.',
    body: `
      <p>Air enters through the <b>filter box</b>, past the <b>MAF sensor</b> (mass air flow: a heated wire that cools as air passes, telling the ECU exactly how many grams of air per second are going in). Then it goes through the <b>throttle body</b> and into the <b>intake manifold</b>, whose four runners lead to the four cylinders.</p>
      <p>Your accelerator pedal doesn't touch the fuel; it opens the throttle butterfly and lets in <b>air</b>. The computer then adds matching fuel. Modern throttles are <b>drive-by-wire</b>: the pedal is a sensor, and a motor opens the throttle.</p>`
  },
  c_injectors: {
    name: 'Fuel Rail & Injectors', role: 'Spray exactly the right amount of fuel',
    zone: { x: 695, y: 390, r: 14 }, requires: ['c_intake'],
    hint: 'A rail feeding four nozzles into the intake runners.',
    body: `
      <p>The <b>fuel rail</b> holds fuel at pressure. Each <b>injector</b> is an electrically operated valve. The ECU opens it for a few milliseconds per cycle, the <b>pulse width</b>, and that time sets how much fuel goes in.</p>
      <p>The fuel leaves as a fine mist so it mixes and evaporates quickly. At idle an injector might open for 2&nbsp;ms; at full power, 15&nbsp;ms or more.</p>
      <div class="callout moto"><b>Direct injection</b> squirts fuel straight into the cylinder at very high pressure, for better economy and power.</div>`
  },
  c_ecu: {
    name: 'ECU & Sensors', role: 'The engine\'s brain',
    zone: { x: 529, y: 414, r: 14 }, requires: [],
    hint: 'A small box behind the dashboard, wired to the engine.',
    body: `
      <p>The <b>engine control unit</b> reads dozens of sensors hundreds of times a second: air mass (MAF), throttle position, crank and cam position, coolant temperature, and the <b>oxygen (lambda) sensor</b> in the exhaust.</p>
      <p>From these it calculates injector pulse width and spark timing for every single combustion event.</p>
      <h4>Closed loop</h4>
      <p>The O₂ sensor tells the ECU whether the last burn had spare oxygen (lean) or none (rich). The ECU constantly trims the fuel to hover at exactly <b>14.7:1</b>, which the catalytic converter needs (Chapter 7).</p>
      <div class="callout tip">The <b>check-engine light</b> means the ECU has stored a fault code. A cheap OBD-II reader plugged under the dash will tell you what it is.</div>`
  },

  /* ======================== CHAPTER 6: ELECTRICS ====================== */
  c_battery: {
    name: 'Battery', role: 'Stored energy for starting',
    zone: { x: 135, y: 420, r: 20 }, requires: [],
    hint: 'This roadster keeps it in the boot, behind the rear axle.',
    body: `
      <p>A 12-volt lead-acid battery: six cells of about 2.1&nbsp;V each. It's sized by how much current it can deliver for starting (e.g. 400&nbsp;A cold-cranking amps) and how much charge it holds (e.g. 45&nbsp;Ah).</p>
      <p>Many sports cars mount it in the <b>boot</b> to move weight rearward for better balance.</p>
      <div class="callout tip"><b>Jump-starting:</b> connect red to red (+), then black to a bare metal point on the dead car, away from the battery. Batteries can give off hydrogen gas.</div>`
  },
  c_alternator: {
    name: 'Alternator & Belt', role: 'Makes electricity while the engine runs',
    zone: { x: 792, y: 418, r: 14 }, requires: [],
    hint: 'A finned cylinder on the front of the engine, driven by a belt from the crankshaft.',
    body: `
      <p>A belt from the crank pulley spins the alternator at 2–3× engine speed. Inside, a spinning electromagnet (the <b>rotor</b>) moves past fixed copper windings (the <b>stator</b>) and induces alternating current. Diodes convert it to DC, and a regulator holds it at about <b>14.2&nbsp;V</b>, just above the battery's voltage so it charges.</p>
      <p>It powers everything once the engine runs: ignition, injectors, lights, fans, the stereo.</p>
      <div class="callout tip">A <b>battery warning light</b> while driving usually means the alternator has stopped charging, often a snapped belt. You're now running on the battery alone.</div>`
  },
  c_starter: {
    name: 'Starter Motor', role: 'Spins the engine to life',
    zone: { x: 600, y: 453, r: 14 }, requires: ['c_battery'],
    hint: 'A small motor bolted to the bellhousing, low down behind the engine.',
    body: `
      <p>Turn the key and a <b>solenoid</b> shoots a small pinion gear forward to mesh with the teeth on the flywheel's rim, and closes a heavy switch. The motor draws 100–200&nbsp;A and spins the engine at about 200&nbsp;rpm, enough for the first combustion events.</p>
      <p>Once the engine fires, the pinion is thrown back out of mesh.</p>
      <div class="callout"><b>Interlock:</b> manual cars won't crank unless the <b>clutch pedal</b> is pressed (automatics need Park or Neutral), so the car can't lurch forward. You'll need this in the drive.</div>`
  },
  c_coils: {
    name: 'Coil Packs & Spark Plugs', role: 'Four sparks, perfectly timed',
    zone: { x: 695, y: 344, r: 14 }, requires: [],
    hint: 'Four units pushed into the top of the cylinder head.',
    body: `
      <p>Modern engines have <b>coil-on-plug</b> ignition: one small coil sits directly on each spark plug. A coil is a transformer. The ECU switches about 8&nbsp;A through its primary winding, then cuts it, and the collapsing magnetic field induces <b>25,000–40,000&nbsp;V</b> in the secondary winding.</p>
      <p>That jumps the plug's 1&nbsp;mm gap and lights the mixture. Each coil fires once every two crank turns, in firing order 1–3–4–2.</p>
      <div class="callout">Spark timing is advanced (fired earlier) as rpm rises, because the flame takes a fixed time to burn. You'll find the sweet spot in the lab.</div>`
  },
  c_fusebox: {
    name: 'Fuse Box & Wiring Loom', role: 'The car\'s nervous system',
    zone: { x: 519, y: 380, r: 13 }, requires: ['c_battery'],
    hint: 'A box under the dashboard, with the main harness running front to back.',
    body: `
      <p>The <b>loom</b> (wiring harness) carries power and signals all over the car, over a kilometre of wire in a modern car. The car's metal body is the return path (<b>earth</b> or ground), which halves the wiring needed.</p>
      <p><b>Fuses</b> protect each circuit. If a wire shorts, the fuse's thin strip melts before the wire overheats and starts a fire. <b>Relays</b> let a small switch current control a big load like the headlights or the fuel pump.</p>
      <div class="callout moto">Modern cars run a <b>CAN bus</b>: modules talk to each other digitally over a shared pair of wires instead of each having its own.</div>`
  },

  /* ==================== CHAPTER 7: COOLING & EXHAUST ================== */
  c_radiator: {
    name: 'Radiator & Fan', role: 'Dumps the engine\'s waste heat into the air',
    zone: { x: 925, y: 420, r: 20 }, requires: [],
    hint: 'Right at the front of the car, behind the grille.',
    body: `
      <p>Hot coolant flows through thin tubes; air flowing through the fins between them carries the heat away. At speed, the wind does the work. In traffic, an <b>electric fan</b> switches on to pull air through.</p>
      <p>The <b>pressure cap</b> (about 1.1&nbsp;bar) raises the boiling point of the water–glycol coolant from 100&nbsp;°C to about 125&nbsp;°C.</p>
      <div class="callout tip"><b>Never open a hot radiator cap.</b> Release the pressure and the coolant boils instantly into scalding steam.</div>`
  },
  c_hoses: {
    name: 'Water Pump, Thermostat & Hoses', role: 'Keep the coolant moving at the right temperature',
    zone: { x: 800, y: 394, r: 14 }, requires: ['c_radiator'],
    hint: 'The pump on the front of the engine, and the hoses to the radiator.',
    body: `
      <p>A belt-driven <b>water pump</b> circulates coolant through passages around the cylinders and head, then out through the top hose to the radiator and back via the bottom hose.</p>
      <p>The <b>thermostat</b> is a wax-filled valve. When the engine is cold it stays shut, so the coolant just circulates in the engine and it warms up fast (cold engines wear faster and pollute more). At about <b>88&nbsp;°C</b> the wax melts and expands, opening the valve to the radiator.</p>
      <div class="callout">A stuck-open thermostat means a heater that never gets hot. A stuck-shut one means rapid overheating.</div>`
  },
  c_manifold: {
    name: 'Exhaust Manifold', role: 'Collects the four exhaust pulses',
    zone: { x: 640, y: 440, r: 16 }, requires: [],
    hint: 'Four pipes from the side of the head, merging into one below the engine.',
    body: `
      <p>Four pipes, one per cylinder, merge into one. The gas leaving the head is at <b>700–900&nbsp;°C</b>.</p>
      <p>Pulses from the cylinders arrive one after another in the firing order. A well-designed <b>4-into-1</b> header times them so each pulse helps suck the next cylinder clean (<b>scavenging</b>).</p>`
  },
  c_catalyst: {
    name: 'Catalytic Converter', role: 'Chemically cleans the exhaust',
    zone: { x: 548, y: 490, r: 16 }, requires: ['c_manifold'],
    hint: 'A fat canister in the exhaust pipe under the floor.',
    body: `
      <p>Inside is a ceramic honeycomb with thousands of tiny channels, coated with <b>platinum, palladium, and rhodium</b>. As exhaust flows over this coating, three reactions happen:</p>
      <ul>
        <li>Carbon monoxide (CO) → carbon dioxide (CO₂)</li>
        <li>Unburnt fuel (HC) → CO₂ and water</li>
        <li>Nitrogen oxides (NOₓ) → nitrogen (N₂)</li>
      </ul>
      <p>That's why it's called a <b>three-way</b> catalyst. It removes over 90% of these pollutants, but only if the mixture stays right at 14.7:1, and only once it's hot (above about 250&nbsp;°C).</p>`
  },
  c_muffler: {
    name: 'Exhaust Pipe & Silencer', role: 'Takes the noise out',
    zone: { x: 138, y: 489, r: 18 }, requires: ['c_catalyst'],
    hint: 'The pipe running back under the car to a box at the rear.',
    body: `
      <p>Each exhaust valve opening sends a pressure pulse down the pipe, and together they make a loud, low drone. The <b>silencer</b> (muffler) uses chambers, baffles, and perforated tubes to make sound waves bounce and cancel, plus packing to absorb them.</p>
      <p>Good silencer design kills noise without adding much <b>back-pressure</b>, which would make the engine work harder to push gas out.</p>`
  },

  /* ======================== CHAPTER 8: DRIVETRAIN ===================== */
  c_clutch: {
    name: 'Flywheel & Clutch', role: 'Connects and disconnects the engine',
    zone: { x: 613, y: 434, r: 16 }, requires: [],
    hint: 'Inside the bellhousing, between the engine and the gearbox.',
    body: `
      <p>The heavy <b>flywheel</b> bolts to the end of the crankshaft. It smooths the power pulses and gives the starter teeth to grip.</p>
      <p>A single <b>friction disc</b> sits between the flywheel and the <b>pressure plate</b>. A strong <b>diaphragm spring</b> clamps them together, so the engine and gearbox turn as one.</p>
      <p>Press the clutch pedal and a <b>release bearing</b> pushes the middle of the diaphragm spring, lifting the pressure plate off the disc. Now the engine spins freely.</p>
      <h4>The biting point</h4>
      <p>Partway up, the disc <b>slips</b>, passing some torque while the speeds match up. This is how you pull away. Slip too long and the disc overheats and wears (you can smell it).</p>
      <div class="callout moto"><b>Compared with a motorbike:</b> a car clutch is <b>dry</b> and has a single big plate; a bike clutch is <b>wet</b> with a stack of small plates.</div>`
  },
  c_gearbox: {
    name: 'Six-speed Gearbox', role: 'Keeps the engine in its power band',
    zone: { x: 560, y: 433, r: 18 }, requires: ['c_clutch'],
    hint: 'Bolted behind the bellhousing, under the gear lever.',
    body: `
      <p>Like a bike gearbox, every gear pair is <b>always meshed</b>. Selecting a gear slides a collar that locks one pair to its shaft.</p>
      <p>The difference: a car gearbox has <b>synchromesh</b> cones. As you move the lever, a brass cone rubs on the gear first, matching its speed to the shaft so the teeth slide in without a crunch.</p>
      <p>The lever moves in an <b>H-pattern</b>, so you can pick any gear directly (5th straight to 3rd), unlike a bike's sequential box. 4th or 5th is often <b>1:1</b> (direct drive), and 6th an <b>overdrive</b> (the output spins faster than the engine) for quiet, economical motorway cruising.</p>
      <div class="callout moto"><b>Automatics</b> replace the clutch with a fluid <b>torque converter</b> and shift with hydraulic clutches inside planetary gearsets.</div>`
  },
  c_propshaft: {
    name: 'Propeller Shaft', role: 'Carries the power down the car',
    zone: { x: 385, y: 440, r: 18 }, requires: ['c_gearbox'],
    hint: 'A long tube from the back of the gearbox to the rear axle.',
    body: `
      <p>A hollow tube running down the centre tunnel from the gearbox to the differential, spinning at engine speed or faster in top gear.</p>
      <p><b>Universal joints</b> at each end let it bend slightly as the gearbox and axle move relative to each other. It must be precisely <b>balanced</b>: an out-of-balance shaft at 5,000&nbsp;rpm shakes the whole car.</p>
      <div class="callout moto"><b>Front-wheel-drive</b> cars don't have one; the engine and gearbox sit right next to the driven wheels.</div>`
  },
  c_diff: {
    name: 'Differential', role: 'Lets the rear wheels turn at different speeds',
    zone: { x: 240, y: 451, r: 22 }, requires: ['c_propshaft'],
    hint: 'A round housing between the rear wheels, where the propshaft ends.',
    body: `
      <p>Two jobs in one box:</p>
      <ol>
        <li><b>Final drive:</b> a small <b>pinion</b> on the propshaft drives a large <b>ring gear</b>, a reduction of about 4.1:1, and turns the drive 90° towards the wheels.</li>
        <li><b>Differential:</b> in a corner the outside wheel travels further than the inside one. A set of little bevel gears inside the ring gear lets the two shafts turn at different speeds while sharing the torque equally.</li>
      </ol>
      <p>The catch: an "open" differential sends equal torque to both wheels, so if one wheel is on ice, the other gets almost nothing too. A <b>limited-slip differential</b> (LSD) uses clutches or gears to fix that.</p>`
  },
  c_halfshafts: {
    name: 'Driveshafts & CV Joints', role: 'The last link to the wheels',
    zone: { x: 208, y: 470, r: 12 }, requires: ['c_diff'],
    hint: 'Short shafts from the diff out to each rear hub, with rubber boots.',
    body: `
      <p>Short shafts run from each side of the differential to the wheel hubs. Because the wheels move up and down with the suspension, each end has a <b>constant-velocity (CV) joint</b>: a cage of balls in curved grooves that transmits power smoothly at any angle.</p>
      <p>A plain universal joint makes the output speed wobble twice per turn when it works at an angle. A CV joint doesn't, hence the name.</p>
      <div class="callout tip">A split rubber <b>CV boot</b> lets grit in and grease out. A clicking noise on full lock in a front-drive car is the classic sign of a worn CV joint.</div>`
  },

  /* ==================== CHAPTER 9: CONTROLS & BODY ==================== */
  c_pedals: {
    name: 'Pedal Box', role: 'Clutch, brake, accelerator: left to right',
    zone: { x: 546, y: 446, r: 12 }, requires: [],
    hint: 'In the driver\'s footwell, just behind the bulkhead.',
    body: `
      <p>Three pedals, always in the same order:</p>
      <ul>
        <li><b>Clutch</b> (left foot): disconnects the engine.</li>
        <li><b>Brake</b> (right foot): pushes the master cylinder through the servo.</li>
        <li><b>Accelerator</b> (right foot): opens the throttle.</li>
      </ul>
      <p>Your right foot moves between brake and accelerator, so you can never press both by accident. Racing drivers use <b>heel-and-toe</b>: braking with the ball of the foot while blipping the throttle with the heel, to match revs on a downshift.</p>`
  },
  c_gearlever: {
    name: 'Gear Lever', role: 'Your hand on the shift forks',
    zone: { x: 513, y: 370, r: 12 }, requires: [],
    hint: 'Pokes up through the centre tunnel beside the seat.',
    body: `
      <p>The lever pivots in a ball joint on top of the gearbox. Moving it left-right picks a <b>gate</b> (1–2, 3–4, 5–6); moving it forward-back slides that gate's shift fork to engage a gear.</p>
      <p>Reverse is usually behind a spring or lift-collar so you can't select it by accident at speed.</p>
      <div class="callout tip">Always press the clutch fully before moving the lever. The synchros are good, but they're not designed to fight engine power.</div>`
  },
  c_dash: {
    name: 'Dashboard & Instruments', role: 'Tells the driver what the car is doing',
    zone: { x: 535, y: 338, r: 12 }, requires: [],
    hint: 'Under the base of the windscreen, in front of the steering wheel.',
    body: `
      <p>The two big dials: the <b>speedometer</b> and the <b>tachometer</b> (rev counter), which shows engine rpm so you can shift in the power band and stay off the red line.</p>
      <p>Warning lights in order of urgency:</p>
      <ul>
        <li><b>Red</b> oil pressure, coolant temperature, or brake warning: stop as soon as it's safe.</li>
        <li><b>Amber</b> check-engine, ABS, or tyre pressure: get it looked at soon.</li>
      </ul>`
  },
  c_seats: {
    name: 'Seats & Seat Belts', role: 'Hold the driver in place, especially in a crash',
    zone: { x: 440, y: 440, r: 22 }, requires: [],
    hint: 'Low in the cabin, between the bulkheads.',
    body: `
      <p>Sports-car seats sit low to keep the centre of gravity down, with side bolsters to hold you in corners.</p>
      <p>The <b>seat belt</b> is the most important safety device in the car. In a 50&nbsp;km/h crash your body tries to keep going at 50&nbsp;km/h. The belt spreads the stopping force across your pelvis and ribcage, the strongest parts of you.</p>
      <p>A <b>pretensioner</b> fires a small charge to yank the belt tight in the first milliseconds, and a <b>load limiter</b> then lets it give a little so the force doesn't break ribs.</p>`
  },
  c_body: {
    name: 'Body Panels, Glass & Lights', role: 'Skin, visibility, and aerodynamics',
    zone: { x: 860, y: 350, r: 20 }, requires: [],
    hint: 'The painted outer skin. Start with the bonnet.',
    body: `
      <p>The outer panels (wings, doors, bonnet, boot lid) are mostly cosmetic and bolt or bond onto the structural shell. They're shaped for <b>aerodynamics</b>: at motorway speed, more than half the engine's effort goes into pushing air aside, and drag rises with the <b>square</b> of speed.</p>
      <p>The <b>windscreen</b> is laminated glass (a plastic layer between two sheets) so it cracks but doesn't shatter, and it's glued in as part of the structure.</p>
      <p>Lights: headlights, tail and brake lights, indicators. In this game we've drawn the paint see-through, like an x-ray, so you can still see everything you built.</p>
      <p><b>The car is complete!</b> Next: start it and drive it.</p>`
  }
};

const CHAPTERS = [
  {
    id: 'ch1', num: 1, title: 'The Soapbox', subtitle: 'Four wheels and gravity',
    scene: 'soapbox',
    parts: ['s_plank', 's_rear_wheels', 's_front_axle', 's_front_wheels', 's_seat', 's_steering', 's_brake'],
    lab: 'steering',
    brief: `
      <p class="lead">Every car is, at heart, a <b>soapbox cart with an engine</b>: a chassis, four wheels, a way to steer, a way to stop, and a seat. Gravity is the only engine for now.</p>
      <h4>How to play</h4>
      <ol>
        <li><b>Drag</b> each part from the parts bin onto the right dashed slot on the blueprint. On a touchscreen you can also tap a part, then tap the slot.</li>
        <li>Some parts mount <b>onto</b> others, so <b>build order</b> matters.</li>
        <li>Every part opens a <b>workshop card</b> explaining how it works. The quizzes are built from them.</li>
        <li>Stuck? Press <b>Hint</b>.</li>
        <li>After building, test your understanding in the <b>Lab</b>, then pass the <b>Quiz</b> to unlock the next chapter.</li>
      </ol>
      <p>By Chapter 10 you'll have built a front-engined, rear-wheel-drive sports car, and you'll drive it.</p>`,
    quiz: [
      { q: 'What goes wrong with centre-pivot (cart) steering at large angles?', options: ['The wheels swing in under the cart, shrinking its base so it tips more easily', 'The wheels spin faster', 'It makes the cart lighter', 'Nothing; cars use it too'], answer: 0, explain: 'The whole axle rotates, so the wheels move inward. Cars steer each wheel on its own pivot instead.' },
      { q: 'In a turn, why should the inside front wheel steer more sharply than the outside one?', options: ['It follows a tighter circle around the same centre point', 'It is smaller', 'To slow the car down', 'It shouldn\'t; both should be parallel'], answer: 0, explain: 'That\'s Ackermann geometry: all four wheels then roll around one shared turning centre, with no scrubbing.' },
      { q: 'Why do soapbox racers love hard, high-pressure tyres?', options: ['They flex less, so less energy is lost as heat (lower rolling resistance)', 'They grip more', 'They\'re lighter', 'They look faster'], answer: 0, explain: 'A tyre flexing at its contact patch wastes energy as heat. Less flex means more speed.' },
      { q: 'Why is locking a wheel under braking bad?', options: ['A sliding tyre grips less than a rolling one, and a locked front tyre can\'t steer', 'It wears the bearings', 'It\'s louder', 'It isn\'t bad'], answer: 0, explain: 'Peak grip happens just before the tyre locks. Once it slides, grip and steering both fall away.' }
    ]
  },
  {
    id: 'ch2', num: 2, title: 'Shell & Suspension', subtitle: 'The rolling chassis',
    scene: 'roadster',
    parts: ['c_shell', 'c_front_susp', 'c_rear_susp', 'c_front_wheel', 'c_rear_wheel', 'c_arb', 'c_steering'],
    lab: 'carchassis',
    brief: `
      <p class="lead">A soapbox weighs 30&nbsp;kg and tops out at 40&nbsp;km/h downhill. Our roadster weighs about <b>1,050&nbsp;kg</b>, does over <b>200&nbsp;km/h</b>, and has to be comfortable over potholes.</p>
      <h4>What changes</h4>
      <ul>
        <li><b>Chassis</b>: the plank becomes a welded steel <b>monocoque</b> with a safety cell and crumple zones.</li>
        <li><b>Suspension</b>: each wheel gets its own arms, spring, and damper (<b>independent suspension</b>), so a bump on one side doesn't upset the other.</li>
        <li><b>Steering</b>: the pivoting axle becomes <b>rack-and-pinion</b> with proper Ackermann geometry.</li>
      </ul>
      <p>We're starting a fresh blueprint. From here on, it's drawn as an <b>x-ray side view</b>: you'll see the parts inside.</p>`,
    quiz: [
      { q: 'What is a monocoque body?', options: ['A shell where the welded body panels themselves form the structure, with no separate frame', 'A body made of one piece of glass', 'A separate ladder frame', 'A soft-top roof'], answer: 0, explain: 'Floor, sills, bulkheads and pillars are welded into one stiff box.' },
      { q: 'What does an anti-roll bar do?', options: ['Resists body lean in corners without stiffening the ride over bumps that hit both wheels', 'Stops the car rolling backwards', 'Holds the wheel on', 'Makes the car lower'], answer: 0, explain: 'It only twists, and so only resists, when one side moves differently from the other.' },
      { q: 'Why keep unsprung mass low?', options: ['Lighter wheels and brakes can follow bumps faster, keeping the tyre on the road', 'It saves fuel only', 'It makes the car taller', 'It doesn\'t matter'], answer: 0, explain: 'The spring has to push the wheel back down after each bump. Less mass means it follows faster.' },
      { q: 'What does a car tyre marked 205/45 R16 tell you?', options: ['205 mm wide, sidewall 45% of width, radial, for a 16-inch rim', '205 km/h max, 45 psi, 16 years old', '205 kg load, 45 mm tread, size 16', 'Nothing useful'], answer: 0, explain: 'Width / aspect ratio, construction, and rim diameter.' }
    ]
  },
  {
    id: 'ch3', num: 3, title: 'Brakes', subtitle: 'Stopping a tonne',
    scene: 'roadster',
    parts: ['c_booster', 'c_brake_lines', 'c_front_brakes', 'c_rear_brakes', 'c_abs'],
    lab: 'carbrakes',
    brief: `
      <p class="lead">Stopping 1,100&nbsp;kg from 100&nbsp;km/h means getting rid of about <b>450,000 joules</b> in three seconds, enough to boil a litre of water from cold. A rope brake on a tyre won't do.</p>
      <p class="flow">Pedal → servo (boost) → master cylinder → brake lines → calipers → pads → discs → heat</p>
      <p>Then there's <b>ABS</b>, a computer that pumps the brakes faster than any human so the tyres stay right at their peak grip.</p>`,
    quiz: [
      { q: 'What does the brake servo (booster) do?', options: ['Uses engine vacuum to add force to your foot, roughly tripling it', 'Cools the brakes', 'Stores brake fluid', 'Locks the wheels when parked'], answer: 0, explain: 'A big diaphragm with vacuum on one side pushes on the master cylinder along with your foot.' },
      { q: 'Why are the front brakes bigger than the rears?', options: ['Braking shifts weight forward, so the front tyres can do about 70% of the stopping', 'The front wheels are bigger', 'For looks', 'The engine is in front'], answer: 0, explain: 'Weight transfer loads the front tyres, giving them more grip to use.' },
      { q: 'How does ABS help?', options: ['It releases and re-applies each brake rapidly so the tyre stays near peak grip without locking, and you can still steer', 'It makes the pedal harder', 'It adds more brake fluid', 'It turns off the engine'], answer: 0, explain: 'Peak grip is at about 10–20% slip. ABS keeps each wheel there.' },
      { q: 'Why does a car have two separate brake circuits?', options: ['If one leaks, the other can still stop the car', 'One for each foot', 'One for day, one for night', 'To double the pressure'], answer: 0, explain: 'A tandem master cylinder feeds two independent circuits, often diagonally split.' },
      { q: 'Why is the handbrake operated by a cable, not hydraulics?', options: ['So it still works even if the hydraulic system fails', 'Cables are lighter', 'It\'s cheaper to make', 'Hydraulics can\'t hold a car still'], answer: 0, explain: 'A mechanical backup that holds the car regardless of fluid pressure.' }
    ]
  },
  {
    id: 'ch4', num: 4, title: 'The Engine', subtitle: 'Four cylinders in a row',
    scene: 'roadster',
    parts: ['c_block', 'c_pistons', 'c_head', 'c_timing', 'c_sump'],
    lab: 'carengine',
    brief: `
      <p class="lead">Time for an engine: a <b>2.0-litre inline-four</b>, four-stroke, mounted lengthways behind the front axle.</p>
      <h4>The four strokes ("suck, squeeze, bang, blow")</h4>
      <ol>
        <li><b>Intake</b>: piston moves down, intake valves open, and fuel and air are drawn in.</li>
        <li><b>Compression</b>: valves shut and the piston rises, squeezing the mixture about 11:1.</li>
        <li><b>Power</b>: a spark ignites it, and the pressure drives the piston down.</li>
        <li><b>Exhaust</b>: exhaust valves open and the rising piston pushes out the burnt gas.</li>
      </ol>
      <p>One cylinder needs two full turns of the crank per cycle. With <b>four</b> cylinders taking turns, there's a power stroke every half turn.</p>`,
    quiz: [
      { q: 'In an inline-four, how often is there a power stroke?', options: ['Every half turn of the crankshaft', 'Every two turns', 'Every turn', 'Four times per turn'], answer: 0, explain: 'Four power strokes spread over 720° of rotation, so one every 180°.' },
      { q: 'What is the usual firing order of an inline-four?', options: ['1–3–4–2', '1–2–3–4', '4–3–2–1', 'All at once'], answer: 0, explain: '1–3–4–2 alternates between the ends and the middle of the crank to spread the load.' },
      { q: 'What drives the camshafts, and how fast?', options: ['A timing belt or chain from the crankshaft, at half crank speed', 'The alternator, at double speed', 'An electric motor', 'The flywheel, at the same speed'], answer: 0, explain: 'Each valve opens once per cycle, and a cycle takes two crank turns.' },
      { q: 'Why does a timing belt failure ruin an "interference" engine?', options: ['Pistons and open valves use the same space, so without timing they collide', 'The oil drains out', 'The car can\'t steer', 'It doesn\'t'], answer: 0, explain: 'The belt keeps them out of each other\'s way. Lose it and they hit.' },
      { q: 'What should you do if the red oil-pressure light comes on?', options: ['Stop the engine as soon as it\'s safe', 'Drive faster', 'Top up the coolant', 'Ignore it until the next service'], answer: 0, explain: 'Without oil pressure the bearings lose their oil film and destroy themselves within minutes.' }
    ]
  },
  {
    id: 'ch5', num: 5, title: 'Fuel & Air', subtitle: 'Injection and the ECU',
    scene: 'roadster',
    parts: ['c_tank', 'c_fuel_pump', 'c_intake', 'c_injectors', 'c_ecu'],
    lab: 'efi',
    brief: `
      <p class="lead">An engine burns about <b>14.7&nbsp;kg of air for every 1&nbsp;kg of petrol</b>. Get that ratio wrong and you lose power, waste fuel, or poison the catalytic converter.</p>
      <p class="flow">Air: filter → MAF sensor → throttle → manifold → valves<br>Fuel: tank → pump → rail → injectors</p>
      <p>A computer, the <b>ECU</b>, weighs the incoming air, calculates exactly how long to hold each injector open, then checks the result with an oxygen sensor in the exhaust and corrects itself. Hundreds of times a second.</p>`,
    quiz: [
      { q: 'What does the accelerator pedal actually control?', options: ['How much air enters the engine; the ECU adds matching fuel', 'Only the fuel injectors', 'The spark timing', 'The gear ratio'], answer: 0, explain: 'It opens the throttle. The ECU measures the air and meters fuel to match.' },
      { q: 'What does the MAF sensor measure?', options: ['The mass of air flowing into the engine', 'Fuel tank level', 'Oil pressure', 'Road speed'], answer: 0, explain: 'A heated wire cools as air flows past; the current needed to keep it hot tells the ECU the air mass.' },
      { q: 'How does the ECU control how much fuel each injector delivers?', options: ['By how long it holds the injector open (pulse width)', 'By changing the fuel pressure every cycle', 'By the size of the tank', 'It can\'t; injectors are fixed'], answer: 0, explain: 'Fuel pressure is constant, so open time sets the amount.' },
      { q: 'What is the oxygen (lambda) sensor for?', options: ['Telling the ECU if the last burn was rich or lean, so it can correct the mixture', 'Measuring cabin air quality', 'Inflating the tyres', 'Cooling the exhaust'], answer: 0, explain: 'It closes the loop: measure, correct, measure again.' },
      { q: 'An unmetered air leak after the MAF sensor makes the mixture...', options: ['Lean, because air gets in that the ECU didn\'t count', 'Rich', 'No different', 'Explosive'], answer: 0, explain: 'The ECU only fuels for the air it measured, so extra air means too little fuel.' }
    ]
  },
  {
    id: 'ch6', num: 6, title: 'Electrics & Spark', subtitle: 'Battery, alternator, ignition',
    scene: 'roadster',
    parts: ['c_battery', 'c_alternator', 'c_starter', 'c_coils', 'c_fusebox'],
    lab: 'ignition',
    brief: `
      <p class="lead">A car runs on <b>12 volts</b>. The battery starts the engine, then the alternator takes over and powers everything while recharging the battery.</p>
      <p class="flow">Battery → starter motor (spins engine) · Alternator → 14 V for everything · ECU → coils → 30,000 V sparks</p>
      <p>The spark has to fire <b>before</b> each piston reaches the top, because the flame takes time to spread. How much before depends on engine speed. You'll find the sweet spot in the lab.</p>`,
    quiz: [
      { q: 'Once the engine is running, what powers the car\'s electrics?', options: ['The alternator, which also recharges the battery', 'The battery only', 'The starter motor', 'The spark plugs'], answer: 0, explain: 'A belt-driven alternator produces about 14.2 V to run everything and charge the battery.' },
      { q: 'Why does a manual car need the clutch pressed to start?', options: ['A safety interlock, so the car can\'t lurch forward if it\'s left in gear', 'To save fuel', 'The starter is on the clutch', 'It doesn\'t'], answer: 0, explain: 'With the clutch pressed, the engine is disconnected from the wheels.' },
      { q: 'How does an ignition coil make 30,000 volts from 12?', options: ['It\'s a transformer: cutting the current in the primary winding induces a huge voltage in the many-turn secondary', 'It stores it in a big battery', 'Friction', 'It doesn\'t need to'], answer: 0, explain: 'The collapsing magnetic field induces voltage in proportion to the turns ratio.' },
      { q: 'What does a fuse do?', options: ['Melts and breaks the circuit if too much current flows, before the wire overheats', 'Boosts voltage', 'Stores charge', 'Connects the battery to the alternator'], answer: 0, explain: 'A deliberate weak link that protects the wiring from fire.' },
      { q: 'At higher rpm, spark timing should be...', options: ['More advanced (fire earlier)', 'Retarded (fire later)', 'Exactly at top dead centre', 'Switched off'], answer: 0, explain: 'The burn takes a set time, during which the crank turns further at high rpm.' }
    ]
  },
  {
    id: 'ch7', num: 7, title: 'Cooling & Exhaust', subtitle: 'Getting rid of heat and gas',
    scene: 'roadster',
    parts: ['c_radiator', 'c_hoses', 'c_manifold', 'c_catalyst', 'c_muffler'],
    lab: 'carcooling',
    brief: `
      <p class="lead">Only about a third of the fuel's energy pushes the car. Roughly a third goes into the cooling system and a third out of the tailpipe.</p>
      <p>This chapter builds both escape routes:</p>
      <ul>
        <li><b>Cooling</b>: pump, thermostat, radiator, and fan keep the engine at about 90&nbsp;°C, from Arctic winter to a summer traffic jam.</li>
        <li><b>Exhaust</b>: manifold, <b>catalytic converter</b> (which chemically cleans the gas), and silencer.</li>
      </ul>`,
    quiz: [
      { q: 'Why does a car have a thermostat in the cooling system?', options: ['To keep coolant out of the radiator until the engine is warm, so it warms up quickly', 'To measure outside temperature', 'To control the heater fan', 'To add coolant'], answer: 0, explain: 'Cold engines wear faster and pollute more, so the thermostat holds heat in until about 88 °C.' },
      { q: 'When does the radiator fan matter most?', options: ['In slow traffic, when there\'s little natural airflow', 'At motorway speed', 'When parked with the engine off', 'Only in winter'], answer: 0, explain: 'At speed, the wind does the work. In a jam, only the fan moves air.' },
      { q: 'What does a three-way catalytic converter do?', options: ['Converts CO, unburnt fuel and NOx into CO₂, water and nitrogen', 'Makes the exhaust louder', 'Adds power', 'Cools the exhaust'], answer: 0, explain: 'Precious-metal coatings speed up reactions that clean the exhaust, if the mixture is right at 14.7:1.' },
      { q: 'Why mustn\'t you open a hot radiator cap?', options: ['The pressurised coolant is above 100 °C and flashes into scalding steam', 'It voids the warranty', 'The cap is glued', 'Air escapes'], answer: 0, explain: 'Pressure keeps the coolant liquid. Release it and the coolant boils at once.' }
    ]
  },
  {
    id: 'ch8', num: 8, title: 'Drivetrain', subtitle: 'Clutch, gearbox, diff',
    scene: 'roadster',
    parts: ['c_clutch', 'c_gearbox', 'c_propshaft', 'c_diff', 'c_halfshafts'],
    lab: 'cardrive',
    brief: `
      <p class="lead">The engine spins, but the wheels don't. This chapter builds the path between them:</p>
      <p class="flow">Crankshaft → flywheel → clutch → gearbox → propshaft → differential → driveshafts → rear wheels</p>
      <ol>
        <li>An engine can't run at 0&nbsp;rpm, but the car has to start from standstill. That's the <b>clutch</b>.</li>
        <li>The engine likes 2,000–6,500&nbsp;rpm; the wheels need everything from 0 to 1,700&nbsp;rpm. That's the <b>gearbox</b>.</li>
        <li>In a corner the outside wheel must turn faster than the inside one. That's the <b>differential</b>.</li>
      </ol>`,
    quiz: [
      { q: 'What does pressing the clutch pedal do?', options: ['Lifts the pressure plate off the friction disc, disconnecting the engine from the gearbox', 'Applies the brakes', 'Changes gear', 'Starts the engine'], answer: 0, explain: 'The release bearing pushes the diaphragm spring and unclamps the disc.' },
      { q: 'What does synchromesh do?', options: ['Matches the gear\'s speed to the shaft before engaging, so gears don\'t crunch', 'Synchronises the wipers', 'Times the spark', 'Locks the differential'], answer: 0, explain: 'A brass cone rubs on the gear first to bring it up or down to speed.' },
      { q: 'Why does a car need a differential?', options: ['In a corner the outside wheel travels further, so it must turn faster than the inside wheel', 'To reverse the car', 'To cool the gearbox', 'To change gear'], answer: 0, explain: 'Without one, a tyre would scrub and hop in every corner.' },
      { q: 'With an open differential, one rear wheel on ice and one on tarmac, what happens?', options: ['The wheel on ice spins and the car barely moves', 'The tarmac wheel gets all the power', 'Both wheels lock', 'The engine stalls'], answer: 0, explain: 'An open diff splits torque equally, so the tarmac wheel only gets as little as the icy one can take.' },
      { q: 'What does an overdrive top gear (ratio below 1:1) give you?', options: ['Lower engine rpm at cruising speed: quieter and more economical', 'More acceleration', 'Reverse', 'Higher top speed in every case'], answer: 0, explain: 'The output shaft turns faster than the engine, so the engine can loaf along.' }
    ]
  },
  {
    id: 'ch9', num: 9, title: 'Controls & Body', subtitle: 'Finishing touches',
    scene: 'roadster',
    parts: ['c_pedals', 'c_gearlever', 'c_dash', 'c_seats', 'c_body'],
    lab: null,
    brief: `
      <p class="lead">Everything works. Now the driver needs controls, and the car needs a skin.</p>
      <div class="controls-grid">
        <div><b>Left foot</b><br>Clutch pedal</div>
        <div><b>Right foot</b><br>Brake and accelerator</div>
        <div><b>Left hand</b> (in a right-hand-drive car)<br>Gear lever, handbrake</div>
        <div><b>Eyes</b><br>Speedometer, rev counter, warning lights</div>
      </div>`,
    quiz: [
      { q: 'From left to right, what order are the pedals in a manual car?', options: ['Clutch, brake, accelerator', 'Accelerator, brake, clutch', 'Brake, clutch, accelerator', 'It varies by maker'], answer: 0, explain: 'Clutch on the left for the left foot; brake and accelerator for the right foot.' },
      { q: 'What does the rev counter (tachometer) show?', options: ['Engine speed in rpm', 'Road speed', 'Fuel level', 'Gear selected'], answer: 0, explain: 'So you can shift in the power band and stay away from the red line.' },
      { q: 'Why is a windscreen made of laminated glass?', options: ['A plastic layer holds the glass together so it cracks but doesn\'t shatter', 'It\'s cheaper', 'It keeps the cabin cool', 'It\'s lighter'], answer: 0, explain: 'And it\'s bonded in, adding strength to the shell.' },
      { q: 'What does a seat-belt pretensioner do?', options: ['Yanks the belt tight in the first milliseconds of a crash', 'Warms the seat', 'Reminds you to buckle up', 'Adjusts the seat height'], answer: 0, explain: 'Removing the slack early means your body starts slowing down with the car.' }
    ]
  },
  {
    id: 'ch10', num: 10, title: 'Test Drive', subtitle: 'Put it all together',
    scene: 'roadster', parts: [], lab: null, ride: true,
    brief: `
      <p class="lead">Your roadster is complete. Take it round the test road: a hill start at a STOP sign, a speed-camera zone, a long climb, and a stop box at the finish.</p>
      <p>It uses the same physics you've learned: a real torque curve, a slipping clutch, six gear ratios, a 4.1:1 differential, brakes, and stalling.</p>
      <div class="controls-grid keys">
        <div><kbd>Enter</kbd> Starter (clutch in or neutral!)</div>
        <div><kbd>Space</kbd> Hold for clutch pedal</div>
        <div><kbd>W</kbd>/<kbd>↑</kbd> Accelerator</div>
        <div><kbd>S</kbd>/<kbd>↓</kbd> Brake</div>
        <div><kbd>1</kbd>–<kbd>6</kbd>, <kbd>N</kbd> Pick a gear (H-pattern)</div>
        <div><kbd>Q</kbd>/<kbd>E</kbd> Shift down/up</div>
        <div><kbd>K</kbd> Ignition off</div>
      </div>
      <h4>Rules of the road</h4>
      <ul>
        <li><b>STOP sign</b> (on a hill!): come to a complete stop with the front of the car before the line. Hold the brake, find the biting point, then release the brake as you pull away.</li>
        <li><b>Speed camera</b>: keep under the posted limit when you pass the camera.</li>
        <li>Stalling and penalties cost you the gold medal.</li>
      </ul>
      <p>On a touchscreen, use the on-screen buttons.</p>`
  }
];

const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map(c => [c.id, c]));
const ROADSTER_PARTS = CHAPTERS.filter(c => c.scene === 'roadster').flatMap(c => c.parts);

/* -------------------------------------------------------------- THE DRIVE */
const CAR_TRACK = (() => {
  const height = profile([[0, 0], [60, 0], [100, 6], [150, 13.5], [175, 15], [215, 15], [260, 6], [300, 0], [470, 0],
    [520, 0], [600, 20], [640, 26], [665, 26], [730, 4], [760, 0], [900, 0]]);
  const gravel = x => x > 680 && x < 720;
  return {
    height, startX: 3, finish: 800, box: [812, 826], end: 838, endMsg: 'Bump! Into the tyre wall.',
    ground: '#3a3d42',
    edge: x => gravel(x) ? '#8c7a5c' : '#5d636b',
    crr: x => gravel(x) ? 0.05 : 0.012,
    decor(g, v) {
      // dashed centre line just below the road surface
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2;
      for (let x = Math.floor(v.x0 / 6) * 6; x < v.x1; x += 6) {
        g.beginPath(); g.moveTo(v.SX(x), v.SY(height(x)) + 9); g.lineTo(v.SX(x + 3), v.SY(height(x + 3)) + 9); g.stroke();
      }
    },
    rules: {
      stops: [{ x: 132, label: 'STOP sign', ok: 'Good stop. Now a hill start: biting point, then release the brake.' }],
      zones: [{ from: 330, to: 480, limit: 50, camera: 420 }]
    },
    signs: [
      { x: 6, t: ['TEST ROAD', 'clutch in + Enter to start'] },
      { x: 70, t: ['HILL START AHEAD', 'stop at the line'] },
      { x: 222, t: ['DESCENT', 'brake gently, use the gears'] },
      { x: 312, t: ['50 ZONE', 'speed camera ahead'] },
      { x: 505, t: ['LONG CLIMB ↑', 'shift down: 3rd or 2nd'] },
      { x: 670, t: ['GRAVEL', 'smooth inputs'] },
      { x: 775, t: ['FINISH AHEAD', 'stop in the box'] }
    ]
  };
})();

// Driver, drawn in roadster svg units with the rear hub (240, 451) at the origin.
function drawDriver(g) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = '#1e3a8a'; g.lineWidth = 26;
  g.beginPath(); g.moveTo(205, -2); g.lineTo(285, -10); g.lineTo(305, 0); g.stroke();
  g.strokeStyle = '#e5e7eb'; g.lineWidth = 34;
  g.beginPath(); g.moveTo(200, -6); g.lineTo(165, -105); g.stroke();
  g.strokeStyle = '#e5e7eb'; g.lineWidth = 12;
  g.beginPath(); g.moveTo(170, -96); g.lineTo(225, -78); g.lineTo(262, -112); g.stroke();
  g.fillStyle = '#e8b896'; g.beginPath(); g.arc(160, -138, 20, 0, 7); g.fill();
  g.fillStyle = '#3b2a1e'; g.beginPath(); g.arc(156, -144, 20, Math.PI * 0.9, Math.PI * 2.1); g.fill();
  g.fillStyle = '#111'; g.fillRect(166, -144, 16, 6);
}

const GAME = {
  storeKey: 'soapbox-to-sports-car-v1',
  title: 'Soapbox to Sports Car',
  titleHTML: 'Soapbox <span>to</span> Sports Car',
  lead: 'Learn how a car really works by building one. Start with a soapbox cart. Then, system by system, turn it into a front-engined, rear-wheel-drive roadster: suspension, brakes and ABS, a four-cylinder engine, fuel injection, electrics, cooling, the gearbox and differential. Then drive it.',
  points: [
    '<b>10 chapters</b>, each adding one system',
    '<b>45 parts</b>, each with a workshop card explaining how it works',
    '<b>8 interactive labs</b>: steering geometry, suspension and brakes, ABS, firing order, fuel injection, ignition timing, cooling, the differential',
    'A <b>physics-based test drive</b> with a hill start, a speed camera, and a clutch you can slip and stall'
  ],
  other: { text: 'Prefer two wheels?', label: 'Try Pedals to Pistons', href: 'index.html' },
  heroScene: 'roadster',
  scenes: { soapbox: { viewBox: '120 250 760 300' }, roadster: { viewBox: '30 230 950 300' } },
  ride: {
    verb: 'Drive', physics: CAR, track: CAR_TRACK, cylinders: 4, lugRpm: 1800, directGears: true,
    hud: { maxRpm: 8000, band: [2500, 6500] },
    vehicle: {
      bodyIds: ROADSTER_PARTS.filter(id => id !== 'c_rear_wheel' && id !== 'c_front_wheel'),
      rear: [240, 451], wheelbaseSvg: 531, wheelbase: 2.31, noseM: 3.15, exhaust: [52, 494],
      wheels: [{ id: 'c_rear_wheel', cx: 240, cy: 451, r: 70 }, { id: 'c_front_wheel', cx: 771, cy: 451, r: 70 }],
      drawFront: drawDriver
    },
    words: {
      startMsg: 'Hold the clutch (Space) and press Enter to start the engine.',
      clutchIn: 'Press the clutch', firstGear: 'Hold the clutch (Space) and press 1 for first gear.',
      neutralHint: null, throttleBtn: 'GAS', throttleBar: 'accelerator',
      keys: '<kbd>Enter</kbd> start · <kbd>Space</kbd> clutch · <kbd>W</kbd> accelerator · <kbd>S</kbd> brake · <kbd>1</kbd>–<kbd>6</kbd>/<kbd>N</kbd> gears · <kbd>Q</kbd>/<kbd>E</kbd> shift · <kbd>K</kbd> ignition off'
    },
    gold: 75, silver: 120,
    certTitle: 'Car mechanic',
    certText: 'You built a sports car from a soapbox up, learned what every system does, and drove it round the test road.',
    goldText: 'Gold: clean, legal, and quick. You\'d pass the test.',
    tip: 'Tip: hold the car on the brake at the STOP line, find the biting point, then release the brake. Watch your speed past the camera.'
  }
};
