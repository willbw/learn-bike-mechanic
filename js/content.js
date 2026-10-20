/* All teaching content: parts (with drop zones), chapters and quizzes. */

const PARTS = {
  /* ============================ CHAPTER 1: BICYCLE ======================= */
  b_frame: {
    name: 'Frame', role: 'The skeleton everything bolts to',
    zone: { x: 545, y: 255, r: 38 }, requires: [],
    hint: 'The big diamond of tubes in the middle of the bike.',
    body: `
      <p>The classic <b>diamond frame</b> is really two triangles: the <b>front triangle</b> (top tube, down tube, seat tube) and the <b>rear triangle</b> (seat stays and chain stays).</p>
      <p><b>Why triangles?</b> A triangle can't change shape unless one of its sides changes length. A load on any corner gets turned into simple push or pull <i>along</i> the tubes instead of bending them, and tubes are very strong in push and pull. That's how a 9&nbsp;kg frame carries a 90&nbsp;kg rider over potholes.</p>
      <h4>Key locations</h4>
      <ul>
        <li><b>Head tube</b>: the front pivot where the steering turns on bearings.</li>
        <li><b>Bottom bracket shell</b>: holds the axle your cranks spin on.</li>
        <li><b>Dropouts</b>: slots at the back that hold the rear axle.</li>
      </ul>
      <div class="callout moto"><b>On a motorbike:</b> a dirt-bike frame does exactly the same job and keeps the same key locations (a steering head at the front, a mounting point for the rear wheel at the back). It also has to carry an engine and survive landing off jumps.</div>
      <div class="callout tip"><b>Mechanic's tip:</b> cracks usually start next to welds and where tubes meet. Check those spots first on any used frame.</div>`
  },
  b_fork: {
    name: 'Fork & Headset', role: 'Holds the front wheel and lets it steer',
    zone: { x: 708, y: 290, r: 30 }, requires: ['b_frame'],
    hint: 'It runs down from the front of the frame to where the front axle will be.',
    body: `
      <p>The fork's <b>steerer tube</b> runs up through the frame's head tube. It turns on two bearings called the <b>headset</b>. The angle of this steering axis is the <b>head angle</b>: about 70° on a road bike, about 65° on a mountain bike.</p>
      <h4>Trail: why bikes steer themselves</h4>
      <p>Extend the steering axis down to the ground and it lands <i>in front of</i> the spot where the tyre touches the road. So the tyre <b>trails</b> behind its pivot, like the caster wheel on a shopping trolley. When the bike leans or wobbles, trail pulls the front wheel back into line. That's why you can ride no-handed. The forward bend of the fork legs (the <b>offset</b>) is how designers tune the amount of trail.</p>
      <div class="callout moto"><b>On a motorbike:</b> a dirt bike has a more laid-back steering axis (about 27° from vertical) and lots of trail (about 110&nbsp;mm), which keeps it stable at 100&nbsp;km/h over rough ground.</div>
      <div class="callout tip"><b>Mechanic's tip:</b> squeeze the front brake and rock the bike back and forth. A clunk from the head tube means the headset is loose.</div>`
  },
  b_bars: {
    name: 'Handlebars & Stem', role: 'Your steering lever and control centre',
    zone: { x: 676, y: 124, r: 26 }, requires: ['b_fork'],
    hint: 'Clamped on top of the steerer tube, where your hands go.',
    body: `
      <p>The <b>stem</b> clamps the bars to the top of the fork's steerer tube. Wider bars give you more leverage, so steering is slower but more controlled. A longer stem moves your weight forward.</p>
      <h4>Countersteering: the surprise</h4>
      <p>Above walking pace you don't really turn a two-wheeler by pointing the bars. You <b>lean</b> it. To start the lean you briefly push the bars the <i>opposite</i> way: push on the right grip and the bike leans right, then turns right. Every rider does this without knowing it.</p>
      <div class="callout moto"><b>On a motorbike:</b> the bars also carry the throttle (right grip), the front brake lever (right hand), the clutch lever (left hand), and the switches. You'll fit those in Chapter 8.</div>`
  },
  b_rear_wheel: {
    name: 'Rear Wheel', role: 'Turns pedalling into forward motion',
    zone: { x: 260, y: 370, r: 48 }, requires: ['b_frame'],
    hint: 'Goes in the slots (dropouts) at the very back of the frame.',
    body: `
      <p>A wheel has four parts: the <b>hub</b> (with bearings), the <b>spokes</b>, the <b>rim</b>, and the <b>tyre</b>.</p>
      <h4>Wire wheels hang from their spokes</h4>
      <p>A thin spoke can't push, but it's very strong when pulled. Every spoke is tightened like a guitar string, so the rim is pulled evenly from all sides. When you sit on the bike, the hub actually <b>hangs from the spokes above it</b>, and the spokes below just lose a bit of tension.</p>
      <p>The spokes cross each other (<b>tangential lacing</b>) so they can carry twisting force, or torque, from the hub out to the rim. The rear wheel needs that for drive, and both wheels need it for braking.</p>
      <h4>Freewheel</h4>
      <p>A ratchet inside the rear hub lets the wheel keep spinning when you stop pedalling. That clicking sound when you coast is the ratchet.</p>
      <div class="callout moto"><b>On a motorbike:</b> dirt bikes still use spoked wheels because they flex, survive big impacts, and can be trued and repaired at the trailside.</div>`
  },
  b_front_wheel: {
    name: 'Front Wheel', role: 'Steering, braking, and most of your grip',
    zone: { x: 740, y: 370, r: 48 }, requires: ['b_fork'],
    hint: 'It slots into the bottom of the fork.',
    body: `
      <p>The front wheel steers, and it also does most of the <b>braking</b>. When you slow down, your weight shifts forward and presses the front tyre into the ground, which gives it more grip.</p>
      <h4>Bigger wheels roll over things</h4>
      <p>A larger wheel meets a bump at a gentler angle, so it rolls up and over instead of slamming into it. That's why mountain bikes moved to 29-inch wheels, and why every dirt bike has a tall 21-inch front.</p>
      <div class="callout"><b>Bearings:</b> lift the wheel and spin it. It should turn silently and slowly settle with the valve at the bottom (the valve is the heavy spot). Grinding or roughness means the bearings are worn.</div>`
  },
  b_saddle: {
    name: 'Saddle & Seatpost', role: 'Where your weight sits',
    zone: { x: 428, y: 150, r: 26 }, requires: ['b_frame'],
    hint: 'It slides into the top of the seat tube.',
    body: `
      <p>Saddle height sets how far your legs extend. Too low wastes power; too high makes you rock side to side. A good starting point: your leg is almost straight with your heel on the pedal.</p>
      <p>Your weight is shared between the saddle, the pedals, and the bars. Where it sits changes which tyre has more grip.</p>
      <div class="callout moto"><b>On a motorbike:</b> off-road riders mostly <b>stand on the footpegs</b>. That puts their weight low and in the centre of the bike, and lets their legs act as extra suspension. Standing is more stable than sitting.</div>`
  },
  b_crankset: {
    name: 'Crankset & Bottom Bracket', role: 'You are the engine; this is your crankshaft',
    zone: { x: 470, y: 400, r: 30 }, requires: ['b_frame'],
    hint: 'Where your feet go: low down, where the tubes meet.',
    body: `
      <p>The <b>cranks</b> are levers. Your foot pushes the pedal, and the crank turns that push into rotation of the axle in the <b>bottom bracket</b>, which spins on bearings. The large <b>chainring</b> turns with it.</p>
      <p><b>Torque = force × lever length.</b> Push 700&nbsp;N (about your body weight) on a 0.17&nbsp;m crank and you make about 119&nbsp;Nm of torque.</p>
      <h4>Power comes in pulses</h4>
      <p>You only push hard on the way down, so you deliver two pulses per revolution with weak spots at the top and bottom. A single-cylinder engine has the same problem but worse: it gets <b>one</b> power pulse every <b>two</b> revolutions. You'll see how it copes in Chapter 3.</p>
      <div class="callout moto"><b>On a motorbike:</b> the engine's <b>crankshaft</b> does exactly this job. It turns the piston's up-and-down push into rotation.</div>`
  },
  b_cassette: {
    name: 'Cassette & Derailleur', role: 'Lets you choose how hard each pedal stroke is',
    zone: { x: 278, y: 420, r: 22 }, requires: ['b_rear_wheel'],
    hint: 'A stack of sprockets on the rear hub, with a spring-loaded arm below it.',
    body: `
      <p>The <b>cassette</b> is a stack of sprockets (cogs) on the rear hub. The <b>derailleur</b> nudges the chain sideways onto a different cog while you pedal. Its spring-loaded cage takes up the slack.</p>
      <p><b>Gear ratio = chainring teeth ÷ cog teeth.</b> With a 44-tooth ring and an 11-tooth cog, the wheel turns 4 times for every turn of the pedals: fast, but hard to push. On a 36-tooth cog it turns only 1.2 times: slow, but easy enough to climb a wall.</p>
      <h4>Why have gears at all?</h4>
      <p>Your legs make their best power in a narrow range of pedalling speeds, around 80–100&nbsp;rpm. Gears let you stay in that range whether you're crawling uphill or flying down. <b>Engines are exactly the same</b>, only their good range (the <b>power band</b>) is even narrower in comparison, which is why motorbikes need gearboxes.</p>
      <div class="callout moto"><b>On a motorbike:</b> instead of moving the chain between cogs, a motorbike has a sealed <b>gearbox</b> with gears that are always meshed. One chain, one ratio outside; all the shifting happens inside the engine.</div>`
  },
  b_chain: {
    name: 'Chain', role: 'Carries the pull from front to back',
    zone: { x: 365, y: 395, r: 24 }, requires: ['b_crankset', 'b_cassette'],
    hint: 'Loops between the chainring at the front and the cassette at the back.',
    body: `
      <p>A <b>roller chain</b> is made of plates, pins, and rollers. Only the <b>top run</b> carries load: it's pulled tight between the chainring and the cog. The bottom run just returns, slack.</p>
      <p>A clean chain is about 98% efficient, which makes it one of the best ways ever invented to move power.</p>
      <p><b>"Stretch"</b> isn't really stretching. The pins and bushings wear, so each link gets slightly longer. A worn chain then rides up on the sprocket teeth and wears them out too.</p>
      <div class="callout moto"><b>On a motorbike:</b> it's the same idea but much heavier (a "520" chain), with rubber <b>O-rings</b> that seal grease inside every link.</div>
      <div class="callout tip"><b>Mechanic's tip:</b> clean it, then lube it, then wipe off the excess. Lube on the outside of the chain only collects grit.</div>`
  },
  b_brakes: {
    name: 'Rim Brakes & Levers', role: 'Turn speed into heat',
    zone: { x: 694, y: 245, r: 22 }, requires: ['b_front_wheel', 'b_rear_wheel', 'b_bars'],
    hint: 'Pads that squeeze the rims, worked by levers on the bars.',
    body: `
      <p>Every brake is a <b>heat machine</b>. Friction between the pads and the rim turns the bike's movement energy into heat.</p>
      <p>Movement energy = ½ × mass × speed². Double your speed and there's <b>four times</b> as much energy to get rid of.</p>
      <p>Squeezing the lever pulls a steel <b>cable</b>, which closes the caliper arms and presses the pads onto the rim. Each lever along the way multiplies your force (this is called <b>mechanical advantage</b>).</p>
      <h4>Why the front brake matters most</h4>
      <p>Under braking your weight pitches forward, pressing the front tyre down and lifting load off the rear. The front can provide around 70% or more of your stopping power.</p>
      <div class="callout moto"><b>On a motorbike:</b> it's 10× heavier and 3× faster, which means about 100× more energy. Cables and rim pads can't handle that, so motorbikes use <b>hydraulic disc brakes</b>, coming up next chapter.</div>`
  },

  /* ======================= CHAPTER 2: ROLLING CHASSIS ===================== */
  m_frame: {
    name: 'Frame & Subframe', role: 'Carries the rider, the engine, and the impacts',
    zone: { x: 530, y: 172, r: 38 }, requires: [],
    hint: 'The main structure: from the steering head back over the engine bay.',
    body: `
      <p>This is a <b>perimeter/cradle frame</b> made of aluminium or chromoly steel. Like the bicycle frame, it has a <b>steering head</b> at the front and a <b>pivot</b> at the back (for the swingarm). But it also has to cradle an engine and survive landings at 4–5&nbsp;g.</p>
      <ul>
        <li><b>Main spars</b> run from the steering head back over the engine.</li>
        <li><b>Down tube and cradle</b> wrap under the engine. The engine bolts in and helps stiffen the frame (it becomes a <b>stressed member</b>).</li>
        <li>The <b>subframe</b> (silver) is a separate bolt-on rear section that holds the seat, airbox, and silencer. In a crash it bends and can be replaced cheaply.</li>
      </ul>
      <p><b>Stiffness is tuned, not maximised.</b> A frame that's too stiff feels harsh and skittery on rough ground. Engineers deliberately build in a little flex.</p>
      <div class="callout"><b>Compared with a bicycle:</b> a bike frame is about 1.5&nbsp;kg; a dirt-bike frame is about 9&nbsp;kg. The bike plus rider weighs around 190&nbsp;kg instead of 95&nbsp;kg, at triple the speed.</div>`
  },
  m_swingarm: {
    name: 'Swingarm', role: 'Lets the rear wheel move up and down',
    zone: { x: 330, y: 372, r: 32 }, requires: ['m_frame'],
    hint: 'A long arm pivoting from the back of the frame to the rear axle.',
    body: `
      <p>A bicycle's rear wheel is bolted solid to the frame. A dirt bike's rear wheel sits at the end of the <b>swingarm</b>, a long arm that pivots on bearings at the back of the frame. It lets the wheel travel about <b>300&nbsp;mm</b> up and down, roughly a ruler's length.</p>
      <p><b>Clever placement:</b> the pivot sits right next to the engine's front sprocket. That way the distance between the two sprockets barely changes as the swingarm swings, so the chain doesn't snap tight or flop loose over bumps.</p>
      <p><b>Chain adjusters</b> at the back slide the axle rearward to set chain slack.</p>
      <div class="callout tip"><b>Mechanic's tip:</b> grab the rear wheel and rock it side to side. Any play means the swingarm pivot bearings (or the linkage bearings below) need grease or replacing.</div>`
  },
  m_shock: {
    name: 'Rear Shock & Linkage', role: 'Spring holds the bike up; damper controls it',
    zone: { x: 410, y: 280, r: 28 }, requires: ['m_frame', 'm_swingarm'],
    hint: 'Stands nearly upright between the frame and the swingarm.',
    body: `
      <p>Every suspension unit is two things working together:</p>
      <ul>
        <li><b>Spring</b> (the red coil): holds up the bike's weight and stores the energy of a bump.</li>
        <li><b>Damper</b> (the oil-filled body): controls how <i>fast</i> the spring can move. Oil is forced through tiny holes and flexible <b>shim stacks</b>. The faster it moves, the harder it resists.</li>
      </ul>
      <p>A spring on its own gives energy straight back, so the bike would <b>pogo</b> after every bump. The damper turns that bouncing into heat. <b>Compression damping</b> controls how it squashes; <b>rebound damping</b> controls how it extends again.</p>
      <h4>Linkage and progression</h4>
      <p>The shock connects to the swingarm through a <b>linkage</b> (the triangle under the swingarm). As the wheel goes deeper into its travel, the linkage compresses the shock faster, so the suspension gets <b>progressively stiffer</b>. Small bumps feel soft, but a big landing won't slam it to the bottom.</p>
      <p>The gold <b>piggyback reservoir</b> holds pressurised nitrogen gas, which stops the oil from foaming when it gets hot.</p>
      <div class="callout tip"><b>Mechanic's tip:</b> set <b>sag</b> first. With the rider aboard, the rear should settle about one-third of its travel (around 100&nbsp;mm). Adjust the spring preload until it does.</div>`
  },
  m_fork: {
    name: 'Telescopic Forks & Triple Clamps', role: 'Front suspension and steering in one',
    zone: { x: 700, y: 260, r: 34 }, requires: ['m_frame'],
    hint: 'Two long sliding tubes angled down from the steering head to the front axle.',
    body: `
      <p>Each fork leg is a pair of tubes that slide inside each other, with a spring and a <b>damping cartridge</b> inside, about 300&nbsp;mm of travel.</p>
      <p>This is an <b>upside-down (USD)</b> fork: the fat outer tubes are at the top, clamped in the triple clamps, which makes the fork stiffer. The thin inner tubes slide at the bottom, which means less <b>unsprung weight</b> (the mass that moves with the wheel). Lighter unsprung parts can follow bumps faster.</p>
      <p>The <b>triple clamps</b> grip both fork legs and the steering stem between them. The stem turns on bearings inside the frame's steering head, just like a bicycle headset.</p>
      <ul>
        <li><b>Rake</b> (steering axis angle): about 27° from vertical.</li>
        <li><b>Trail</b>: about 115&nbsp;mm, which makes it very stable.</li>
      </ul>
      <div class="callout"><b>Brake dive:</b> when you brake, weight shifts forward and the fork compresses. That steepens the steering angle and makes it quicker. Good riders use this deliberately to turn hard into corners.</div>`
  },
  m_bars: {
    name: 'Handlebars', role: 'Leverage to wrestle the bike over rough ground',
    zone: { x: 610, y: 108, r: 26 }, requires: ['m_fork'],
    hint: 'Mounted on top of the upper triple clamp.',
    body: `
      <p>Dirt-bike bars are wide (about 800&nbsp;mm) and made of tapered aluminium. Width gives leverage to hold a line when the front wheel gets knocked around by rocks and ruts.</p>
      <p>They sit in <b>rubber-mounted</b> clamps to soak up vibration. The bend (rise and sweep) is chosen to fit the rider standing up.</p>
      <div class="callout tip"><b>Mechanic's tip:</b> in a crash the bars are meant to bend instead of breaking the clamps. Always check them for bends and cracks afterwards.</div>`
  },
  m_rear_wheel: {
    name: 'Rear Wheel (18")', role: 'Puts the power into the dirt',
    zone: { x: 235, y: 398, r: 52 }, requires: ['m_swingarm'],
    hint: 'Bolts into the end of the swingarm.',
    body: `
      <p>An 18-inch rim with a tall, <b>knobbly</b> tyre run at low pressure, about <b>0.9&nbsp;bar (13&nbsp;psi)</b>, compared with 2.5&nbsp;bar in a car tyre. Low pressure lets the tyre wrap around rocks and roots.</p>
      <p>The <b>knobs</b> dig into soft ground like the spikes on a running shoe. The gaps between them let mud fling out so they can bite again.</p>
      <p>A <b>rim lock</b> clamps the tyre bead to the rim. At low pressure, with the engine's torque, the tyre would otherwise spin on the rim and rip the valve out of the tube.</p>
      <p>The hub has bearings, plus mounting points for the brake disc on one side and the drive sprocket on the other. The spokes are thicker than a bicycle's, but the job is the same: <b>a wheel that hangs in tension</b>.</p>`
  },
  m_front_wheel: {
    name: 'Front Wheel (21")', role: 'Rolls over obstacles and steers precisely',
    zone: { x: 768, y: 390, r: 52 }, requires: ['m_fork'],
    hint: 'Clamped between the bottoms of the fork legs.',
    body: `
      <p>The <b>21-inch</b> front is the tallest wheel on almost any motorbike. Its big diameter rolls over rocks, roots, and ruts that would stop a smaller wheel.</p>
      <p>The tyre is <b>narrow</b>, so it slices through soft ground and mud instead of pushing it out of the way, and it steers precisely.</p>
      <p>A spinning wheel also acts like a <b>gyroscope</b>: it resists being tipped. Combined with trail, this makes the bike more stable the faster it goes.</p>`
  },
  m_front_brake: {
    name: 'Front Hydraulic Disc Brake', role: 'Multiplies a two-finger squeeze into huge clamping force',
    zone: { x: 735, y: 362, r: 22 }, requires: ['m_front_wheel', 'm_bars'],
    hint: 'A disc on the front hub, a caliper on the fork leg, and a lever on the right of the bars.',
    body: `
      <p>Squeeze the lever and it pushes a small piston in the <b>master cylinder</b> on the bars. Brake <b>fluid</b> carries that push down the hose to the <b>caliper</b>, whose bigger pistons press the pads onto the steel <b>rotor</b> (the disc).</p>
      <h4>Hydraulic multiplication</h4>
      <p>A liquid can't be squashed, and it has the same pressure everywhere (that's <b>Pascal's law</b>). Force = pressure × area. If the caliper pistons have <b>12× the area</b> of the master-cylinder piston, they push with <b>12× the force</b>. The trade-off: they only move 1/12 as far. That's fine, because the pads only need to move a fraction of a millimetre.</p>
      <p>The rotor is drilled and wave-shaped to scrape off mud and get rid of heat.</p>
      <div class="callout"><b>Brake fade:</b> in a long descent, the heat can make the fluid boil. Gas bubbles <i>can</i> be squashed, so the lever goes spongy and comes back to the bar. Brake fluid also absorbs water from the air, which lowers its boiling point. Replace it every year or two.</div>`
  },
  m_rear_brake: {
    name: 'Rear Disc Brake & Pedal', role: 'Foot-operated control for the rear wheel',
    zone: { x: 262, y: 430, r: 22 }, requires: ['m_rear_wheel'],
    hint: 'A smaller disc on the rear hub; the caliper rides under the swingarm.',
    body: `
      <p>The rear brake works the same way as the front, but it's operated by your <b>right foot</b> through a pedal and its own master cylinder. The disc is smaller because when you brake, weight leaves the rear wheel, so it can't do as much stopping.</p>
      <p>Off-road, the rear brake is a <b>control tool</b>. Dragging it on a steep descent keeps the bike straight, and a quick stab can slide the rear around a tight turn.</p>
      <div class="callout tip"><b>Rule of thumb:</b> if you lock the rear wheel, it slides and you recover. If you lock the front wheel, you fall. The front brake needs finesse; the rear forgives.</div>`
  },
  m_footpegs: {
    name: 'Footpegs', role: 'Where the rider really stands',
    zone: { x: 448, y: 406, r: 20 }, requires: ['m_frame'],
    hint: 'Low down, just under the swingarm pivot.',
    body: `
      <p>Off-road riders spend most of their time <b>standing</b>. The pegs sit near the bike's balance point, close to the swingarm pivot, so the rider's weight goes in low and central. That's the most stable place it can be.</p>
      <p>They have <b>serrated teeth</b> to grip boots in mud, and they're <b>spring-loaded to fold up</b>, so a rock or a crash flips them up instead of snapping them off.</p>
      <p>With the bicycle's pedals and cranks gone, pegs are where your feet go. The engine does the pushing now.</p>`
  },

  /* ============================ CHAPTER 3: ENGINE ========================= */
  m_crankcase: {
    name: 'Crankcase & Crankshaft', role: 'The bottom end: turns up-and-down into round-and-round',
    zone: { x: 528, y: 390, r: 32 }, requires: [],
    hint: 'The big aluminium case that sits low in the frame cradle.',
    body: `
      <p>Inside these aluminium cases spins the <b>crankshaft</b>, the engine's version of your bicycle cranks.</p>
      <p>The <b>connecting rod</b> joins the piston to an off-centre <b>crankpin</b>. As the piston is pushed down, the rod shoves the crankpin around in a circle. The distance the piston travels (top to bottom) is the <b>stroke</b>, which is twice the crankpin's offset.</p>
      <p>A single cylinder only fires <b>once every two revolutions</b>, so the crank has heavy <b>flywheel</b> weights. Their momentum carries the engine through the three strokes that don't make power.</p>
      <p>On almost every motorbike, the same cases also hold the <b>gearbox</b>, and the same oil lubricates both.</p>`
  },
  m_cylinder: {
    name: 'Cylinder & Piston', role: 'Where the explosion pushes',
    zone: { x: 548, y: 300, r: 26 }, requires: ['m_crankcase'],
    hint: 'Stands on top of the crankcase, leaning slightly forward.',
    body: `
      <p>The piston slides in the <b>cylinder</b> (also called the bore). <b>Piston rings</b> seal in the combustion pressure and scrape oil off the walls. The bore is coated with super-hard <b>Nikasil</b>.</p>
      <p><b>Displacement</b> = bore area × stroke. For a 250&nbsp;cc engine, that's about a 78&nbsp;mm bore × 52&nbsp;mm stroke. A wide bore with a short stroke (<b>oversquare</b>) lets the engine rev very high.</p>
      <h4>Just how violent is it?</h4>
      <p>At 13,000&nbsp;rpm the piston stops and reverses direction about 430 times a second, averaging about 23&nbsp;m/s. At the top of each stroke it decelerates at around <b>6,000&nbsp;g</b>. This is why race pistons are forged and very light.</p>
      <p>The cylinder walls are hollow. Coolant flows through these <b>water jackets</b> (Chapter 6).</p>`
  },
  m_head: {
    name: 'Cylinder Head & Valvetrain', role: 'Opens and closes the engine\'s airways at exactly the right time',
    zone: { x: 562, y: 240, r: 24 }, requires: ['m_cylinder'],
    hint: 'Caps the top of the cylinder.',
    body: `
      <p>The head forms the roof of the <b>combustion chamber</b>. It holds four <b>valves</b> (two intake, two exhaust), each a mushroom-shaped plug, usually titanium, that seals a port.</p>
      <p>Two <b>camshafts</b> on top (called DOHC) have egg-shaped <b>lobes</b> that push the valves open. Stiff springs snap them shut again.</p>
      <p>A <b>cam chain</b> drives the camshafts from the crank at exactly <b>half crank speed</b>. That's because each valve opens once per four-stroke cycle, which takes two crank revolutions.</p>
      <div class="callout"><b>Valve overlap:</b> around top dead centre, the exhaust valves haven't quite closed when the intake valves start opening. The rush of exhaust leaving helps pull the fresh charge in. You'll see this in the lab.</div>
      <div class="callout tip"><b>Mechanic's tip:</b> check <b>valve clearances</b> regularly. As the valve seats wear, valves sit higher and clearance shrinks. A valve that can't fully close leaks fire past its edge and burns.</div>`
  },
  m_oil: {
    name: 'Oil Pump & Filter', role: 'The engine\'s blood',
    zone: { x: 592, y: 410, r: 18 }, requires: ['m_crankcase'],
    hint: 'Small round cover low on the front of the crankcase.',
    body: `
      <p>Metal never actually touches metal in a healthy engine. A <b>pump</b> forces oil into the bearings, where the spinning parts float on a film thinner than a hair. This is called <b>hydrodynamic lubrication</b>.</p>
      <p>The oil is also sprayed under the piston to cool it, splashed onto the cylinder walls, and pumped up to the camshafts. The <b>filter</b> catches metal particles and grit.</p>
      <p>In most bikes, the engine, gearbox, and <b>wet clutch</b> share the same oil. Car oils with friction modifiers would make the clutch slip, so bikes need motorcycle oil (rated JASO MA).</p>
      <div class="callout tip"><b>Mechanic's tip:</b> dirt bikes hold only about 1&nbsp;litre of oil, and it works very hard. Racers change it every few rides. The round sight glass on the case shows the level.</div>`
  },

  /* ========================== CHAPTER 4: FUEL & AIR ======================= */
  m_airbox: {
    name: 'Airbox & Air Filter', role: 'Feeds the engine clean air',
    zone: { x: 380, y: 232, r: 30 }, requires: [],
    hint: 'A box under the seat, behind the engine, with the filter inside.',
    body: `
      <p>An engine is an <b>air pump</b>. A 250&nbsp;cc four-stroke at 10,000&nbsp;rpm takes in 5,000 cylinders-full a minute. That's about <b>1,250 litres of air every minute</b>.</p>
      <p>Dust in that air would act like sandpaper on the piston and bore. The <b>oiled foam filter</b> traps it: sticky oil in the foam grabs the particles.</p>
      <p>The <b>airbox</b> is a calm reservoir that smooths out the pulsing intake flow. Its inlet shape and volume are tuned like a musical instrument to help power.</p>
      <div class="callout tip"><b>Mechanic's tip:</b> in dusty conditions, clean and re-oil the filter after every ride. A dirty filter starves the engine of air, making the mixture <i>rich</i>. You'll see this in the lab.</div>`
  },
  m_carb: {
    name: 'Carburettor', role: 'Meters fuel into the air in the right proportion',
    zone: { x: 494, y: 252, r: 22 }, requires: ['m_head'],
    hint: 'Between the airbox boot and the back of the cylinder head.',
    body: `
      <p><b>The throttle controls air, not fuel.</b> The carburettor's job is to add the right amount of fuel to whatever air the throttle lets through.</p>
      <h4>The venturi trick</h4>
      <p>The carb's bore is narrowed in the middle, the <b>venturi</b>. Air has to speed up to get through, and fast-moving air has lower pressure (<b>Bernoulli's principle</b>). That low pressure sucks fuel up through calibrated holes called <b>jets</b>, from the <b>float bowl</b> below, which keeps fuel at a constant level using a float and valve like a toilet cistern.</p>
      <ul>
        <li><b>Pilot circuit</b> for idle and just off idle.</li>
        <li><b>Needle</b> (tapered, hanging from the throttle slide) for mid throttle.</li>
        <li><b>Main jet</b> for full throttle.</li>
      </ul>
      <p><b>The chemistry:</b> petrol burns completely at <b>14.7&nbsp;kg of air per 1&nbsp;kg of fuel</b> (the "stoichiometric" ratio). Engines make their best power a little richer, around 12.5–13:1.</p>
      <div class="callout moto"><b>Modern bikes</b> use <b>fuel injection</b> instead. A computer reads sensors (throttle position, air pressure and temperature, oxygen in the exhaust) and pulses an injector, more precisely than any carb.</div>`
  },
  m_tank: {
    name: 'Fuel Tank', role: 'Carries the energy',
    zone: { x: 555, y: 150, r: 30 }, requires: [],
    hint: 'Sits on top of the frame spars, between your knees.',
    body: `
      <p>Dirt-bike tanks are moulded <b>plastic</b> (HDPE). It's light, shaped to fit between the rider's knees, doesn't dent, and is often see-through so you can check the level.</p>
      <p>A litre of petrol holds about <b>32&nbsp;MJ</b> of energy, enough to lift the bike and rider about 17&nbsp;km straight up. Only 25–30% of it ever moves the bike. The rest leaves as heat through the exhaust and radiators.</p>
      <p>The cap has a <b>vent hose</b>. As fuel flows out, air must flow in, or a vacuum forms and the fuel stops flowing. A pinched vent hose is a classic cause of a mysterious stall.</p>`
  },
  m_fuel_line: {
    name: 'Petcock & Fuel Line', role: 'Lets fuel flow down to the carb',
    zone: { x: 512, y: 210, r: 18 }, requires: ['m_tank', 'm_carb'],
    hint: 'Connects the bottom of the tank to the top of the carburettor.',
    body: `
      <p>On a carburetted bike, fuel simply falls by <b>gravity</b> from the tank to the float bowl.</p>
      <p>The <b>petcock</b> is a tap with three positions: <b>ON</b>, <b>OFF</b>, and <b>RESERVE</b>. The reserve pickup sits lower in the tank, so when the bike starts to splutter you flip to reserve and still have about a litre to get home.</p>
      <div class="callout moto"><b>Fuel-injected bikes</b> use an electric <b>pump</b> inside the tank that pushes fuel to the injector at about 3.5&nbsp;bar.</div>
      <div class="callout tip"><b>Mechanic's tip:</b> turn the petcock OFF when you transport the bike. A sticking float valve can let the carb overflow, and fuel can leak past the piston into the crankcase oil.</div>`
  },

  /* ======================== CHAPTER 5: SPARK & ELECTRICS ================== */
  m_stator: {
    name: 'Flywheel & Stator', role: 'The bike\'s own power station',
    zone: { x: 506, y: 360, r: 22 }, requires: [],
    hint: 'A round cover on the end of the crankshaft.',
    body: `
      <p>Bolted to the end of the crankshaft is a <b>flywheel</b> with powerful magnets inside its rim. It spins around the <b>stator</b>, a ring of fixed copper coils.</p>
      <p>A magnet moving past a coil pushes electrons through the wire (<b>Faraday's law of induction</b>). So every revolution makes alternating current (AC). A <b>regulator/rectifier</b> converts it to steady 12&nbsp;V DC for the battery, ECU, and lights.</p>
      <p>A <b>pickup sensor</b> beside the flywheel reads a bump on its rim, so the ignition computer knows exactly where the crank is.</p>
      <div class="callout"><b>Flywheel weight matters:</b> a heavier flywheel resists stalling and gives smooth, grippy power, which is great in slippery woods. A lighter one revs up faster, which suits motocross.</div>`
  },
  m_ecu: {
    name: 'CDI / ECU', role: 'Decides exactly when to fire',
    zone: { x: 300, y: 193, r: 18 }, requires: ['m_stator'],
    hint: 'A small black box tucked under the rear of the seat.',
    body: `
      <p>Older bikes use a <b>CDI</b> (capacitor discharge ignition). It charges a capacitor to about 300&nbsp;V, then dumps it into the ignition coil in an instant.</p>
      <p>Modern bikes have an <b>ECU</b> (engine control unit), a small computer holding <b>maps</b>: tables of spark timing (and fuel) for every combination of rpm and throttle.</p>
      <p>It fires the spark <b>before</b> the piston reaches the top (this is called <b>ignition advance</b>), because the flame takes time to spread. The faster the engine spins, the earlier it needs to fire.</p>
      <p>It also runs the <b>rev limiter</b>, cutting sparks so the engine can't over-rev and destroy itself.</p>`
  },
  m_plug: {
    name: 'Spark Plug & Ignition Coil', role: 'Makes a 30,000-volt spark',
    zone: { x: 572, y: 198, r: 18 }, requires: ['m_head'],
    hint: 'Pushes onto the very top of the cylinder head.',
    body: `
      <p>The <b>coil</b> is a transformer. A few hundred turns of thick wire on the input side and tens of thousands of turns of fine wire on the output side step a pulse up to <b>20,000–40,000 volts</b>.</p>
      <p>That's enough to jump the plug's 0.7&nbsp;mm gap through highly compressed mixture. The spark starts a flame front that spreads at about 20–40&nbsp;m/s.</p>
      <h4>Reading a plug</h4>
      <ul>
        <li><b>Tan / light brown</b>: healthy mixture.</li>
        <li><b>Black and sooty</b>: running rich (too much fuel).</li>
        <li><b>White, blistered</b>: running lean or too hot. Danger!</li>
      </ul>`
  },
  m_battery: {
    name: 'Battery', role: 'Stored energy for starting',
    zone: { x: 360, y: 178, r: 18 }, requires: [],
    hint: 'Under the front of the seat, above the airbox.',
    body: `
      <p>A small 12&nbsp;V battery, often <b>lithium-iron</b> on race bikes to save weight, powers the electric starter and steadies the electrical system.</p>
      <p>Once the engine runs, the stator recharges it.</p>
      <p>Some bikes with only a kick-starter have no battery at all. The stator alone powers the ignition, which is why kicking them hard is enough to start them.</p>`
  },
  m_starter: {
    name: 'Electric Starter', role: 'Spins the engine to life',
    zone: { x: 500, y: 330, r: 16 }, requires: ['m_battery'],
    hint: 'A small motor tucked behind the cylinder, on top of the crankcase.',
    body: `
      <p>A powerful little DC motor (it draws about 100+&nbsp;amps for a moment) spins the crankshaft through reduction gears. A <b>one-way (sprag) clutch</b> lets the engine overrun the starter once it fires.</p>
      <h4>Safety interlock</h4>
      <p>The starter only works with the bike in <b>neutral</b> or with the <b>clutch lever pulled in</b>. Otherwise, cranking the engine would drive the bike forward through the gearbox. You'll meet this rule when you ride.</p>
      <div class="callout"><b>Kick-start alternative:</b> a kick-starter does the same job with your leg. Many enduro bikes carry both, as a backup.</div>`
  },

  /* ===================== CHAPTER 6: EXHAUST & COOLING ===================== */
  m_header: {
    name: 'Exhaust Header', role: 'Gets burnt gas out, and helps the engine breathe',
    zone: { x: 618, y: 300, r: 24 }, requires: [],
    hint: 'Pipe from the front of the cylinder head, curving down and back.',
    body: `
      <p>Exhaust leaves the head at around <b>700–900&nbsp;°C</b>. Headers glow cherry red at night when ridden hard, and the blue-gold tint is heat colouring on the metal.</p>
      <p><b>Tuned length:</b> each time the exhaust valve opens, a pressure pulse races down the pipe and a wave reflects back. Get the length right and a low-pressure wave arrives just as the valves overlap, <b>sucking</b> the cylinder clean and pulling fresh mixture in. Header length and diameter shape where the engine makes power.</p>
      <div class="callout moto"><b>Two-strokes</b> take this further. Their fat, bulging <b>expansion chamber</b> bounces a pressure wave back to push escaping fresh mixture back into the cylinder.</div>`
  },
  m_muffler: {
    name: 'Silencer (Muffler)', role: 'Quietens the bang and stops sparks',
    zone: { x: 300, y: 225, r: 26 }, requires: ['m_header'],
    hint: 'The big canister running up alongside the subframe.',
    body: `
      <p>Inside is a perforated core wrapped in <b>packing</b> (fibreglass or steel wool). Sound waves pass through the holes and lose energy in the packing, while the gas flows straight through with little restriction.</p>
      <p>Most tracks and trails have noise limits (often 94–96&nbsp;dB). Packing burns away over time, so the bike gets louder and you need to <b>repack</b> it.</p>
      <p>The <b>spark arrestor</b> is a screen in the end cap that catches glowing carbon particles. It's required in many forests to prevent wildfires.</p>`
  },
  m_radiator: {
    name: 'Radiators', role: 'Throw away the heat the engine can\'t use',
    zone: { x: 622, y: 258, r: 26 }, requires: [],
    hint: 'Finned panels beside the down tube, behind where the shrouds will go.',
    body: `
      <p>Only about 30% of the fuel's energy turns into motion. Roughly as much again soaks into the cylinder and head as heat, and without cooling it would melt the piston in minutes.</p>
      <p><b>Coolant</b> (water plus glycol antifreeze) flows through thin tubes. Air passing over the fins between them carries the heat away. Dirt bikes have <b>two</b> radiators, one each side, protected by louvres and guards.</p>
      <p>The <b>pressure cap</b> holds about 1.1&nbsp;bar, which raises coolant's boiling point from 100&nbsp;°C to about 120&nbsp;°C.</p>
      <div class="callout"><b>Airflow is everything.</b> Riding fast pushes plenty of air through. Crawling up a rocky trail at walking pace with the engine working hard is when bikes overheat, so many enduro bikes add an electric <b>fan</b>.</div>`
  },
  m_hoses: {
    name: 'Water Pump & Hoses', role: 'Keeps the coolant circulating',
    zone: { x: 588, y: 340, r: 18 }, requires: ['m_radiator'],
    hint: 'Pump on the side of the crankcase, with hoses up to the radiator.',
    body: `
      <p>A small <b>impeller</b> (like a tiny propeller), geared to the engine, spins in a housing on the side of the crankcase. It pushes coolant up through the cylinder and head, out to the radiators, and back to the pump.</p>
      <p>A <b>thermostat</b> (fitted to some bikes) is a wax-filled valve that stays shut until the coolant reaches about 80&nbsp;°C. A cold engine warms up quickly, then the valve opens to let coolant through the radiators.</p>
      <div class="callout tip"><b>Never open a hot radiator cap.</b> The coolant is under pressure and above 100&nbsp;°C. The moment the pressure is released, it flashes into scalding steam.</div>`
  },

  /* ======================== CHAPTER 7: DRIVETRAIN ========================= */
  m_clutch: {
    name: 'Wet Multi-plate Clutch', role: 'Connects and disconnects the engine',
    zone: { x: 566, y: 384, r: 22 }, requires: [],
    hint: 'Behind the big round cover on the side of the crankcase.',
    body: `
      <p>Power path, step 1: a small gear on the crankshaft drives a big gear on the <b>clutch basket</b>. This is the <b>primary drive</b>, about a 3:1 reduction.</p>
      <p>Inside is a stack of plates. <b>Friction plates</b> are keyed to the basket, which is driven by the engine. They alternate with <b>steel plates</b> keyed to the inner hub, which goes to the gearbox. Strong springs squeeze the stack together, and friction locks the engine to the gearbox.</p>
      <p>Pull the lever and the springs are compressed. The plates separate and the engine spins freely.</p>
      <h4>The friction zone</h4>
      <p>Partway out, the plates <b>slip</b>: some torque gets through and the rest becomes heat. This is how you pull away from a stop (the engine can't turn at 0&nbsp;rpm) and how riders finesse power on slippery ground.</p>
      <p><b>"Wet"</b> means the clutch runs bathed in oil, which cools it and makes engagement smooth.</p>`
  },
  m_gearbox: {
    name: 'Gearbox', role: 'Keeps the engine in its power band at any speed',
    zone: { x: 492, y: 400, r: 18 }, requires: ['m_clutch'],
    hint: 'Inside the rear of the crankcase, behind the crankshaft.',
    body: `
      <p>Two shafts: the <b>mainshaft</b> (driven by the clutch) and the <b>countershaft</b> (the output). They carry five pairs of gears that are <b>always meshed</b> (a <b>constant-mesh</b> gearbox).</p>
      <p>In each pair, one gear spins freely on its shaft until a sliding gear next to it locks to it with <b>dogs</b>: chunky teeth on their sides. <b>Shift forks</b> do the sliding, guided by grooves in a rotating <b>shift drum</b>.</p>
      <h4>Why gears multiply torque</h4>
      <p>Power = torque × speed. A gear pair can't create power, but it can trade speed for torque. First gear turns the countershaft slowly with lots of torque, for pulling away and climbing. Fifth turns it fast with less torque, for top speed.</p>
      <p>The engine only makes good power from about 6,000–12,000&nbsp;rpm, while the wheel has to go from 0 to over 1,000&nbsp;rpm. The gearbox bridges that gap.</p>`
  },
  m_front_sprocket: {
    name: 'Countershaft Sprocket', role: 'Where power leaves the engine',
    zone: { x: 466, y: 368, r: 14 }, requires: ['m_gearbox'],
    hint: 'A small sprocket on the gearbox output, just in front of the swingarm pivot.',
    body: `
      <p>A small steel sprocket (about 13 teeth) on the end of the countershaft. This is where power finally leaves the engine cases.</p>
      <p>It sits right beside the <b>swingarm pivot</b> (remember Chapter 2?) so chain tension stays nearly constant as the suspension moves.</p>
      <div class="callout tip"><b>Gearing tip:</b> changing the front sprocket by one tooth changes overall gearing by about 7%. That's the same as changing the rear by 3–4 teeth.</div>`
  },
  m_rear_sprocket: {
    name: 'Rear Sprocket', role: 'The final reduction',
    zone: { x: 222, y: 380, r: 22 }, requires: [],
    hint: 'Bolts to the rear wheel hub.',
    body: `
      <p>A big sprocket (about 48 teeth) bolted to the rear hub, often aluminium to save weight; steel ones last longer.</p>
      <p><b>Final drive ratio</b> = rear ÷ front teeth = 48 ÷ 13 ≈ <b>3.7</b>. Combined with the primary drive (about 3.0) and first gear (about 2.6), the engine turns about <b>29 times</b> for every turn of the rear wheel.</p>
      <p>Racers swap sprockets to suit the track. More rear teeth gives harder acceleration but a lower top speed, which suits tight woods. Fewer teeth suits fast desert tracks.</p>`
  },
  m_chain: {
    name: 'Drive Chain', role: 'Carries the power to the rear wheel',
    zone: { x: 350, y: 372, r: 26 }, requires: ['m_front_sprocket', 'm_rear_sprocket'],
    hint: 'Loops between the two sprockets, along the swingarm.',
    body: `
      <p>A <b>520 O-ring chain</b> (5/8-inch pitch, 1/4-inch wide), the heavy-duty cousin of your bicycle chain. It can carry over 1,000&nbsp;Nm of torque at the rear wheel.</p>
      <p><b>Slack matters.</b> Dirt bikes run 30–50&nbsp;mm of play. As the swingarm moves through its arc, the distance between the sprockets changes slightly. A chain set too tight snaps taut at mid-travel and wrecks bearings, sprockets, and itself.</p>
      <p>A plastic <b>slider</b> on the swingarm and a <b>guide</b> near the rear sprocket stop the chain from sawing through the swingarm or jumping off.</p>
      <div class="callout"><b>The complete power path:</b> piston → crankshaft → primary gears → clutch → gearbox → countershaft sprocket → chain → rear sprocket → wheel → dirt. You've now built all of it.</div>`
  },

  /* ================== CHAPTER 8: CONTROLS & BODYWORK ===================== */
  m_throttle: {
    name: 'Throttle Twist-grip', role: 'Right hand: controls how much air gets in',
    zone: { x: 588, y: 96, r: 15 }, requires: [],
    hint: 'Slides onto the right end of the handlebar.',
    body: `
      <p>Twisting the grip pulls a cable that lifts the carb's slide (or opens a fuel-injection throttle valve). More air flows in, the carb adds matching fuel, and the engine makes more power.</p>
      <p>There are <b>two cables</b>: one pulls the throttle open, the other pulls it closed. A sticky cable can't jam it open, and a spring snaps it shut when you let go.</p>
      <div class="callout tip"><b>Riding tip:</b> off-road, smooth throttle control <b>is</b> traction. Snap the throttle open and the knobs tear the dirt loose. Roll it on gently and they bite.</div>`
  },
  m_clutch_lever: {
    name: 'Clutch Lever', role: 'Left hand: your engine connect/disconnect switch',
    zone: { x: 640, y: 128, r: 15 }, requires: [],
    hint: 'Mounts on the left side of the bars, with a cable down to the clutch cover.',
    body: `
      <p>The lever pulls a cable (or pushes a hydraulic line) that lifts the clutch's pressure plate against its springs.</p>
      <p><b>Pulled in</b> = disconnected, so the engine can spin while the bike stands still. <b>Let out</b> = connected.</p>
      <p>Good riders use one or two fingers and <b>feather</b> the lever in the friction zone: to pull away smoothly, to stop the engine stalling at very low speed, or to "pop" extra power over a log.</p>
      <div class="callout tip"><b>Free play:</b> the lever needs a few millimetres of slack before it starts to work. With none, the clutch is always slightly pulled and will slip and burn.</div>`
  },
  m_shifter: {
    name: 'Gear Shift Lever', role: 'Left foot: clicks through the gears',
    zone: { x: 512, y: 396, r: 14 }, requires: [],
    hint: 'A lever on the left side of the engine, just in front of the footpeg.',
    body: `
      <p>Each press or lift turns the <b>shift drum</b> inside the gearbox one notch. It's <b>sequential</b>: you can't skip gears.</p>
      <p>The pattern is <b>1–N–2–3–4–5</b>. Press <b>down</b> for first, then <b>lift up</b> for each higher gear. <b>Neutral</b> hides as a half-click between 1st and 2nd.</p>
      <p>The tip folds back on a spring if you hit a rock or crash.</p>`
  },
  m_seat: {
    name: 'Seat', role: 'Long and flat so you can move around',
    zone: { x: 420, y: 160, r: 26 }, requires: [],
    hint: 'Runs from the top of the tank all the way back along the subframe.',
    body: `
      <p>A dirt-bike seat is long, flat, and firm on purpose: the rider is always moving.</p>
      <ul>
        <li><b>Forward</b> (nearly on the tank) when cornering puts weight on the front tyre so it grips and steers.</li>
        <li><b>Back</b> when climbing or accelerating puts weight on the rear tyre for traction.</li>
      </ul>
      <p>A grippy cover helps you stay put. The seat lifts off to reach the air filter, battery, and ECU underneath.</p>`
  },
  m_plastics: {
    name: 'Fenders, Shrouds & Plates', role: 'Protection, airflow, and identity',
    zone: { x: 790, y: 232, r: 26 }, requires: [],
    hint: 'Start with the front fender over the front tyre.',
    body: `
      <p>Made of flexible <b>polypropylene</b>, so it bends in a crash instead of shattering.</p>
      <ul>
        <li><b>Front fender:</b> mounted high on the triple clamp so mud can't pack between it and the tyre and lock the wheel.</li>
        <li><b>Rear fender:</b> keeps mud off you and the airbox intake.</li>
        <li><b>Radiator shrouds:</b> guide air through the radiators and give your knees something to grip.</li>
        <li><b>Number plates:</b> for racing, and the side plates also protect the airbox.</li>
      </ul>
      <p><b>The bike is complete!</b> Every part you've placed has a job. Next: start it up and ride it.</p>`
  }
};

