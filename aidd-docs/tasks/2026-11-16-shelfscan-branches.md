# Plan: branches de correction ShelfScan (formation React Native avancé, 2 jours)

## Context

La formation « React Native avancé » s'appuie sur un projet fil rouge, ShelfScan : scanner l'ISBN d'un livre, afficher sa fiche Open Library, conserver sa bibliothèque hors ligne. Les supports (cahier élève, guide formateur, slides) annoncent un repo avec un starter volontairement naïf sur `main` et une branche de correction par atelier.

Aujourd'hui le repo ne contient que le template Expo vide (`App.js`, pas de TypeScript, pas d'Expo Router). Tout est à construire : le starter, puis les branches.

### Décisions validées

| Sujet | Décision |
| --- | --- |
| Starter | À construire sur `main`, en suivant ce que décrit le support de cours (structure à plat, défauts volontaires) |
| Style des corrections | Conventions personnelles : service + `AppError`, hook, composant, `export default function`, aucun commentaire |
| Conflit guide / conventions | Chemins et signatures du guide quand c'est compatible, sinon les conventions priment (un hook par fichier) |
| Version | Expo SDK 58 / RN 0.88 / React 19.3 conservés ; les écarts avec les supports (SDK 57) sont consignés |
| Gestionnaire de paquets | npm : `bun.lock` remplacé par `package-lock.json` |
| Plateformes | Android et iOS fonctionnels (Kotlin et Swift pour les deux modules natifs) |
| Vérification | Par branche : typecheck, lint, tests, build natif, parcours sur émulateur Android et simulateur iOS |
| EAS | Fichiers de configuration uniquement ; rien n'est lancé sur le compte Expo ; aucun push |
| Bonus | Toujours sur une branche `bonus/*` à part, jamais fusionnée dans une `solution/*` |
| `solution/m4` | État final : mutants survivants tués |
| Historique | Un commit par étape d'atelier |
| `appId` | `com.formation.shelfscan` |

## Approach

### Règles transverses

- Avant tout code touchant une API Expo, React Native ou une librairie native : lire la doc de la version installée (docs Expo v58, Vision Camera v5, FlashList v2, MMKV, TanStack Query v5, MSW, Stryker). Les extraits du guide datent du SDK 57 et ne sont pas recopiés sans vérification.
- Installation des dépendances avec `npx expo install` pour obtenir des versions compatibles SDK 58.
- `android/` et `ios/` restent générés (CNG) et ignorés par git.
- Chaque branche part de la précédente : `main` → `solution/m1` → … → `solution/m7`.
- Écriture du code déléguée à des agents Sonnet, relue avant acceptation.
- Tout écart constaté avec les supports est noté dans `aidd-docs/ecarts-supports.md` (commande qui a changé, API renommée, numéro de version).

### Étape 0 : socle du repo (sur `main`)

1. Passer à npm : supprimer `bun.lock`, générer `package-lock.json`.
2. Migrer le template : TypeScript strict, Expo Router (`src/app/`), alias `@/`, `expo-dev-client`, ESLint Expo.
3. `app.json` : nom ShelfScan, `android.package` et `ios.bundleIdentifier` à `com.formation.shelfscan`.
4. `eas.json` avec les profils `development` et `production` (le profil `preview` arrive en M7).
5. Jest avec le preset `jest-expo`.
6. `README.md` : prérequis, commandes, liste des branches.

### Étape 1 : starter naïf (`main`)

Structure à plat, conforme à la section 2 du guide :

- `src/app/` : onglets Scan, Recherche, Bibliothèque, plus la route `book/[isbn]`.
- Écran Scan : champ « Saisir un ISBN » et bouton « Rechercher », sans caméra.
- Écran Détail : `fetch` dans un `useEffect`, bouton « Ajouter à ma bibliothèque ».
- Écran Recherche : recherche par titre, 20 résultats, sans pagination.
- Écran Bibliothèque : `FlatList` de 500 livres, `<Image>` de React Native en taille `-L`, tri.
- `src/api/openLibrary.ts` : fonctions `fetch` brutes.
- `src/utils/isbn.ts` : validation ISBN-10/13, appelée directement depuis le composant.
- `src/data/books.seed.json` : 500 vrais ISBN récupérés une fois sur Open Library, puis figés.
- Un seul test trivial.
- `console.log` répartis dans le code.

Défauts volontaires à garantir, car les ateliers M5 et M6 reposent dessus :

- `renderItem` défini inline, objet `style` recréé à chaque rendu, tri calculé dans le rendu, `BookRow` qui reçoit l'objet livre entier, `onPress` recréé à chaque rendu.
- État « favori » local (`useState`) dans chaque ligne, qui produira le bug de recyclage en M6.
- Validation ISBN-10 qui traite le `X` final, pour que le mutant correspondant existe en M4.

