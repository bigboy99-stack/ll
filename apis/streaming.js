import express from "express";
import helmet from "helmet";
import cors from "cors";
import aws from "aws-sdk";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config(); 

const schema = new mongoose.Schema({
    title: { type: string, required: true },
    snippet: { type: string, required: true },
    body: { type: string, required: true }
}, {timestamps: true});

const Blog = mongoose.model('Blog', schema);
export default Blog;

// --- CONFIGURATION ---
const S3_BUCKET = 'YOUR_S3_BUCKET_NAME'; // REPLACE ME
const s3 = new aws.S3();

const app = express();
const port = 3000;

// --- 1. Mongoose Schema Definition for Media ---
// Use Media instead of Blog and correct types (String, not string)
const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    s3Key: { type: String, required: true, unique: true }, // The key used for streaming/downloading
    mimeType: { type: String, default: 'video/mp4' }, // To support dynamic Content-Type
    fileSize: { type: Number, required: true }, // Store file size to avoid repeated S3 headObject calls
    snippet: { type: String, required: false },
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully!');

        // Optional: Pre-populate mock data if the collection is empty
        const count = await Media.countDocuments();
        if (count === 0) {
            console.log('Inserting initial mock media data...');
            await Media.insertMany([
                { title: 'Epic Space Journey', s3Key: 'videos/space.mp4', fileSize: 100000000, mimeType: 'video/mp4' },
                { title: 'Ocean Waves', s3Key: 'videos/ocean.mp4', fileSize: 50000000, mimeType: 'video/mp4' },
            ]);
        }

    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Exit process if connection fails
        process.exit(1);
    }
};

// Middleware
app.use(cors()); // Enable all CORS requests
app.use(helmet()); // Enable helmet
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded()); // To parse form bodies

// --- MOCK METADATA (Replace with MongoDB logic) ---
const mediaMetadata = [
    { id: 1, title: 'Epic Space Journey', s3Key: 'videos/space.mp4' },
    { id: 2, title: 'Ocean Waves', s3Key: 'videos/ocean.mp4' },
];

app.get('/api/search', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const results = mediaMetadata.filter(item => 
        item.title.toLowerCase().includes(query)
    );
    res.json(results);
});

app.get('/api/stream/:s3Key', async (req, res) => {
    // 1. Get the Range header and the file key
    const range = req.headers.range;
    const s3Key = req.params.s3Key; // e.g., 'videos/space.mp4'

    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    // 2. Get the file size (S3 headObject)
    let fileSize;
    try {
        const headObject = await s3.headObject({ Bucket: S3_BUCKET, Key: s3Key }).promise();
        fileSize = headObject.ContentLength;
    } catch (error) {
        console.error('Error fetching file size from S3:', error);
        return res.status(404).send('File not found');
    }

    // 3. Parse the Range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = (end - start) + 1;
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4', // Adjust for audio if needed
    };

    // 4. Create the S3 stream request
    const s3Stream = s3.getObject({ 
        Bucket: S3_BUCKET, 
        Key: s3Key, 
        Range: `bytes=${start}-${end}` 
    }).createReadStream();

    // 5. Send Headers and Pipe the stream
    res.writeHead(206, headers); // 206 Partial Content
    s3Stream.pipe(res);

    s3Stream.on('error', (err) => {
        console.error('S3 Stream Error:', err);
        res.status(500).send('Streaming error');
    });
});

app.get('/api/download/:s3Key', async (req, res) => {
    const s3Key = req.params.s3Key;
    
    try {
        // 1. Set the correct headers for download
        // The 'Content-Disposition' header forces the browser to download the file
        const fileName = s3Key.split('/').pop();
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        // Use s3.headObject to get the ContentType if you want more accurate headers
        res.setHeader('Content-Type', 'application/octet-stream'); 

        // 2. Create the S3 stream for the whole file
        const s3Stream = s3.getObject({ 
            Bucket: S3_BUCKET, 
            Key: s3Key 
        }).createReadStream();

        // 3. Pipe the entire S3 file stream directly to the response
        s3Stream.pipe(res);

        s3Stream.on('error', (err) => {
            console.error('S3 Download Stream Error:', err);
            // Check if headers have already been sent before sending a 500
            if (!res.headersSent) {
                res.status(500).send('Download error');
            }
        });

    } catch (error) {
        console.error('Download setup error:', error);
        res.status(500).send('Server setup error for download.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});