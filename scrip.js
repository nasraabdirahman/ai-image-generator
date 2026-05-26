const button = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const image = document.getElementById("image");
const status = document.getElementById("status");
const D_button = document.getElementById("downloadBtn");


button.addEventListener("click", async () => {
    const prompt = promptInput.value;

    if(!prompt) {
        status.textContent = "Enter a prompt";
        return;
    }

    status.textContent = "Generating...";
    image.style.display = "none";

    try {
        const response = await fetch("https://image-api.nasrafaisal72.workers.dev/", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt
                })
            }
        );
        if(!response.ok)
        {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const blob = await response.blob();

        image.src = URL.createObjectURL(blob);
        image.style.display = "block";
        status.textContent = "";
    }
    catch(error)
    {
        console.log(error);
        status.textContent = error.message;
    }
})

D_button.addEventListener("click", () => {

    const a = document.createElement("a");
    a.href = image.src;
    a.download = "ai-image.png";
    a.click();
})