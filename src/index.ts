import ChatOpenAI from "./ChatOpenAI";
import { affirmativePrompt, negativePrompt, refereePrompt } from "./prompt";
import 'dotenv/config';

const MAX_ROUNDS = 5;
const TOPIC = '进化论是真的吗?'

async function main() {
    const affirmative = new ChatOpenAI(
        process.env.OPENAI_MODEL_1 as string,
        process.env.OPENAI_API_KEY_1 as string,
        process.env.OPENAI_BASE_URL_1 as string,
        affirmativePrompt
    );

    const negative = new ChatOpenAI(
        process.env.OPENAI_MODEL_2 as string,
        process.env.OPENAI_API_KEY_2 as string,
        process.env.OPENAI_BASE_URL_2 as string,
        negativePrompt
    );

    const referee = new ChatOpenAI(
        process.env.OPENAI_MODEL_3 as string,
        process.env.OPENAI_API_KEY_3 as string,
        process.env.OPENAI_BASE_URL_3 as string,
        refereePrompt
    );

    let affirmativeResponse = '';
    let negativeResponse = '';
    let conversation = '';
    for (let i = 0; i < MAX_ROUNDS; i++) {
        console.log(`====================== Round ${i + 1} ======================`);
        console.log(`Affirmative:`);
        affirmativeResponse = await affirmative.chat(i == 0 ? TOPIC : `Negative: ${negativeResponse}`);
        conversation += `Affirmative: ${affirmativeResponse}\n`;
        console.log('\n');
        console.log(`Negative:`);
        negativeResponse = await negative.chat(`Affirmative: ${affirmativeResponse}`);
        conversation += `Negative: ${negativeResponse}\n`;
        console.log('\n');
    }
    console.log(`====================== DEBATE END ======================`);
    console.log('Referee:');
    await referee.chat(conversation);
}

main();