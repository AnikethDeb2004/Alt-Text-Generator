// @ts-nocheck
const endpoint = import.meta.env.VITE_AZURECV_ENDPOINT + 'computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=caption';
const apiKey = import.meta.env.VITE_AZURECV_APIKEY;

export const azure = {
    getCaption: async () => {
        const imageInputElement = document.querySelector('#imageInput');
        const altTextElement = document.querySelector('#altText');
        const resetButtonElement = document.querySelector('#resetButton');

        let image = imageInputElement.files[0];

        function updateScreen() {
            imageInputElement.style.display = 'none';
            altTextElement.style.display = 'block';
            resetButtonElement.style.display = 'block';
        }

        if(image.size > 20971520)
        {
            updateScreen();
            return 'Image size too large. File must be smaller than 20971520 bytes or 20.97 MB.';
        }
        
        function showImageOnScreen() {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(image);
            fileReader.onload = function() {
                let imageElement = document.querySelector('#image');
                imageElement.src = fileReader.result;
                imageElement.style.margin = '5vh auto';
                imageElement.style.display = 'block';
                updateScreen();
            }
        };
        showImageOnScreen();

        let response = await fetch(endpoint, {
            method: 'POST',
            body: image,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': apiKey
            },
        });

        const responseBody = await response.json();

        console.log(responseBody);

        return responseBody.captionResult.text;
    }
};