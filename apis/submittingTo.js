import { GoogleGenAI } from "@google/genai";
// import express from "express";
// import helmet from "helmet";
// import cors from "cors";
import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from 'dotenv'
dotenv.config()
const COLLECTION_NAME = "gemii";
// const app = express();
// const port = 3004;
const EMBEDDING_MODEL = 'gemini-embedding-001';
const url = process.env.qdranturl;

// 1. Security & Parsing
    // app.use(express.json());
    // app.use(express.urlencoded());
    // app.use(helmet());
    // app.use(cors());

const genAI = new GoogleGenAI({});

const qdrant = new QdrantClient({url: url, apiKey: process.env.qdrantapikey});


const CORPUS = [
  "technology",
  "innovation",
  "software",
  "hardware",
  "computer",
  "algorithm",
  "database",
  "network",
  "security",
  "encryption",

  "artificial",
  "intelligence",
  "machine",
  "learning",
  "neural",
  "model",
  "training",
  "inference",
  "prediction",
  "automation",

  "business",
  "finance",
  "economy",
  "market",
  "investment",
  "startup",
  "entrepreneur",
  "strategy",
  "growth",
  "revenue",

  "health",
  "medicine",
  "biology",
  "genetics",
  "therapy",
  "diagnosis",
  "wellness",
  "nutrition",
  "fitness",
  "mental",

  "science",
  "physics",
  "chemistry",
  "astronomy",
  "research",
  "experiment",
  "theory",
  "data",
  "analysis",
  "discovery",

  "education",
  "learning",
  "knowledge",
  "teaching",
  "student",
  "curriculum",
  "training",
  "skill",
  "career",
  "development"
];

const requests = CORPUS.map(text => ({ role: "user", parts: [{ text }] }));


async function ingestDocuments() {
    console.log("🚀 Starting ingestion process (Non-Batch Mode)...");

    const allPoints = [];

    // 1. Loop through each sentence and call the API individually
    for (let i = 0; i < CORPUS.length; i++) {
        const text = CORPUS[i];
        const id = i + 1;

        try {
            // 2. Call Gemini API for a SINGLE document
            const response = await genAI.models.embedContent({
                // The model parameter must be included in every call
                model: EMBEDDING_MODEL,
                
                // The 'contents' field expects an array of Content objects
                contents: requests,
                config: {
                    taskType: "RETRIEVAL_DOCUMENT",
                    outputDimensionality: 768,
                },
            });
            
            // 3. Map result into Qdrant Point Structure
            // Note: embedContent returns a single embedding array
            const embedding = response.embeddings[0].values;
            // console.log(embedding, 90);

            allPoints.push({
                id: id,
                vectors: {
                  "wd-dense-vector": embedding,
                },
                payload: {
                  text,
                },
            });

            process.stdout.write(`\r✅ Embedded and prepared document ${id} of ${CORPUS.length}.`);

        } catch (error) {
            console.error(`\n❌ Error processing document ${id}: ${error.message}`);
            // Continue to the next document instead of stopping the whole process
            continue; 
        }
    }

    // 4. Upsert (Store) ALL Points to Qdrant in one final batch
    console.log(`\n\n💾 Storing ${allPoints.length} points in Qdrant collection '${COLLECTION_NAME}'...`);
    
    
    if (allPoints.length === 0) {
        console.log("No embeddings were generated. Aborting upsert.");
        return;
    }

    try {
        const result = await qdrant.upsert(COLLECTION_NAME, {
            wait: true, 
            points: allPoints,
            
        });

        console.log("🎉 Success! All documents indexed.");
        console.log(`Qdrant Upsert Status: ${result.status}`);

    } catch (error) {
        console.error("❌ Error upserting points to Qdrant:", error.message);
    }
}
ingestDocuments()