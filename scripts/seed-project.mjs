#!/usr/bin/env node
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";
import { parseArgs } from "node:util";

// Load .env.local first (Next.js convention, precedence), then .env as fallback
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) loadEnv({ path: file, override: false });
}

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from "firebase/firestore";

const STATUSES = new Set(["In Progress", "Completed", "Archived"]);
const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

function fail(msg, code = 1) {
  console.error(`✗ ${msg}`);
  process.exit(code);
}

function splitCsv(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) fail(`Variable d'environnement manquante : ${name}`);
  return v;
}

async function uploadImage(imagePath) {
  const region = requireEnv("AWS_REGION");
  const accessKeyId = requireEnv("AWS_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("AWS_SECRET_ACCESS_KEY");
  const bucket = requireEnv("AWS_S3_BUCKET");

  const absPath = resolve(imagePath);
  const buffer = await readFile(absPath).catch(() => {
    fail(`Image introuvable : ${absPath}`);
  });

  const ext = extname(absPath).toLowerCase();
  const contentType = MIME_BY_EXT[ext];
  if (!contentType) {
    fail(`Extension non supportée : ${ext} (supportées : ${Object.keys(MIME_BY_EXT).join(", ")})`);
  }

  const safeName = basename(absPath).replace(/\s+/g, "-");
  const key = `projects/${Date.now()}-${safeName}`;

  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function buildFirebaseApp() {
  return initializeApp({
    apiKey: requireEnv("NEXT_PUBLIC_APIKEY"),
    authDomain: requireEnv("NEXT_PUBLIC_AUTHDOMAIN"),
    projectId: requireEnv("NEXT_PUBLIC_PROJECTID"),
    storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_APPID,
  });
}

async function main() {
  const { values } = parseArgs({
    options: {
      title: { type: "string" },
      description: { type: "string" },
      status: { type: "string" },
      image: { type: "string" },
      subtitle: { type: "string" },
      job: { type: "string" },
      client: { type: "string" },
      "app-link": { type: "string" },
      repository: { type: "string" },
      maquette: { type: "string" },
      technologies: { type: "string" },
      tags: { type: "string" },
      icons: { type: "string" },
      "created-at": { type: "string" },
    },
    strict: true,
  });

  for (const key of ["title", "description", "status", "image"]) {
    if (!values[key]) fail(`--${key} est requis`);
  }
  if (!STATUSES.has(values.status)) {
    fail(`--status doit être l'un de : ${[...STATUSES].join(" | ")}`);
  }

  const createdAt = values["created-at"]
    ? new Date(values["created-at"])
    : new Date();
  if (Number.isNaN(createdAt.valueOf())) {
    fail("--created-at invalide (attendu ISO 8601)");
  }

  console.log("→ Upload de l'image vers S3…");
  const imageUrl = await uploadImage(values.image);
  console.log(`  imageUrl = ${imageUrl}`);

  const adminEmail = requireEnv("FIREBASE_ADMIN_EMAIL");
  const adminPassword = requireEnv("FIREBASE_ADMIN_PASSWORD");

  const app = buildFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("→ Authentification Firebase…");
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword).catch(
    (err) => fail(`Auth Firebase échouée : ${err.message ?? err.code}`),
  );

  const projectData = {
    title: values.title,
    subtitle: values.subtitle ?? "",
    job: values.job ?? "",
    description: values.description,
    imageUrl,
    imagesUrl: [],
    technologies: splitCsv(values.technologies),
    icons: splitCsv(values.icons),
    tags: splitCsv(values.tags),
    links: {
      app_link: values["app-link"] ?? "",
      repository: values.repository ?? "",
      maquette: values.maquette ?? "",
    },
    status: values.status,
    createdAt: Timestamp.fromDate(createdAt),
    client: values.client ?? "",
  };

  console.log("→ Écriture dans Firestore (collection 'projects')…");
  const ref = await addDoc(collection(db, "projects"), projectData);

  await signOut(auth).catch(() => {});

  console.log(`✓ Projet créé avec id ${ref.id}`);
  console.log(`  → /projets/${ref.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