### Étape 2 : `solution/m1`

- `src/components/RuntimeInfo.tsx` : Hermes actif, version, Fabric actif ; affiché dans l'écran Bibliothèque.
- Logique de lecture du runtime dans un hook `useRuntimeInfo`.

### Étape 3 : `solution/m2`

Atelier 2a, Turbo Module local :

- `modules/scan-feedback` généré avec `create-react-native-library --local`.
- Spec `NativeScanFeedback.ts` : `vibrate(durationMs): Promise<void>` et `getDeviceModel(): string`.
- Implémentation Kotlin et Swift.
- Permission `VIBRATE` dans `app.json` (`android.permissions`).
- `getDeviceModel()` affiché dans `RuntimeInfo`, `vibrate(80)` derrière « Rechercher ».

Atelier 2b, scan ISBN :

- Vision Camera v5 et son scanner de codes-barres, plugin dans `app.json`, textes de permission caméra iOS.
- Permission demandée à l'ouverture de l'écran Scan.
- Filtre EAN-13 commençant par 978 ou 979.
- Premier code valide : vibration, pause caméra, navigation vers le Détail.
- Saisie manuelle conservée en secours.

### Étape 4 : `debug/m2`

Issue de `solution/m2`, trois commits indépendants, un par panne :

1. `NAME` du module Kotlin renommé en `ScanFeedbackModule` : « could not be found ».
2. `vibrate(durationMs: Int, …)` au lieu de `Double` : échec de compilation.
3. Permission `VIBRATE` retirée de `app.json` : `SecurityException` visible dans `adb logcat`.

Vérification propre à cette branche : chaque panne est reproduite et son symptôme confirmé conforme au tableau du guide.

### Étape 5 : `solution/m3`

Atelier 3a :

- `src/lib/queryClient.ts`, `QueryClientProvider` dans `src/app/_layout.tsx`.
- `src/services/OpenLibraryService.ts` : classe, `try/catch`, DTO convertis en types métier, erreurs `AppError` (`BookNotFoundError`, `NetworkError`).
- Hooks partagés `useBook`, `usePrefetchBook` et factory `bookKeys` dans `src/hooks/`.
- `src/features/search/hooks/useSearchBooks.ts` en `useInfiniteQuery`, chargement en fin de liste.
- `useAddToLibrary` : mise à jour optimiste puis invalidation de `['library']`.
- Prefetch de la fiche au scan avant navigation.

Atelier 3b :

- `focusManager` sur `AppState`, `onlineManager` sur NetInfo.
- `PersistQueryClientProvider`, persister synchrone, MMKV ; `gcTime` égal à `maxAge` (7 jours).
- `setMutationDefaults` et `resumePausedMutations` pour la mutation d'ajout.
- Réorganisation en `src/features/{scan,book,search,library}` avec `components/`, `hooks/`, `screens/`, `services/`, `stores/`, `types/`.
- `src/utils/isbn.ts` devient `src/features/scan/services/IsbnService.ts`.
- `libraryStore` (Zustand) pour le tri et l'affichage.
- Contrôle des règles d'import : aucun import entre features.

### Étape 6 : `solution/m4`

Atelier 4a :

- Tests unitaires d'`IsbnService` (ISBN-10 et 13 valides, clé fausse, tirets, longueur incorrecte, `X` final).
- `jest.setup.ts` : mocks de ScanFeedback, MMKV, Vision Camera, démarrage du serveur MSW.
- `src/mocks/handlers.ts` et `src/mocks/server.ts` : fiche, recherche paginée, 404, 500.
- Helper `renderWithProviders` : `QueryClient` neuf par test, `retry: false`.
- Tests de l'écran Détail : chargement, succès, « Livre introuvable », erreur serveur avec « Réessayer ».
- Test de `useSearchBooks` avec `renderHook` : chargement de la page 2.
- Test de navigation avec `renderRouter`.

Atelier 4b :

- `testID` et libellés accessibles sur le parcours d'ajout.
- `.maestro/add-book.yaml`.
- `.eas/workflows/e2e.yml` : build puis Maestro (fichier seulement, non exécuté).
- `stryker.config.json` ciblé sur `src/features/*/services/**`.
- Tests supplémentaires qui tuent les mutants survivants ; scores avant et après consignés dans `aidd-docs/ecarts-supports.md`.

### Étape 7 : `solution/m5`

Un commit par correction, dans l'ordre du guide :

