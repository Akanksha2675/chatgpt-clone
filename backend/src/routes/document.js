import router from 'express';
import { getGeminiResponse } from '../services/gemini.ts';
import { getGroqResponse, getGroqStreamResponse } from '../services/groq.ts';
import { queryDocs } from '../services/pinecone.ts';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { Document } from "@langchain/core/documents";
import { splitDocuments } from '../services/documentProcessor.ts'
import { ensureIndexAndUpsertDocs } from '../services/pinecone.ts';
import { loadWebPage } from '../services/documentLoader.ts';

const documentRouter = router();

const upload = multer({ });

// Single ingestion endpoint. Accepts an optional PDF file ('pdf-file') and/or
// an optional URL ('url') in the same multipart/form-data request, and
// ingests whichever of the two are supplied.
documentRouter.post('/documents/ingest', upload.single('pdf-file'), async (req, res) => {
    try {
        const file = req.file;
        const url = req.body?.url?.trim();

        if (!file && !url) {
            return res.status(400).json({ error: 'Provide a PDF file, a URL, or both.' });
        }

        const docs = [];

        if (file) {
            const parser = new PDFParse({ data: file.buffer });
            const data = await parser.getText();

            docs.push(new Document({
                pageContent: data.text,
                metadata: {
                    source: file.originalname || "Ingested PDF",
                }
            }));
        }

        if (url) {
            const webDocs = await loadWebPage(url);
            docs.push(...webDocs);
        }

        // We can break down the documents into chunks.
        const splitDocs = await splitDocuments(docs);

        // I will ingest docs into pinecone. 
        await ensureIndexAndUpsertDocs(splitDocs);

        res.status(200).json({ message: 'Content ingested successfully' });

    } catch (error) {
        console.log("error: ", error.message);
        res.status(500).json({ error: 'Failed to ingest content' });
    }
});

export default documentRouter;