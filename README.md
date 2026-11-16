# ShelfScan

Projet fil rouge de la formation React Native avancé (2 jours). ShelfScan scanne le code-barres ISBN d'un livre, affiche sa fiche Open Library et conserve une bibliothèque personnelle.

La branche `main` contient le starter volontairement naïf : chaque atelier en corrige un défaut précis.

## Prérequis

- Node.js 22.13 ou plus récent
- Git et un éditeur (VS Code)
- Android Studio avec un SDK Android récent
- JDK 17
- Un téléphone Android (débogage USB activé) ou un émulateur

## Commandes

```bash
npm install
npx expo run:android
npx expo start
npm test
npx tsc --noEmit
npx expo lint
```

Le projet utilise npm exclusivement. Les dossiers `android/` et `ios/` sont générés par `expo prebuild` (Continuous Native Generation) et ne sont jamais versionnés.

## Simulateur iOS (Apple silicon)

```bash
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 npm run ios:simulator -- --device "iPhone 17"
```

Le scanner `react-native-vision-camera-barcode-scanner` embarque ML Kit (`MLKitBarcodeScanning`, `MLImage`), dont la tranche arm64 n'existe que pour appareil : le link échoue sur un simulateur Apple silicon. Le script pose `SHELFSCAN_IOS_SIMULATOR=1`, que `react-native.config.js` lit pour exclure le scanner de l'autolinking iOS, puis lance `expo prebuild --clean --platform ios` et `expo run:ios`. Sur simulateur, l'écran Scan affiche « Caméra indisponible sur simulateur » et la saisie manuelle reste utilisable. Le scan réel se teste sur appareil (Android ou iPhone) avec `npx expo run:ios --device` ou `npx expo run:android`, sans la variable ; relancer `npx expo prebuild --clean` avant de repasser sur appareil.

## Branches

| Branche | Contenu |
| --- | --- |
| `main` | Starter naïf : structure à plat, `FlatList` de 500 livres, `fetch` dans des `useEffect`, `console.log` partout |
| `solution/m1` | Correction du M1 : informations du runtime (Hermes, Fabric) |
| `solution/m2` | Correction du M2 : Turbo Module local et scan ISBN avec Vision Camera |
| `solution/m3` | Correction du M3 : TanStack Query, persistance, architecture par feature |
| `solution/m4` | Correction du M4 : tests Jest, MSW, Maestro, mutation testing |
| `solution/m5` | Correction du M5 : profiling et optimisation des rendus |
| `solution/m6` | Correction du M6 : FlashList v2 et expo-image |
| `solution/m7` | Correction du M7 : Expo Module, config plugin, build et mises à jour EAS |
| `debug/m2` | Trois pannes natives pour l'exercice de dépannage du M2 |
| `bonus/reanimated` | Atelier optionnel sur les animations Reanimated 4 |

Les branches `solution/m1` à `solution/m7` sont cumulatives.

## Déploiement (EAS)

Profils d'`eas.json` : `development` (dev client), `preview` (APK installable, channel `preview`), `production` (AAB, channel `production`). `expo-updates` utilise `runtimeVersion: { policy: "fingerprint" }` : une mise à jour OTA ne cible que les binaires dont le code natif est identique.

`expo.updates.url` et `expo.extra.eas.projectId` dépendent du compte Expo de chacun et ne sont pas versionnés. Pour les générer :

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest update:configure
```

Puis :

```bash
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest update --channel preview --message "Nouveau titre"
npx eas-cli@latest build --platform android --profile production
```

Particularités de la branche `solution/m7` : `ScanFeedbackExpo` (Expo Module, `modules/scan-feedback-expo`) remplace le Turbo Module dans `ScanFeedbackService` (le Turbo Module reste dans le dépôt pour comparaison), la permission `VIBRATE` vient du config plugin `plugins/withVibratePermission.js`, les `console.*` sont supprimés en production (hors `error` et `warn`) et R8 est activé en release. Liste des vérifications à faire avec un compte Expo : `aidd-docs/tests-configuration-eas.md`.

## API Open Library

Gratuite et sans clé.

- Fiche d'un livre : `https://openlibrary.org/isbn/{isbn}.json`
- Recherche par titre : `https://openlibrary.org/search.json?q={titre}&page={n}&limit=20`
- Couvertures : `https://covers.openlibrary.org/b/isbn/{isbn}-S|M|L.jpg`

La liste de 500 livres de la bibliothèque (`src/data/books.seed.json`) a été générée une fois par `scripts/generate-seed.mjs` puis figée.

ISBN de démonstration : `9780441013593` (Dune).
