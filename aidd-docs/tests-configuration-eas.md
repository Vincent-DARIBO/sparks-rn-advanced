# Tests de configuration EAS (branche `solution/m7`)

Tests à exécuter par le formateur, dans l'ordre, avec son propre compte Expo. Rien de ce qui suit n'a été exécuté par l'agent qui a préparé la branche : aucun compte Expo, aucun build natif.

Les champs `expo.updates.url` et `expo.extra.eas.projectId` sont volontairement absents de `app.json` : ils dépendent du compte de chaque participant et sont écrits par les commandes des tests 2 et 3. Les commandes `eas` s'exécutent avec `npx eas-cli@latest <commande>` (projet npm, pas bun).

## 1. Connexion

- Commande : `npx eas-cli@latest login` puis `npx eas-cli@latest whoami`
- Attendu : `whoami` affiche le nom d'utilisateur Expo.
- Échec : `Not logged in` ou erreur d'authentification.

## 2. Lier le projet : `eas init`

- Commande : `npx eas-cli@latest init`
- Attendu : le projet `shelfscan` est créé ou lié ; `app.json` contient `expo.extra.eas.projectId` (et éventuellement `expo.owner`).
- Échec : `slug` déjà pris par un autre compte, ou `projectId` toujours absent d'`app.json` (`git diff app.json`).

## 3. Configurer les mises à jour : `eas update:configure`

- Commande : `npx eas-cli@latest update:configure` (si la commande a été renommée dans la version d'EAS CLI installée, suivre `npx eas-cli@latest update --help` et https://docs.expo.dev/eas-update/getting-started/)
- Attendu : `app.json` contient `expo.updates.url` (`https://u.expo.dev/<projectId>`) ; `expo.runtimeVersion.policy` reste `fingerprint` ; `eas.json` garde les `channel` `development`, `preview` et `production`.
- Échec : `updates.url` absent, `runtimeVersion` remplacé par une chaîne fixe, ou channels supprimés d'`eas.json`.

## 4. Build `preview` (APK)

- Commande : `npx eas-cli@latest build --platform android --profile preview`
- Attendu : build `finished` sur expo.dev, artefact `.apk`, lien d'installation et QR code affichés en fin de commande. Le build utilise le channel `preview` (visible dans la page du build).
- Échec : erreur Gradle (Kotlin du module `scan-feedback-expo`, R8 qui retire une classe de Vision Camera ou MMKV : ajouter une règle dans le projet Android via un config plugin, ne jamais éditer `android/`), ou erreur de fingerprint/runtime version.

## 5. Installation par QR code

- Action : scanner le QR code du build `preview` avec le téléphone Android, installer l'APK (autoriser les sources inconnues si demandé), lancer l'app.
- Attendu : ShelfScan s'ouvre ; la caméra demande sa permission ; le scan d'un ISBN déclenche la vibration (module Expo `ScanFeedbackExpo`) ; l'écran d'infos affiche un modèle d'appareil.
- Échec : crash au lancement (`adb logcat` ou page du build), pas de vibration, modèle d'appareil vide.

## 6. Publication d'une mise à jour OTA

- Action : modifier un texte visible d'un écran (par exemple le titre de l'écran d'accueil), puis :
  `npx eas-cli@latest update --channel preview --message "Nouveau titre"`
- Attendu : la commande affiche un `Update group ID`, la plateforme `android`, le `Runtime version` (hash fingerprint) identique à celui du build du test 4 (visible dans `npx eas-cli@latest update:list --branch preview` et sur la page du build).
- Échec : `Runtime version` différent de celui du build : le fingerprint a changé (dépendance, plugin ou fichier natif modifié depuis le build). Refaire un build `preview` avant de publier.

## 7. Réception de la mise à jour

- Action : fermer complètement l'app (retirer de la liste des apps récentes), la relancer, la refermer, la relancer.
- Attendu : après le premier lancement l'ancienne version s'affiche encore (téléchargement en arrière-plan) ; après le deuxième, le nouveau texte est visible.
- Échec : texte inchangé après trois lancements avec connexion réseau : channel du build différent de `--channel`, `updates.url` absent ou incorrect, ou runtime version différent.

## 8. Fingerprint et module natif

- Action : sur une branche de test, ajouter une dépendance à code natif (par exemple `npx expo install expo-haptics`), puis :
  `npx eas-cli@latest update --channel preview --message "Dépend d'un nouveau module natif"`
  Comparer aussi `npx expo-updates fingerprint:generate` avant et après l'ajout.
- Attendu : le hash fingerprint change ; la `Runtime version` de cette mise à jour diffère de celle du binaire installé ; relancer l'app installée deux fois ne montre PAS cette mise à jour.
- Échec : l'ancien binaire reçoit la mise à jour (le fingerprint n'a pas détecté le changement natif : vérifier `runtimeVersion.policy`).
- Nettoyer ensuite : `git restore package.json package-lock.json` et retirer la dépendance de test.

