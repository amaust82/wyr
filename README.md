# Would You Rather?

A swipeable "would you rather" card game. Read a question out loud, swipe left or right to move to the next one. Built for playing verbally in a group — no accounts, no backend, just a deck of 100 questions.

Behind the scenes, most questions are tagged toward an MBTI dichotomy (E/I, S/N, T/F, J/P) — the wording stays playful and kid-friendly, never clinical.

## Duel Mode

Toggle **Duel Mode** in the header to track choices as you swipe: swiping left counts toward the left-hand letter of a question's dichotomy, swiping right counts toward the right-hand letter. A small live bar shows the running lean for each of the four pairs. Untagged "just for fun" questions never affect the tally.

## Running it

No build step — it's plain HTML/CSS/JS. Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the site to GitHub Pages automatically.
