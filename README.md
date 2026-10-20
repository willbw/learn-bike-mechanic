# Pedals to Pistons

A browser game that teaches how a motorcycle works by having you **build one**.
You start with a bicycle, everything a motorbike inherited from it. Then you
add one system per chapter until you have a four-stroke dirt bike, and then
you ride it.

## Play

There's no build step and nothing to install. Open `index.html` in a browser:

```sh
# either just open the file…
open index.html            # macOS
xdg-open index.html        # Linux

# …or serve the folder
python3 -m http.server 8000   # then visit http://localhost:8000
```

Progress is saved in your browser's `localStorage`.

## What's inside

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

### Ride controls

`Enter` start · hold `Space` clutch · `W`/`↑` throttle · `S`/`↓` brake ·
`Q`/`E` shift down/up · `K` kill switch. Touch devices get on-screen buttons.

The ride uses the same drivetrain model as the Chapter 7 lab (`js/physics.js`):
a torque curve, an idle circuit, a slip/lock clutch with heat build-up, five
gear ratios plus primary and final drive, aerodynamic and rolling drag, and
brakes. Dump the clutch at idle and you'll stall; lug 5th up a hill and you'll
stall; hold the clutch in the friction zone too long and it overheats.

## Code layout

```
index.html
css/style.css
js/art.js       SVG artwork for every part (shared 1000×600 coordinate space, z-layers)
js/content.js   parts (cards, drop zones, prerequisites), chapters, briefs, quizzes
js/physics.js   engine → clutch → gearbox → wheel model
js/labs.js      the seven interactive labs (canvas)
js/ride.js      the final ride
js/app.js       screens, drag-and-drop building, quiz flow, progress
```

These are plain scripts (no modules), so the game also runs straight from
`file://`.
