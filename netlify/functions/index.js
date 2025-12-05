import { tokenize } from "kuromojin";

/**
 * 给句子的汉字加注音（返回 surface 和 reading）
 * @param {string} text
 * @returns {Promise<Array<{surface: string, reading: string}>>}
 */
async function annotateReading(text) {
    const tokens = await tokenize(text);

    return tokens.map(t => ({
        surface: t.surface_form,
        reading: t.reading || ""
    }));
}

// Netlify function entry
export default async (req, context) => {
    try {
        const { text } = await req.json();

        if (!text) {
            return new Response(
                JSON.stringify({ error: "Missing 'text' field" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const result = await annotateReading(text);

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
