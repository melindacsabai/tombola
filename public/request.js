export const requestFn = {

    get: async function(url){
        const response = await fetch(url);
        return response.json();
    },
    post: async function(url, datas){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datas) 
        });
        return response.json();
    }

}