1. `React.memo` sur `BookRow`.
2. `useCallback` sur `onPress` et `renderItem`.
3. `useMemo` sur le tri.
4. Styles dans `StyleSheet.create`.
5. Props primitives et découpage de `BookRow` en sous-composants.

### Étape 8 : `solution/m6`

- `FlatList` remplacée par FlashList v2, props devenues inutiles supprimées.
- En-têtes par lettre et `getItemType`.
- expo-image : taille `-M`, `recyclingKey`, `cachePolicy="memory-disk"`, `transition`.
- Favori lu depuis la bibliothèque par `isbn` au lieu d'un `useState` local.

### Étape 9 : `bonus/reanimated`

Issue de `solution/m6`, non fusionnée dans `solution/m7` :

- Animation « livre ajouté » : la couverture rétrécit et vole vers l'onglet Bibliothèque.
- Animation d'apparition avec l'API CSS de Reanimated 4.
- Bouton de démonstration qui bloque le thread JS 2 secondes pendant l'animation.

### Étape 10 : `solution/m7`

Issue de `solution/m6` :

- Expo Module local `modules/scan-feedback-expo` (Kotlin et Swift), mêmes méthodes que le Turbo Module.
- `plugins/withVibratePermission.js`, déclaré dans `app.json` ; permission manuelle retirée.
- `babel-plugin-transform-remove-console` en production (`error` et `warn` conservés).
- `eas.json` : profil `preview` (APK), channels.
- expo-updates : channel `preview`, `runtimeVersion` en politique `fingerprint`.
- R8 et réduction des ressources via `expo-build-properties`.

### Étape 11 : livrables de clôture

- `aidd-docs/ecarts-supports.md` : écarts SDK 57 / 58 à reporter dans les slides et PDF.
- `aidd-docs/tests-configuration-eas.md` : liste des tests à effectuer par le formateur pour valider la configuration EAS (login, `eas init`, build preview, installation par QR code, `eas update`, comportement du fingerprint, workflow Maestro).
- Liste de ce qui reste à valider sur téléphone réel : scan caméra, vibration.

## Files to modify

- `package.json`, `package-lock.json`, `bun.lock` (supprimé) — passage à npm, dépendances
- `App.js`, `index.js` (supprimés) — remplacés par Expo Router
- `app.json`, `eas.json`, `tsconfig.json`, `babel.config.js`, `jest.config.js`, `eslint.config.js` — configuration
- `src/app/**` — routes
- `src/api/openLibrary.ts`, `src/utils/isbn.ts`, `src/data/books.seed.json` — starter
- `src/components/RuntimeInfo.tsx` — M1
- `modules/scan-feedback/**` — M2
- `src/features/**`, `src/services/**`, `src/hooks/**`, `src/stores/**`, `src/lib/**` — M3
- `jest.setup.ts`, `src/mocks/**`, `**/*.test.ts(x)`, `.maestro/add-book.yaml`, `.eas/workflows/e2e.yml`, `stryker.config.json` — M4
- `src/features/library/**` — M5, M6
- `modules/scan-feedback-expo/**`, `plugins/withVibratePermission.js` — M7
- `README.md`, `aidd-docs/ecarts-supports.md`, `aidd-docs/tests-configuration-eas.md` — documentation

## Verification

Pour chaque branche, dans cet ordre :

1. `npx tsc --noEmit`
2. `npx expo lint`
3. `npx jest`
4. `npx expo-doctor`
5. `npx expo prebuild --clean`, puis build et lancement sur émulateur Android et simulateur iOS
6. Parcours manuel piloté sur l'app : saisie d'un ISBN, Détail, ajout, Bibliothèque

Contrôles propres à certaines branches :

| Branche | Contrôle |
| --- | --- |
| `main` | Les défauts volontaires sont observables : toutes les lignes se re-rendent au changement de tri |
| `solution/m1` | `npx expo export --platform android` produit un bundle `.hbc` |
| `debug/m2` | Chaque panne reproduit le symptôme attendu |
| `solution/m3` | Mode avion, app tuée puis relancée : bibliothèque et fiches consultées affichées ; ajout hors ligne rejoué au retour du réseau |
| `solution/m4` | Flow Maestro vert sur émulateur ; score Stryker avant et après |
| `solution/m5`, `solution/m6` | Profilage React avant et après : nombre de composants rendus au changement de tri |
| `solution/m6` | Le favori ne saute plus d'un livre à l'autre après scroll |
| `solution/m7` | `AndroidManifest.xml` généré contient `VIBRATE` sans déclaration manuelle ; bundle de production sans `console.log` |

Non vérifiable sans le formateur : scan caméra réel et vibration sur téléphone, `eas build`, `eas update`, exécution du workflow EAS.