## 9. Build `production` (AAB)

- Commande : `npx eas-cli@latest build --platform android --profile production`
- Attendu : build `finished`, artefact `.aab`, `versionCode` incrémenté automatiquement (`appVersionSource: remote`), channel `production`.
- Échec : build rejeté faute de keystore (laisser EAS en générer un au premier build, interactif) ; AAB absent (profil sans `buildType: app-bundle`).

## 10. Workflow `.eas/workflows`

Le workflow est créé par un autre agent sur une autre branche : il n'existe pas sur `solution/m7`. Après fusion de cette branche :

- Commande : `npx eas-cli@latest workflow:validate .eas/workflows/<fichier>.yml` puis `npx eas-cli@latest workflow:run .eas/workflows/<fichier>.yml`
- Attendu : la validation passe ; le run apparaît dans l'onglet Workflows d'expo.dev et chaque job passe au vert (build puis publication selon le contenu du fichier).
- Échec : erreur de schéma YAML à la validation, profil de build ou channel inexistant dans `eas.json`, job en échec.

## 11. Permission VIBRATE via le config plugin

- Commande (locale, pas besoin de compte) : `npx expo prebuild --clean --platform android` puis `grep VIBRATE android/app/src/main/AndroidManifest.xml` ; supprimer ensuite `android/` (`rm -rf android`).
- Attendu : une ligne `<uses-permission android:name="android.permission.VIBRATE"/>` ; `app.json` ne liste plus que `android.permission.CAMERA` dans `android.permissions` et déclare `./plugins/withVibratePermission` dans `plugins`.
- Précision : le template Expo ajoute lui-même `VIBRATE` ; ce test ne prouve donc pas à lui seul le plugin. Preuve isolée : `node -e "const p=require('./plugins/withVibratePermission'); const c=p({name:'x',slug:'x',mods:{}}); c.mods.android.manifest({modRequest:{},modResults:{manifest:{'uses-permission':[]}},...c}).then(r=>console.log(JSON.stringify(r.modResults)))"` doit afficher la permission `VIBRATE`.
- Échec : `VIBRATE` absente du manifeste, ou erreur `Cannot find module` au prebuild (chemin du plugin dans `app.json`).

## 12. Absence de `console.log` en production

- Commande : `npx expo export --platform android --no-bytecode --no-minify --output-dir /tmp/export-prod` puis `grep -c "render BookRow" /tmp/export-prod/_expo/static/js/android/*.js`
- Attendu : `0`. Témoin dans un bundle de développement : `npx expo export --platform android --no-bytecode --no-minify --dev --output-dir /tmp/export-dev` puis le même `grep -c` renvoie `1`. `console.error` et `console.warn` sont conservés.
- Échec : compteur à `1` en production (le plugin Babel n'est pas appliqué : `babel.config.js` absent ou `env.production` mal placé ; relancer avec `-c` pour vider le cache Metro).
- Nettoyer : `rm -rf /tmp/export-prod /tmp/export-dev`.
- Sur le build EAS, le bundle est en bytecode Hermes : la vérification se fait via l'export ci-dessus, pas en ouvrant l'APK.

## 13. R8 et réduction des ressources

- Commande : `npx expo prebuild --clean --platform android` puis `grep -n "enableMinifyInReleaseBuilds\|enableShrinkResourcesInReleaseBuilds" android/gradle.properties` ; supprimer ensuite `android/`.
- Attendu : les deux propriétés à `true`.
- Échec : propriétés absentes ou à `false` (plugin `expo-build-properties` mal déclaré dans `app.json`). Si le build `production` plante à l'exécution (classe retirée), c'est une règle R8 manquante : tester d'abord avec `enableMinifyInReleaseBuilds: false` pour confirmer.
