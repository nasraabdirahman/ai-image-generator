//makes the module available to cloudflare
export default {
    //handles incomming API request
    async fetch(request, env)
    {
        // graps request url
        const url = new URL(request.url);

        //specify what websites are allowed to send to worker (what communication is permitteed)
        if(request.method === "OPTIONS")
        {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST"
                }
            });
        }
        //allows post request to /
        if(request.method !== "POST" || url.pathname !== "/")
        {
            return json({error: "Not Allowed"}, 405);
        }

        try {
            //reads the prompt from request body and checks if it exists.
            const { prompt } = await request.json();
            if(!prompt) return json({error: "Prompt is required"}, 400);

            //Generate image from prompt
            const result = await env.AI.run(
                "@cf/stabilityai/stable-diffusion-xl-base-1.0", //chose and ai model
                {prompt}
            );

            return new Response(result, {
                headers: {
                    "Content-Type": "image/jpeg", 
                    "Access-Control-Allow-Origin": "*"
                },
            });
        }
        catch (err)
        {
            return json ({error: "Failed to generate image", details: err.message}, 500);
        }
    }
}

    //return JSON responses
    function json(data, status = 200)
    {
        return new Response(JSON.stringify(data), {
            status,
            headers: {
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST"
            }
        });
    }