import { getDB, connectDB, closeDB } from "../db.js";
import { embedText } from "../gemini.js";

await connectDB();

const chunks = [
    "Solar panel efficiency has improved significally over the past decade, with modern photovoltaic cells converting over 22% of sunlight into usable electricity.",
    "Wind turbines generate electricity  by converting kinetic energy from moving air into rotational motion, which a generator then converts into electrical power.",
    "Battery storage systems allow excess renewable energy generated during peak production to be used later when demand is high but generation is low",
    "Adults who consistently fewer than six hours per night show measurable declines in memory consolidation and reaction time.",
    "Blue light exposure from screens in teh hours before bedtime can delay the release of melatonin, making it harder to fall asleep.",
    "A consistent sleep schedule, even on weekends, helps regulate the body's circadian rhythm more effectively than sleep duration alone.",
];

const documents = [];
for(const chunk of chunks){
    const embedding = await embedText(chunk, "RETRIEVAL_DOCUMENT");
    documents.push({ text: chunk, embedding });
}

const collection = getDB().collection("documentChunks");
await collection.insertMany(documents);

console.log(`Inserted ${documents.length} documents.`);
await closeDB();
