# Pedals to Pistons & Soapbox to Sports Car

Two browser games that teach how vehicles work by having you **build one**.

- **Pedals to Pistons** (`index.html`): start with a bicycle, add one system per
  chapter until you have a four-stroke dirt bike, then ride it.
- **Soapbox to Sports Car** (`car.html`): start with a soapbox cart, add one
  system per chapter until you have a front-engined, rear-drive roadster, then
  drive it round a test road with a hill start and a speed camera.

## Play

There's no build step and nothing to install. Open `index.html` (bike) or
`car.html` (car) in a browser:

```sh
# either just open the file…
open index.html            # macOS
xdg-open index.html        # Linux

# …or serve the folder
python3 -m http.server 8000   # then visit http://localhost:8000
```

Progress is saved in your browser's `localStorage`.

## What's inside: Pedals to Pistons

| # | Chapter | You build | Lab |
|---|---------|-----------|-----|
| 1 | The Bicycle | frame, fork, bars, wheels, saddle, cranks, cassette, chain, brakes | **Gear ratios**: chainring vs cog, cadence, hill effort |
| 2 | Rolling Chassis | cradle frame, swingarm, shock, USD forks, 21"/18" wheels, hydraulic discs, footpegs | **Suspension** (spring/damper quarter-bike model) and a **hydraulic brake designer** |
| 3 | The Heart | crankcase & crank, cylinder & piston, head & valvetrain, oil system | **Four-stroke engine**: animated cutaway with cams, valve-lift chart, manual spark timing |
| 4 | Breathing In | airbox & filter, carburettor, tank, petcock | **Carburettor jetting**: choke, cold start, main jet, AFR, clogged filter |
| 5 | The Spark | stator/flywheel, ECU, coil & plug, battery, starter | **Ignition timing**: cylinder-pressure curve, advance vs rpm, knock |
| 6 | Breathing Out | header, silencer, radiators, pump & hoses | **Cooling**: thermostat, airflow, fan, low coolant |
| 7 | Power to the Ground | clutch, gearbox, sprockets, chain | **Clutch & gearbox**: see-through drivetrain with slip, stalling, 1-N-2-3-4-5 |
| 8 | Controls & Bodywork | throttle, clutch lever, shifter, seat, plastics | — |
| 9 | First Ride | — | Physics-based ride over hills, whoops, mud, and descents |

Every part opens a **workshop card** explaining what it does and how it works,
with notes comparing it to the bicycle version and a mechanic's tip. Each
chapter ends with a quiz; missed questions come back until you get them right.

## What's inside: Soapbox to Sports Car

| # | Chapter | You build | Lab |
|---|---------|-----------|-----|
| 1 | The Soapbox | plank chassis, axles, wheels, seat, steering, friction brake | **Steering geometry**: centre-pivot vs parallel vs Ackermann |
| 2 | Shell & Suspension | monocoque, double-wishbone and multi-link suspension, wheels, anti-roll bars, rack and pinion | **Suspension** (quarter-car) |
| 3 | Brakes | servo and master cylinder, lines, discs, handbrake, ABS | **Brake designer** and an **ABS** slip/grip simulation |
| 4 | The Engine | inline-4 block, pistons, DOHC head, timing belt, sump | **Four-stroke cutaway** and **firing order** |
| 5 | Fuel & Air | tank, pump, intake and MAF, injectors, ECU | **Fuel injection**: closed loop, fuel trim, leaks, cold start |
| 6 | Electrics & Spark | battery, alternator, starter, coil packs, fuses | **Ignition timing** |
| 7 | Cooling & Exhaust | radiator and fan, pump and thermostat, manifold, catalytic converter, silencer | **Cooling** |
| 8 | Drivetrain | clutch, six-speed gearbox, propshaft, differential, CV joints | **Clutch & H-pattern gearbox** and a **differential** lab |
| 9 | Controls & Body | pedals, gear lever, dash, seats, body panels | — |
| 10 | Test Drive | — | Hill start at a STOP line, a 50 zone with a camera, a long climb |

### Ride controls

`Enter` start · hold `Space` clutch · `W`/`↑` throttle · `S`/`↓` brake ·
`Q`/`E` shift down/up · `K` kill switch. Touch devices get on-screen buttons.
In the car, `1`–`6` and `N` pick a gear directly (H-pattern).

The ride uses the same drivetrain model as the Chapter 7 lab (`js/physics.js`):
a torque curve, an idle circuit, a slip/lock clutch with heat build-up, five
gear ratios plus primary and final drive, aerodynamic and rolling drag, and
brakes. Dump the clutch at idle and you'll stall; lug 5th up a hill and you'll
stall; hold the clutch in the friction zone too long and it overheats.

## Code layout

```
index.html, car.html   one page per game
css/style.css
js/artkit.js       shared SVG helpers (1000×600 coordinate space, z-layers)
js/physics.js      engine → clutch → gearbox → wheel model (BIKE and CAR parameters)
js/labs.js         shared labs and lab factories (suspension, brakes, cooling, drivetrain…)
js/ride.js         the side-scrolling ride/drive, configured per game
js/app.js          screens, drag-and-drop building, quiz flow, progress (reads GAME)
js/art.js          bike artwork        js/car/art.js      car artwork
js/content.js      bike parts, chapters, quizzes, GAME config
js/car/content.js  car parts, chapters, quizzes, GAME config
js/car/labs.js     car-only labs (steering, ABS, firing order, EFI, differential)
```

These are plain scripts (no modules), so the game also runs straight from
`file://`.
