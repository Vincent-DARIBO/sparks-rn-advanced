# Mesures du Module 4

Périmètre mesuré : `src/features/*/services/**/*.ts` (`IsbnService`, `LibraryService`). Les services transverses `src/services/` (`OpenLibraryService`, `ScanFeedbackService`) sont testés mais hors cible Stryker, conformément au glob du guide.

## Couverture Jest et score de mutation

| Mesure | Avant (commit `chore(m4): configuration de Stryker`) | Après (commit `test(m4): tue les mutants survivants`) |
| --- | --- | --- |
| Tests Jest | 59 | 62 |
| Couverture lignes / instructions / fonctions | 100 % | 100 % |
| Couverture branches | 95,23 % (`IsbnService.ts` ligne 16 : 94,11 %) | 100 % |
| Score de mutation total | 96,23 % | 97,17 % |
| `IsbnService.ts` | 95,24 % (4 survivants) | 96,43 % (3 survivants) |
| `LibraryService.ts` | 100 % | 100 % |
| Mutants générés | 106 | 106 |
| Tués / timeout / survivants | 73 / 29 / 4 | 76 / 27 / 3 |

Durée d'un run Stryker : environ 3 minutes (9 processus de test).

## Mutant survivant le plus instructif

`src/features/scan/services/IsbnService.ts:16`

```
-  const value = char === 'X' ? 10 : Number(char);
+  const value = false ? 10 : Number(char);
```

Avant : aucun test n'utilisait un ISBN-10 terminé par `X`. La ligne était exécutée (couverture lignes à 100 %), mais la branche `X` ne l'était jamais : seule la couverture de branches (94,11 % sur ce fichier) le laissait deviner. Les mutants `false ? 10` et `char === ""` survivaient tous les deux. Le mutant montre qu'une couverture de lignes à 100 % ne prouve pas que le comportement est vérifié.

Tué par `080442957X` (valide) et `080442958X` (clé fausse), plus `isValid` avec `0-8044-2957-x` (minuscule, tirets).

## Mutants équivalents restants (3)

Aucun test ne peut les tuer : le comportement observable est identique.

- `IsbnService.ts:17` `sum += …` devenu `sum -= …` : la somme change de signe, `-sum % 11 === 0` équivaut à `sum % 11 === 0`.
- `IsbnService.ts:26` même mutation pour l'ISBN-13 (`-sum % 10 === 0`).
- `IsbnService.ts:34` `if (isbn.length === 13)` remplacé par `if (true)` : `isValidIsbn13` revérifie `^\d{13}$` et retourne `false` pour toute autre longueur, la garde est redondante.

Ce dernier était classé tué au premier run et survivant au second, sans test modifié qui l'explique (cause non élucidée, probablement un timeout lié à la charge machine) ; il est logiquement équivalent. Le gain réel est donc les 2 mutants de la ligne 16 ; les 3 survivants restants sont équivalents.

## Reproduire

```bash
npm install
npm test
npx jest --coverage --collectCoverageFrom='src/features/*/services/**/*.ts' --collectCoverageFrom='!**/__tests__/**'
npm run test:mutation
```

Rapport HTML : `reports/mutation/index.html` (ignoré par git, comme `.stryker-tmp/`).

Pour retrouver l'état « avant » : `git checkout <commit chore(m4): configuration de Stryker>` puis `npm run test:mutation`.
