# The Bestiary — Curiosity-Driven Paper-App Studio

The second sister site to the [Instructor Study](https://buildlittleworlds.github.io/instructor-study/), beside [Trailheads](https://buildlittleworlds.github.io/paper-app-trailheads/). The Study demonstrates each week's idea; Trailheads marks paths from the idea into the students' own territories; **the Bestiary houses what comes back** — a natural history of every paper-app the cohort ships.

Each student app is accessioned as a *creature*: a binomial name and its translation, a plate (screenshot or field sketch), field notes (behaviors, diet, temperament, distinguishing marks), a live enclosure the visitor can wake, an authorship placard, a lineage, an open question, and the lesson it teaches — one of the course's Six Ideas, which are the museum's six halls.

**Planned live site:** `https://buildlittleworlds.github.io/paper-app-bestiary/` (repo `paper-app-bestiary`)

Full design rationale: `../bestiary-site-plan.md` in the parent course folder.

## Course boundary

- **A census, not a contest.** Every shipped creature belongs; nothing is ranked; the featured spot rotates deterministically by week; the docent deals tours at random.
- **Consent, always.** Accession requires the collector's okay; first names or field-names only; de-accession is immediate on request.
- **Nothing collected.** No page collects, exports, or aggregates anything a visitor does. Computed things (census counts, deals, filters) are clearly separated from authored things (entries, placards).
- **No new student work.** Every accession field maps from the paper layer students already write. The prose entry is an optional creative-writing move.

## Structure

```text
index.html            the museum: census, vitrines (predict-then-reveal), filters,
                      six halls, phylogeny wall, docent tours, names-off, lantern mode
specimen.html         one creature's page (?id=…): entry, field notes, live enclosure,
                      authorship placard, lineage, open question
data/bestiary.json    the collection — the only file that grows; newest row last
plates/               one image per specimen (screenshot .png or field-sketch .svg)
accession-desk.html   curator tool + the Nomenclator; composes a JSON row, stores nothing
tools/capture.mjs     local Playwright script that screenshots missing plates
```

## Accessioning a creature (~5 minutes)

1. The student ships and submits a URL in Classroom (already happens) and okays accession.
2. Open `accession-desk.html`, fill the file from the student's paper layer, deal a name from the Nomenclator if wanted, copy the row.
3. Paste the row as the **last** item of `specimens` in `data/bestiary.json` (the census reads the last row as the newest accession).
4. Add a plate: a screenshot, `cd tools && node capture.mjs`, or the student's own field sketch saved to `plates/<id>.png|svg` (update the row's `plate` path to match).
5. Commit, push. The creature stands in its hall.

De-accession: delete the row (and plate), push. Immediate, no ceremony.

## Founding specimens

Three curator demonstrations (the Map of Meaning, the Garden of Forking Sentences, the Attention Spotlight) hang so the halls are never bare and so students can see a finished placard before writing their own. They are labeled as founding specimens everywhere they appear; the cohort's creatures are the collection.

## Preview & deploy

`index.html` and `specimen.html` fetch `data/bestiary.json`, so preview over HTTP — from this folder:

```text
python3 -m http.server 8000
```

Deploy: create the GitHub repo, push, enable Pages (main branch root). Add `.nojekyll` before first deploy. Same recipe as the sisters.

Note: the live enclosures embed student GitHub Pages in iframes; they load only when a visitor taps the glass, and fall back to the plate ("currently in the field") if a site can't be woken.
