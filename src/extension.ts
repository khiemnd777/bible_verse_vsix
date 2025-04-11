// src/extension.ts
import * as vscode from 'vscode';
import fetch from 'node-fetch';

let statusBarItem: vscode.StatusBarItem;
let currentRef: string | null = null;

const sampleRefs = [
  'John 3:16',
  'Romans 8:28',
  'Psalm 23:1',
  'Jeremiah 29:11',
  'Proverbs 3:5',
  'Matthew 6:33',
  'Isaiah 41:10',
  'Joshua 1:9',
];

async function fetchRandomVerse(): Promise<{ text: string; ref: string }> {
  let ref: string;

  if (sampleRefs.length === 1) {
    ref = sampleRefs[0];
  } else {
    do {
      ref = sampleRefs[Math.floor(Math.random() * sampleRefs.length)];
    } while (ref === currentRef);
  }

  const url = `https://bible-api.com/${encodeURIComponent(ref)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Bible API error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();

  return {
    text: data.text.trim().replace(/\s+/g, ' '),
    ref: data.reference,
  };
}

async function updateVerse() {
  const verse = await fetchRandomVerse();
  currentRef = verse.ref;

  const maxLength = 60;
  let trimmedText = verse.text;
  if (trimmedText.length > maxLength) {
    const cutoffIndex = trimmedText.lastIndexOf(' ', maxLength);
    trimmedText =
      trimmedText
        .substring(0, cutoffIndex !== -1 ? cutoffIndex : maxLength)
        .trim() + '...';
  }

  statusBarItem.text = `📖 ${trimmedText} - ${verse.ref}`;
  statusBarItem.tooltip = `${verse.text} — ${verse.ref}`;
  statusBarItem.color = '#FFD700';
  statusBarItem.command = 'bibleVerse.random';
  statusBarItem.show();
}

export function activate(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  context.subscriptions.push(statusBarItem);

  updateVerse();

  setInterval(updateVerse, 5 * 60 * 1000); // auto-refresh every 5 minutes

  const disposable = vscode.commands.registerCommand(
    'bibleVerse.random',
    async () => {
      await updateVerse();
      vscode.window.showInformationMessage('📖 Bible verse refreshed!');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