const CHAPTERS = [
  {
    id: 'ch1', num: 1, title: 'The Bicycle', subtitle: 'Where it all begins',
    scene: 'bicycle',
    parts: ['b_frame', 'b_fork', 'b_bars', 'b_rear_wheel', 'b_front_wheel', 'b_saddle', 'b_crankset', 'b_cassette', 'b_chain', 'b_brakes'],
    lab: 'gears',
    brief: `
      <p class="lead">A dirt bike is, at heart, a <b>bicycle with an engine bolted in</b>. Frame, steering, wheels, chain drive, gears, brakes: every one of these started on bicycles. So that's where we'll start.</p>
      <h4>How to play</h4>
      <ol>
        <li><b>Drag</b> each part from the parts bin onto the right dashed slot on the blueprint. On a touchscreen you can also tap a part, then tap the slot.</li>
        <li>Some parts mount <b>onto</b> others, so <b>build order</b> matters. You can't fit a chain until there's something for it to go around.</li>
        <li>Every part you fit opens a <b>workshop card</b> explaining how it works. Read them: the quizzes are built from them.</li>
        <li>Stuck? Press <b>Hint</b>.</li>
        <li>After building, test your understanding in the <b>Lab</b>, then pass the <b>Quiz</b> to unlock the next chapter.</li>
      </ol>
      <p>By Chapter 9 you'll have built a complete four-stroke dirt bike, and you'll ride it.</p>`,
    quiz: [
      { q: 'Why are bicycle frames made of triangles?', options: ['Triangles look sporty', 'A triangle can\'t change shape, so loads become push/pull along the tubes instead of bending them', 'Triangles are cheaper to weld', 'To leave room for a water bottle'], answer: 1, explain: 'A triangle is rigid: loads on its corners only push or pull along the tubes, and tubes are very strong that way.' },
      { q: 'You shift onto the biggest cog on the cassette. What happens?', options: ['Pedalling gets easier, but you go less far per pedal turn', 'Pedalling gets harder, but faster', 'Nothing changes', 'The chain gets tighter so you go faster'], answer: 0, explain: 'Ratio = chainring ÷ cog. A bigger cog means a lower ratio: easier to push, less speed per turn. That\'s your climbing gear.' },
      { q: 'What makes the front wheel steer itself straight, so you can ride no-handed?', options: ['Trail: the tyre touches the ground behind the steering axis, like a trolley caster', 'The front tyre is heavier', 'The chain pulls it straight', 'A gyroscope inside the hub'], answer: 0, explain: 'The steering axis meets the ground ahead of the tyre\'s contact patch, so the tyre trails behind it and self-centres.' },
      { q: 'When you brake, where does your movement energy go?', options: ['Into a battery', 'It becomes heat in the pads and rim', 'Back into your legs', 'It disappears'], answer: 1, explain: 'Brakes are heat machines: friction turns movement energy (½mv²) into heat.' },
      { q: 'Why do bikes (and motorbikes) need gears at all?', options: ['To look technical', 'Legs (and engines) make good power only in a narrow speed range, and gears keep them there at any road speed', 'To make the chain last longer', 'Gears add power'], answer: 1, explain: 'Gears trade speed for force so the "engine" (you!) can stay in its sweet spot, or power band.' }
    ]
  },
  {
    id: 'ch2', num: 2, title: 'Rolling Chassis', subtitle: 'A bicycle, super-sized',
    scene: 'dirtbike',
    parts: ['m_frame', 'm_swingarm', 'm_shock', 'm_fork', 'm_bars', 'm_rear_wheel', 'm_front_wheel', 'm_front_brake', 'm_rear_brake', 'm_footpegs'],
    lab: 'chassis',
    brief: `
      <p class="lead">Your bicycle weighs 12&nbsp;kg and tops out around 40&nbsp;km/h. A dirt bike weighs about <b>110&nbsp;kg</b>, goes over <b>100&nbsp;km/h</b>, and flies 20&nbsp;metres off jumps.</p>
      <p>Movement energy rises with mass and with speed <i>squared</i>, so a dirt bike carries roughly <b>100 times</b> more energy than your bicycle. Every part has to be beefed up.</p>
      <h4>What changes</h4>
      <ul>
        <li><b>Frame</b>: stronger, and it has to cradle an engine.</li>
        <li><b>Suspension</b>: the rigid back end becomes a pivoting <b>swingarm</b> with a <b>shock</b>, and the fork gets springs and dampers. About 300&nbsp;mm of travel at each end.</li>
        <li><b>Brakes</b>: cables and rim pads become <b>hydraulic discs</b>.</li>
        <li><b>Wheels</b>: tougher, knobbly, and a tall 21-inch front.</li>
        <li><b>Pedals</b> are gone. <b>Footpegs</b> replace them, because an engine is coming to do the pushing.</li>
      </ul>
      <p>We're starting on a fresh blueprint. Notice how many bicycle ideas you'll recognise.</p>`,
    quiz: [
      { q: 'Why does suspension need a damper as well as a spring?', options: ['A spring alone keeps bouncing after a bump; the damper soaks up that motion', 'The damper holds up the bike\'s weight', 'Dampers make the bike lighter', 'To make every bump feel softer'], answer: 0, explain: 'Springs store and return energy. Dampers turn that motion into heat, so the bike settles instead of pogoing.' },
      { q: 'The master cylinder piston is small and the caliper pistons are big. What does that do?', options: ['Less force at the pads', 'More clamping force at the pads, but the pads move less', 'Fluid flows faster to the pads', 'Nothing: hydraulics can\'t multiply force'], answer: 1, explain: 'Same pressure everywhere; force = pressure × area. Bigger caliper area means more force, with less movement.' },
      { q: 'Why is the swingarm pivot right next to the front sprocket?', options: ['So chain tension barely changes as the suspension moves', 'To make the bike longer', 'To cool the chain', 'It just looks good'], answer: 0, explain: 'If the pivot and sprocket share almost the same centre, the distance between the sprockets hardly changes as the arm swings.' },
      { q: 'Why does a dirt bike use a tall 21-inch front wheel?', options: ['It rolls over rocks and ruts more easily', 'It\'s faster on tarmac', 'It holds more air for jumps', 'It\'s needed to fit the brake'], answer: 0, explain: 'A larger wheel meets an obstacle at a gentler angle, so it rolls over instead of slamming into it.' },
      { q: 'If you lock up one wheel off-road, which is more forgiving?', options: ['The front', 'The rear', 'They\'re the same', 'Neither ever locks'], answer: 1, explain: 'A locked rear slides and can be recovered. A locked front loses steering and usually means a crash.' }
    ]
  },
  {
    id: 'ch3', num: 3, title: 'The Heart', subtitle: 'The four-stroke engine',
    scene: 'dirtbike',
    parts: ['m_crankcase', 'm_cylinder', 'm_head', 'm_oil'],
    lab: 'fourstroke',
    brief: `
      <p class="lead">On your bicycle, <b>you</b> were the engine: legs pushing cranks. Now we replace you with a <b>single-cylinder four-stroke</b>, the engine in most modern dirt bikes.</p>
      <p>It burns a tiny puff of fuel and air above a piston. The pressure shoves the piston down, and a crankshaft turns that push into rotation, exactly like your pedals.</p>
      <h4>The four strokes ("suck, squeeze, bang, blow")</h4>
      <ol>
        <li><b>Intake</b>: piston moves down, intake valves open, and fuel and air are drawn in.</li>
        <li><b>Compression</b>: valves shut and the piston rises, squeezing the mixture to about 1/13 of its volume.</li>
        <li><b>Power</b>: a spark ignites it, and the pressure (over 60&nbsp;bar) drives the piston down.</li>
        <li><b>Exhaust</b>: exhaust valves open and the rising piston pushes out the burnt gas.</li>
      </ol>
      <p>Four strokes take <b>two full turns</b> of the crank. Only one of them makes power.</p>
      <div class="callout moto"><b>Two-strokes</b> fit all four jobs into a single revolution, using ports in the cylinder wall instead of valves. They're lighter and punchier but thirstier and dirtier. You'll still see them on trail and enduro bikes.</div>`,
    quiz: [
      { q: 'What is the correct order of the four strokes?', options: ['Intake, compression, power, exhaust', 'Compression, intake, exhaust, power', 'Power, intake, compression, exhaust', 'Intake, power, compression, exhaust'], answer: 0, explain: 'Suck, squeeze, bang, blow.' },
      { q: 'How many crankshaft revolutions does one complete four-stroke cycle take?', options: ['One', 'Two', 'Four', 'Half'], answer: 1, explain: 'Each stroke is half a revolution, so four strokes take two revolutions (720°).' },
      { q: 'Why do the camshafts turn at half crankshaft speed?', options: ['Each valve opens only once every two crank revolutions', 'To save fuel', 'Because the cam chain is loose', 'To make the engine quieter'], answer: 0, explain: 'One cycle = two crank turns = one valve opening, so the cam turns once per cycle.' },
      { q: 'What converts the piston\'s up-and-down motion into rotation?', options: ['The camshaft', 'The crankshaft and connecting rod', 'The clutch', 'The valves'], answer: 1, explain: 'The rod pushes an off-centre crankpin around in a circle, just like your legs on bicycle cranks.' },
      { q: 'What keeps a single-cylinder engine turning through the three strokes that don\'t make power?', options: ['The battery', 'The momentum of the heavy flywheel', 'The cam chain', 'The exhaust pressure'], answer: 1, explain: 'Flywheel mass stores energy from the power stroke and releases it during the other three.' }
    ]
  },
  {
    id: 'ch4', num: 4, title: 'Breathing In', subtitle: 'Fuel & air',
    scene: 'dirtbike',
    parts: ['m_airbox', 'm_carb', 'm_tank', 'm_fuel_line'],
    lab: 'mixture',
    brief: `
      <p class="lead">An engine is an <b>air pump</b> that burns fuel along the way. To make power it needs three things: <b>air</b>, <b>fuel</b> in the right proportion, and a <b>spark</b>.</p>
      <p>This chapter is about the first two. The path goes:</p>
      <p class="flow">Air → airbox → filter → carburettor (adds fuel) → intake valves → cylinder</p>
      <p>The right mixture is about <b>14.7 parts air to 1 part fuel by mass</b>. By volume that's roughly 9,000 litres of air for every litre of petrol.</p>
      <ul>
        <li><b>Too much fuel</b> (rich): sluggish, sooty, black smoke.</li>
        <li><b>Too little fuel</b> (lean): runs hot, and can melt a piston.</li>
      </ul>`,
    quiz: [
      { q: 'What does the throttle directly control?', options: ['Only the amount of fuel', 'The amount of air entering the engine; fuel is added to match', 'Spark timing', 'The gear ratio'], answer: 1, explain: 'The throttle is an air valve. The carb (or injection) adds fuel in proportion to the air.' },
      { q: 'How does a carburettor\'s venturi draw fuel in?', options: ['Fast-moving air has lower pressure, which sucks fuel up from the jet', 'A fuel pump pushes it', 'Gravity alone', 'The spark pulls it in'], answer: 0, explain: 'Bernoulli: air speeds up through the narrow venturi, its pressure drops, and fuel is drawn up out of the float bowl.' },
      { q: 'Your mixture is too lean (too much air). What\'s a likely symptom?', options: ['Black sooty plug and black smoke', 'Engine runs hot, the plug looks white, and the piston can seize', 'Engine runs perfectly', 'The battery drains'], answer: 1, explain: 'Lean mixtures burn hot and slow. A white plug is a warning sign.' },
      { q: 'Why does a cold engine need the choke?', options: ['Fuel condenses on cold metal instead of vaporising, so the mixture needs extra fuel', 'To make more power', 'To cool the engine down', 'To lean the mixture'], answer: 0, explain: 'Cold surfaces stop fuel from evaporating. The choke enriches the mixture until the engine warms up.' },
      { q: 'A clogged air filter makes the mixture...', options: ['Leaner', 'Richer', 'No different', 'Explosive'], answer: 1, explain: 'Less air gets through, but the same fuel is drawn in, so the mixture gets richer.' }
    ]
  },
  {
    id: 'ch5', num: 5, title: 'The Spark', subtitle: 'Ignition & electrics',
    scene: 'dirtbike',
    parts: ['m_stator', 'm_ecu', 'm_plug', 'm_battery', 'm_starter'],
    lab: 'ignition',
    brief: `
      <p class="lead">Fuel and air are squeezed in the cylinder. Now something has to light them, at <b>exactly</b> the right moment, up to 100 times a second.</p>
      <p class="flow">Magnets spin → stator makes current → ECU decides <i>when</i> → coil steps it up to 30,000&nbsp;V → spark plug fires</p>
      <p>We'll also fit the <b>battery</b> and <b>electric starter</b> that spin the engine to life. Pushing a button is easier than kicking!</p>
      <p>The big idea in this chapter: the flame takes time to spread, so the spark has to fire <b>before</b> the piston reaches the top. How early depends on how fast the engine is spinning.</p>`,
    quiz: [
      { q: 'Why does the spark fire before the piston reaches top dead centre?', options: ['The flame takes time to spread, so firing early makes peak pressure arrive just after TDC', 'To push the piston backwards', 'Because the plug is slow to heat', 'It doesn\'t; it fires at bottom dead centre'], answer: 0, explain: 'Burning takes a set time. Firing early lines up peak pressure with the moment the piston can best use it.' },
      { q: 'How does the stator generate electricity?', options: ['A chemical reaction', 'Magnets on the spinning flywheel move past copper coils, inducing a current', 'Friction', 'Solar power'], answer: 1, explain: 'Faraday\'s law: a changing magnetic field pushes current through the coils.' },
      { q: 'Why must the bike be in neutral (or the clutch pulled) to use the starter?', options: ['Otherwise the starter would drive the bike forward through the gearbox', 'To save the battery', 'To lubricate the engine', 'There\'s no reason'], answer: 0, explain: 'It\'s a safety interlock: in gear with the clutch out, the crank is connected to the rear wheel.' },
      { q: 'What does the ignition coil do?', options: ['Stores fuel', 'Steps a low voltage up to tens of thousands of volts to jump the plug gap', 'Cools the plug', 'Measures rpm'], answer: 1, explain: 'It\'s a transformer: few turns in, tens of thousands of turns out.' },
      { q: 'At higher rpm, ignition timing should be...', options: ['More advanced (fire earlier)', 'More retarded (fire later)', 'Exactly the same', 'Switched off'], answer: 0, explain: 'The piston moves further during the burn time at high rpm, so the spark must fire earlier.' }
    ]
  },
  {
    id: 'ch6', num: 6, title: 'Breathing Out', subtitle: 'Exhaust & cooling',
    scene: 'dirtbike',
    parts: ['m_header', 'm_muffler', 'm_radiator', 'm_hoses'],
    lab: 'cooling',
    brief: `
      <p class="lead">Burning fuel makes far more <b>heat</b> than motion. Out of every 100 units of fuel energy, very roughly:</p>
      <ul>
        <li>about <b>30</b> push the bike along,</li>
        <li>about <b>35</b> blast out of the exhaust,</li>
        <li>about <b>30</b> soak into the cylinder and head and must be carried away by coolant,</li>
        <li>and a few go into friction and noise.</li>
      </ul>
      <p>This chapter builds the two escape routes: the <b>exhaust</b>, which also shapes how the engine breathes, and the <b>cooling system</b>.</p>`,
    quiz: [
      { q: 'Roughly how much of the fuel\'s energy actually moves the bike?', options: ['About 90%', 'About 25–30%; most becomes heat', 'Exactly 50%', '100%'], answer: 1, explain: 'Engines are heat engines, and most of the energy leaves as heat through the exhaust and coolant.' },
      { q: 'Why does a dirt bike overheat more easily on a slow, tight trail?', options: ['Little air flows through the radiators while the engine works hard', 'The fuel is colder', 'The chain is tighter', 'Radiators only work in the rain'], answer: 0, explain: 'Radiators depend on airflow. Low speed with high load is the worst case, which is why fans help.' },
      { q: 'Why should you never open a hot radiator cap?', options: ['Pressurised coolant above 100 °C can flash into steam and scald you', 'It voids the warranty', 'The cap is glued on', 'Air escapes'], answer: 0, explain: 'The pressure keeps the coolant liquid above 100 °C. Release it and the coolant boils instantly.' },
      { q: 'What is a spark arrestor for?', options: ['Making bigger sparks', 'Stopping glowing particles leaving the exhaust and starting fires', 'Increasing power', 'Charging the battery'], answer: 1, explain: 'A screen in the silencer catches hot carbon particles. It\'s required in many forests.' },
      { q: 'What does a thermostat do?', options: ['Keeps coolant out of the radiator until the engine is warm', 'Measures the outside temperature', 'Controls the spark', 'Adds coolant'], answer: 0, explain: 'It stays closed so a cold engine warms up quickly, then opens at about 80 °C.' }
    ]
  },
  {
    id: 'ch7', num: 7, title: 'Power to the Ground', subtitle: 'Clutch, gearbox & chain',
    scene: 'dirtbike',
    parts: ['m_clutch', 'm_gearbox', 'm_front_sprocket', 'm_rear_sprocket', 'm_chain'],
    lab: 'drivetrain',
    brief: `
      <p class="lead">The engine is spinning, but the rear wheel isn't. This chapter builds the path from crankshaft to dirt.</p>
      <p class="flow">Crankshaft → primary gears → clutch → gearbox → countershaft sprocket → chain → rear sprocket → wheel</p>
      <p>There are two problems to solve:</p>
      <ol>
        <li>An engine can't run at 0&nbsp;rpm, but the bike must start from standstill. That's the job of the <b>clutch</b>.</li>
        <li>The engine is happiest at 6,000–12,000&nbsp;rpm, but the wheel needs to go from 0 to over 1,000&nbsp;rpm. That's the job of the <b>gearbox</b>.</li>
      </ol>
      <p>Remember the bicycle's cassette? Same idea, inside a sealed box.</p>`,
    quiz: [
      { q: 'What does pulling the clutch lever do?', options: ['Locks the rear wheel', 'Separates the plates, disconnecting the engine from the gearbox', 'Changes gear', 'Shuts off the fuel'], answer: 1, explain: 'The lever lifts the pressure plate, the plates separate, and no torque passes through.' },
      { q: 'At the same engine rpm, how does 1st gear compare with 5th?', options: ['1st: more torque at the wheel, lower speed', '1st: less torque, more speed', 'They\'re the same', '5th always gives more torque'], answer: 0, explain: 'A low gear trades speed for torque.' },
      { q: 'What is the gear pattern on most dirt bikes?', options: ['1-2-3-4-5-N', '1-N-2-3-4-5', 'N-1-2-3-4-5, all up', 'An H-pattern like a car'], answer: 1, explain: 'Press down for 1st, lift for the rest. Neutral is a half-click between 1st and 2nd.' },
      { q: 'You fit a smaller front sprocket (fewer teeth). What happens?', options: ['Quicker acceleration, lower top speed', 'Higher top speed, slower acceleration', 'Nothing', 'The chain gets shorter, nothing else'], answer: 0, explain: 'Fewer front teeth raises the final drive ratio, so there\'s more torque at the wheel and less speed.' },
      { q: 'Why does slipping the clutch for too long cause problems?', options: ['Slipping turns energy into heat, which can overheat and wear the plates', 'It drains the battery', 'It stops the oil pump', 'It doesn\'t cause problems'], answer: 0, explain: 'In the friction zone, the difference in speed between the plates times the torque is turned into heat.' }
    ]
  },
  {
    id: 'ch8', num: 8, title: 'Controls & Bodywork', subtitle: 'Finishing touches',
    scene: 'dirtbike',
    parts: ['m_throttle', 'm_clutch_lever', 'm_shifter', 'm_seat', 'm_plastics'],
    lab: null,
    brief: `
      <p class="lead">Everything works. Now the rider needs a way to <b>control</b> it, plus some protection from flying mud.</p>
      <div class="controls-grid">
        <div><b>Right hand</b><br>Throttle twist-grip, front brake lever</div>
        <div><b>Left hand</b><br>Clutch lever</div>
        <div><b>Right foot</b><br>Rear brake pedal</div>
        <div><b>Left foot</b><br>Gear shift lever</div>
      </div>
      <p>The front brake and rear brake pedal went on with the chassis in Chapter 2. Now you'll fit the rest.</p>`,
    quiz: [
      { q: 'Why does the throttle have two cables?', options: ['One pulls it open and one pulls it closed, so it can\'t stick open', 'One is a spare', 'One controls the choke', 'One drives the speedometer'], answer: 0, explain: 'A push-pull design is a safety feature: the closing cable forces the throttle shut.' },
      { q: 'The clutch is on the ___, and the front brake on the ___.', options: ['Left hand / right hand', 'Right hand / left hand', 'Left foot / right foot', 'Right foot / left hand'], answer: 0, explain: 'Left hand: clutch. Right hand: throttle and front brake. Right foot: rear brake. Left foot: gears.' },
      { q: 'Why is a dirt-bike seat long and flat?', options: ['So the rider can shift their weight forward and back for grip', 'To carry a passenger', 'Fuel is stored inside it', 'For aerodynamics'], answer: 0, explain: 'Forward for steering grip in corners, back for rear traction on climbs.' },
      { q: 'What operates the gear shift lever?', options: ['Right foot', 'Left foot', 'Left thumb', 'Right hand'], answer: 1, explain: 'Left foot: press down for 1st, lift up for higher gears.' }
    ]
  },
  {
    id: 'ch9', num: 9, title: 'First Ride', subtitle: 'Put it all together',
    scene: 'dirtbike', parts: [], lab: null, ride: true,
    brief: `
      <p class="lead">Your dirt bike is complete. Time to ride it across a test track with hills, whoops, mud, and a steep descent.</p>
      <p>The simulation uses the same physics you've learned: a real torque curve, a slipping clutch, five gear ratios, a final drive, braking, and stalling.</p>
      <div class="controls-grid keys">
        <div><kbd>Enter</kbd> Starter (neutral or clutch in!)</div>
        <div><kbd>Space</kbd> Hold for clutch (lever in)</div>
        <div><kbd>W</kbd>/<kbd>↑</kbd> Throttle</div>
        <div><kbd>S</kbd>/<kbd>↓</kbd> Brakes</div>
        <div><kbd>E</kbd> Shift up</div>
        <div><kbd>Q</kbd> Shift down</div>
        <div><kbd>K</kbd> Kill switch</div>
      </div>
      <h4>How to pull away without stalling</h4>
      <ol>
        <li>Press <kbd>Enter</kbd> to start in neutral (N).</li>
        <li><b>Hold</b> <kbd>Space</kbd> to pull the clutch in, then tap <kbd>Q</kbd> for 1st gear.</li>
        <li>Hold a little throttle (<kbd>W</kbd>) to bring the revs up.</li>
        <li><b>Release</b> <kbd>Space</kbd>. The clutch lets out gradually through the friction zone.</li>
        <li>Shift up with <kbd>E</kbd> as the revs climb. Shift down with <kbd>Q</kbd> before steep hills.</li>
      </ol>
      <p>On a touchscreen, use the on-screen buttons.</p>`
  }
];

const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map(c => [c.id, c]));
const DIRT_PARTS = CHAPTERS.filter(c => c.scene === 'dirtbike').flatMap(c => c.parts);
