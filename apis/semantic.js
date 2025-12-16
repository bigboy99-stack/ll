import express from "express";
import helmet from "helmet";
import cors from "cors";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = 3004;
const COLLECTION_NAME = "gemii";
const DENSE_VECTOR = "wd-dense-vector";
const SPARSE_VECTOR = "wd-sparse-vector";
const EMBEDDING_MODEL = 'gemini-embedding-001';

// 1. Security & Parsing
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());
app.use(cors());

const genAI = new GoogleGenAI({});
const qdrant = new QdrantClient({url: process.env.qdranturl, apiKey: process.env.qdrantapikey});

app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query required" });

    // 1. Dense query embedding
    const embedResult = await genAI.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: query,
      config: {
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768,
      }
    });

    const queryVector = embedResult.embeddings[0].values;

    // 2. Hybrid search
    const results = await qdrant.search(COLLECTION_NAME, {
      prefetch: [
        {
          vector: {
            name: DENSE_VECTOR,
            vector: queryVector,
          },
          limit: 10,
        },
        {
          sparse_vector: {
            name: SPARSE_VECTOR,
            text: query,
          },
          limit: 10,
        },
      ],
      fusion: "rrf",
      limit: 10,
    });

    // 3. Return clean results
    res.json(
      results.map(r => ({
        score: r.score,
        text: r.payload.text,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(port, ()=>{`server running on ${port}`})