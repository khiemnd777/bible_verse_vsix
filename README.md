# Bible Verse Footer ✝️

Every time you open VSCode, this extension displays a random Bible verse (in English) in the status bar.  
You can also trigger the `Bible: Random Verse` command to fetch a new verse instantly.

> *“Your word is a lamp to my feet and a light to my path.” — Psalm 119:105*

---

## 🔧 Command

- `Bible: Random Verse` – Display a new random verse.

---

## ⚙️ Build and Package

To build and generate a `.vsix` extension file:

```bash
yarn install        # Install dependencies
yarn run package    # Compile source with esbuild
vsce package        # Package the extension as a .vsix file
